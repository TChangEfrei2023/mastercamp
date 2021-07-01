const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'lolpopo',
  database: 'elevalert_db'
})

client.connect()

/*  Define a new session's attributes
    userId : used by a real person trying to login
    elevatorId : used by an elevator to identify itself */
router.use((req,res,next) => {
  if(!req.session.initialised){
    req.session.initialised = true
    req.session.userId = null
    req.session.employe = false
    req.session.elevatorId = null
    req.session.nom = ''
  }
  next()
})


/*  Get the current session's information */
router.get('/me',async(req,res) => {
  if(typeof(req.session.userId) === "number") {
    res.json({ message : "User successfully connected", id: req.session.userId, employe: req.session.employe, nom: req.session.nom })
    return
  }

  if(typeof(req.session.elevatorId) === "number") {
    res.json({ message : "Elevator successfully connected", id: req.session.elevatorId, employe: req.session.employe })
    return
  }
  res.json({ message: "User or elevator not connected." })
  return
})

/*  Get elevators list from database */
router.get('/elevators',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(400).json({ message : "User not connected" })
    return
  }

  const select = 'SELECT "Elevator"."idElevator", "Client"."nom", "Adresse"."rue", "Adresse"."codePostal", "Adresse"."ville" '
  const from = 'FROM "Elevator", "Client", "Adresse" '
  const order = 'ORDER BY "Elevator"."idElevator";'
  var resultElevators
  if(req.session.employe == true){
    const where = 'WHERE "Elevator"."idClient" = "Client"."idClient" AND "Elevator"."idAdresse" = "Adresse"."idAdresse" '
    const query = select+from+where+order
    resultElevators = await client.query({
      text:query
    })
  } else {
    const where = 'WHERE "Elevator"."idClient" = "Client"."idClient" AND "Elevator"."idAdresse" = "Adresse"."idAdresse" AND "Elevator"."idClient" = $1 '
    const query = select+from+where+order
    resultElevators = await client.query({
      text:query,
      values:[req.session.userId]
    })
  }
  const foundElevators = resultElevators.rows
  if(foundElevators) {
    const resultBrokenElevators = await client.query({
      text:'SELECT DISTINCT "idElevator" FROM "Breakdown","Component" WHERE "Breakdown"."idComponent" = "Component"."idComponent" AND "Breakdown"."dateFin" IS null',
    })
    const foundBrokenElevators = resultBrokenElevators.rows
    for(var x of foundElevators){
      var verifyPresence = foundBrokenElevators.find(a => a.idElevator == x.idElevator)
      if(verifyPresence){
        x.exists = true
      } else {
        x.exists = false
      }
    }
    res.json({ message:"Table received.", content:foundElevators})
    return
  }
  res.json({ message:"No elevator"})
  return
})



/*  Get breakdowns list from database */
router.get('/breakdowns',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(400).json({ message : "User not connected" })
    return
  }

  const select = 'SELECT "idBreakdown","Component"."idComponent","Component"."idElevator", "rue", "codePostal", "ville", "dateDebut", "dateFin"  '
  const from = 'FROM "Breakdown","Component",("Elevator" LEFT JOIN "Adresse" ON "Elevator"."idAdresse" = "Adresse"."idAdresse") AS PA '
  const where = 'WHERE "Breakdown"."idComponent"="Component"."idComponent" AND PA."idElevator" = "Component"."idElevator" '
  const order = 'ORDER BY "idBreakdown";'
  var resultBreakdowns
  if(req.session.employe == true){
    const query = select+from+where+order
    resultBreakdowns = await client.query({
      text:query
    })
  } else {
    where = where.concat('',' AND "Component"."idElevator" = $1 ')
    const query = select+from+where+order
    resultBreakdowns = await client.query({
      text:query,
      values:[req.session.userId]
    })
  }

  const foundBreakdowns= resultBreakdowns.rows
  res.json({ message:"Table received.", content:foundBreakdowns})
  return
})


/*  Get clients list from database */
router.get('/clients',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(400).json({ message : "User not connected" })
    return
  }

  if(req.session.employe == false) {
    res.status(400).json({ message : "User not an employee" })
    return
  }

  const select = 'SELECT "idClient","nom","email","tel", "rue", "codePostal", "ville" '
  const from = 'FROM "Client","Adresse" '
  const where = 'WHERE "Client"."idAdresse" = "Adresse"."idAdresse" '
  const order = 'ORDER BY "idClient";'
  const query = select+from+where+order

  const resultClients = await client.query({
    text:query
  })

  const foundClients= resultClients.rows
  res.json({ message:"Table received.", content:foundClients})
  return
})

/*  Get clients list from database */
router.get('/components',async(req,res) => {
  if(typeof(req.session.elevatorId) !== "number") {
    res.status(400).json({ message : "User not connected" })
    return
  }

  const query = 'SELECT * FROM "Component" WHERE "idElevator" = $1 ORDER BY "idComponent";'

  const result = await client.query({
    text:query,
    values:[req.session.elevatorId]
  })

  const found= result.rows
  res.json({ message:"Table received.", content:found})
  return
})

/*  The website will regularly send a request to check if a change happened in the table Breakdown.
    This function sends a list of elevator to client and ElevAlert if breakdown found.

    sqlQuery : flexible query string that changes on type of user (client or employee)
    queryValue : array of value(s) that complements the sqlQuery
    
    result: sqlQuery that search unnotified breakdown
    found: list of elevators that have an unrepaired breakdown */
router.get('/notification',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }

  const select = 'SELECT "idBreakdown","Component"."idError","description","Component"."idElevator","dateDebut","Elevator"."idClient","Client"."nom","email","tel","rue","codePostal","ville" '
  const from = 'FROM "Breakdown","Error","Client","Elevator","Adresse","Component" '
  const where = 'WHERE "Elevator"."idElevator"="Component"."idElevator" '+
                'AND "Breakdown"."idComponent" = "Component"."idComponent" '+
                'AND "Component"."idError"="Error"."idError" '+
                'AND "Elevator"."idClient"="Client"."idClient"  '+
                'AND "Adresse"."idAdresse"="Elevator"."idAdresse" '+
                'AND "reception" = $1'
  const order = 'ORDER BY "idBreakdown";'
  var sqlQuery = select + from + where
  var queryValue = [false]
  if(req.session.employe == false){
    sqlQuery = sqlQuery.concat(' ',' AND "Elevator"."idElevator" IN (SELECT "idElevator" FROM "Elevator" WHERE "idClient" = $2)')
    queryValue.push(req.session.userId)
  }
  sqlQuery = sqlQuery.concat('',order)
  
  const result = await client.query({
    text:sqlQuery,
    values:queryValue,
  })
  
  const found = result.rows
  if(found){
    res.json({ message:"Breakdown detected !", result: found})
    return
  }
  res.json({ message:"No breakdown detected."})
  return
})




/*  Employee registers a new client. This route checks if the client already
    exists or not, and checks if his adresse already exists in the Adresse table
    before creating the client.

    nom : Client's name
    password : Password 
    email : Email (Must have for alert)
    tel : Client's phone number

    Adresse's var (self-explanatory): rue, codePostal, ville

    idAdresse : Adresse's ID
    
    resultClient : SQL query searching an occurrence of a client
    foundClient : contains data of the result :
    - Stops function if found (client already exists)
    - Continue if not found (new client)

    resultAdresse: SQL query searching an occurrence of an adresse
    foundAdresse : contains data of the result :
    - Put the ID of the already existing adresse into idAdresse
    - Creates new Adresse and return the new adresse's ID into idAdresse

    hash : hash password */
router.post('/register',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(400).json({ message : "User not connected" })
    return
  }

  if(req.session.employe == false) {
    res.status(400).json({ message : "User not an employee" })
    return
  }

  const nom = req.body.nom
  const password = "AZE"
  const email = req.body.email
  const tel = req.body.tel
  const rue = req.body.rue
  const codePostal = req.body.codePostal
  const ville = req.body.ville

  if(typeof(nom) !== "string" || nom == ''
    || typeof(email) !== "string" || email == '' 
    || typeof(tel) !== "string" || tel == ''
    || typeof(rue) !== "string" || rue == ''
    || typeof(codePostal) !== "string" || codePostal == ''
    || typeof(ville) !== "string" || ville == '') {
      res.status(400).json({ message : "Missing or invalid field(s)." })
      return
  }

  var idAdresse = 0

  const resultClient = await client.query({
    text:'SELECT * FROM "Client" WHERE "nom"=$1;',
    values:[nom]
  })

  const foundClient = resultClient.rows.find(a => a.nom == nom)
  if(foundClient){
    res.status(400).json({ message: 'Client already exists.' })
    return

  } else {
    const resultAdresse = await client.query({
      text:'SELECT * FROM "Adresse" WHERE "rue"=$1 AND "codePostal"=$2 AND "ville"=$3;',
      values:[rue,codePostal,ville]
    })

    const foundAdresse = resultAdresse.rows.find(a => a.rue == rue)
    if(foundAdresse){
      idAdresse = foundAdresse.idAdresse
    } else {
      const newAdresse = await client.query({
        text:'INSERT INTO "Adresse" ("rue", "codePostal", "ville") VALUES ($1, $2, $3) RETURNING "idAdresse";',
        values:[rue,codePostal,ville]
      })

      idAdresse = newAdresse.rows[0].idAdresse
    }
    const hash = await bcrypt.hash(password, 10)
    const newClient = await client.query({
      text:'INSERT INTO "Client" ("mdp", "nom", "email", "tel", "idAdresse") VALUES ($1, $2, $3, $4, $5);',
      values:[hash, nom, email, tel, idAdresse]
    })

    res.json({ message: "New client successfully added"})
  }
})


/*  Employee registers a new elevator. This route adds a new elevator in the database
    with a client's ID number and an address.

    id : Client's ID number

    Adresse's var (self-explanatory): rue, codePostal, ville

    idAdresse : Adresse's ID
    
    resultClient : SQL query searching an occurrence of a client
    foundClient : contains data of the result :
    - Stops function if not found (client doesn't exist)
    - Continue if found

    resultAdresse: SQL query searching an occurrence of an adresse
    foundAdresse : contains data of the result :
    - Put the ID of the already existing adresse into idAdresse
    - Creates new Adresse and return the new adresse's ID into idAdresse */
router.post('/installation',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(400).json({ message : "User not connected" })
    return
  }

  if(req.session.employe == false) {
    res.status(400).json({ message : "User not an employee" })
    return
  }

  const id = req.body.idClient
  
  const rue = req.body.rue
  const codePostal = req.body.codePostal
  const ville = req.body.ville
  const components = req.body.components

  if(typeof(id) !== "string" || id == ''
    || typeof(rue) !== "string" || rue == ''
    || typeof(codePostal) !== "string" || codePostal == ''
    || typeof(ville) !== "string" || ville == ''
    || components[0] == undefined) {
      res.status(400).json({ message : "Missing or invalid field(s)." })
      return
  }
  
  var idAdresse = 0

  const resultClient = await client.query({
    text:'SELECT * FROM "Client" WHERE "idClient"=$1;',
    values:[id]
  })

  const foundClient = resultClient.rows.find(a => a.idClient == id)
  if(foundClient){
    const resultAdresse = await client.query({
      text:'SELECT * FROM "Adresse" WHERE "rue"=$1 AND "codePostal"=$2 AND "ville"=$3;',
      values:[rue,codePostal,ville]
    })
    const foundAdresse = resultAdresse.rows.find(a => a.rue == rue)
    if(foundAdresse){
      idAdresse = foundAdresse.idAdresse
    } else {
      const newAdresse = await client.query({
        text:'INSERT INTO "Adresse" ("rue", "codePostal", "ville") VALUES ($1, $2, $3) RETURNING "idAdresse";',
        values:[rue,codePostal,ville]
      })

      idAdresse = newAdresse.rows[0].idAdresse
    }

    const newElevator = await client.query({
      text:'INSERT INTO "Elevator" ("idClient", "idAdresse") VALUES ($1, $2) RETURNING "idElevator";',
      values:[foundClient.idClient,idAdresse]
    })
    const newElevatorId = newElevator.rows[0].idElevator
    for(var x of components){
      const newComponent = await client.query({
        text:'INSERT INTO "Component" ("idElevator", "idError", "nom","status") VALUES ($1, $2, $3, $4);',
        values:[newElevatorId,x.idError,x.nom,true]
      })
    }
    res.json({ message: "New elevator successfully installed."})
    return
  } else {
    res.status(400).json({ message: "Client not found."})
  }
  
  
})


/*  An elevator is composed of components that are constantly tested by our service. ------------------------------------------------------------------------------------
    This route will add a component with its details. */
router.post('/compose/',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }

  const idElevator = req.body.idElevator
  const idError = req.body.idError
  const nom = req.body.nom
  const status = req.body.status

  if(typeof(idElevator) !== "string" || idElevator == ''
    || typeof(idError) !== "string" || idError == ''
    || typeof(nom) !== "string" || nom == ''
    || typeof(status) !== "string" || status == '') {
      res.status(400).json({ message : "Missing or invalid field(s)." })
      return
  }

  const resultBreakdown = await client.query({
    text:'SELECT * FROM "Breakdown" WHERE "idComponent"=$1 AND "dateFin" IS null;',
    values:[id]
  })
  const foundBreakdown = resultBreakdown.rows.find(a => a.idComponent == id)
  if(!foundBreakdown){
    res.json({ message: "Breakdown not found." })
    return
  }

  if(foundBreakdown.dateFin != null){
    res.json({ message: "This breakdown has already been repaired." })
    return
  }

  var date = new Date()
  var currentUTCDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))

  const updateBreakdown = await client.query({
    text:'UPDATE "Breakdown" SET "dateFin"=$1 WHERE "idComponent" = $2 AND "idBreakdown" = $3;',
    values:[currentUTCDate,id,foundBreakdown.idBreakdown]
  })

  res.json({ message: "Repair success" })
  return
})
    


/*  User tries to login from login page. Successful if both password and id checks out.
    id : Client's ID input
    password : Password input

    result : SQL query to check if client exists
    found : contains data of the query */
router.post('/login',async(req,res) => {
  if(req.body == {}){
    res.status(400).json({ message: "Tu m'as rien envoyé gro" })
    return
  }
  const id = req.body.idClient
  const idLogin = parseInt(id.match(/[0-9]+/));
  const employeLogin = id.match(/[a-zA-Z]+/);
  const password = req.body.password

  var found
  if(typeof(req.session.userId) !== 'number') {
    if(employeLogin != null) {
      const result = await client.query({
        text:'SELECT * FROM "Employe" WHERE "idEmploye" = $1;',
        values:[idLogin]
      })
      found = result.rows.find(a => a.idEmploye == idLogin)
    } else {
      const result = await client.query({
        text:'SELECT * FROM "Client" WHERE "idClient" = $1;',
        values:[id]
      })
      found = result.rows.find(a => a.idClient == id)
    }

    if(found){
      if(await bcrypt.compare(password,found.mdp)) {
        if(employeLogin){
          req.session.employe = true
          req.session.userId = found.idEmploye
        } else {
          req.session.userId = found.idClient
        }
        req.session.nom = found.nom
        res.json({ message: "Login successful", id:req.session.userId })
        return
      } else {
        res.status(400).json({ message: "Wrong password" })
        return
      }
    } else {
      res.status(400).json({ message: "Account doesn't exist" })
      return
    }
  } else {
    res.status(401).json({ message: "User already connected" })
    return
  }
})


/*  Elevator connects to server in order to identify itself when sending an error :
    elevatorId : Elevator's ID stored inside physical component
    password : Password from Elevator's client account
    found : contains the result of the SQL request */
router.post('/connect',async(req,res) => {
  const id = req.body.idElevator
  const password = req.body.password

  if(typeof(req.session.elevatorId) !== 'number') {
    const resultElevator = await client.query({
      text:'SELECT * FROM "Elevator" WHERE "idElevator" = $1;',
      values:[id]
    })
    const foundElevator = resultElevator.rows.find(a => a.idElevator == id)
    if(foundElevator){
      const resultClient = await client.query({
        text:'SELECT * FROM "Client" WHERE "idClient" = $1;',
        values:[foundElevator.idClient]
      })
      const foundClient = resultClient.rows.find(a => a.idClient == foundElevator.idClient)
      if(await bcrypt.compare(password,foundClient.mdp)) {
        req.session.elevatorId = foundElevator.idElevator
        res.json({ message: "Connection successful" })
      } else {
        res.status(400).json({ message: "Wrong password" })
        return
      }
    } else {
      res.status(400).json({ message: "Account doesn't exist" })
      return
    }
  } else {
    res.status(401).json({ message: "Elevator already connected" })
    return
  }
})

/*  User tries to disconnect, session's information are erased */
router.post('/logout',(req,res) => {
  req.session.userId = null
  req.session.employe = false
  req.session.elevatorId = null
  req.session.nom = ''
  res.send()
})

/*  Elevator sends an error to server, which creates a new breakdown :
    elevatorId : Elevator's session ID
    errorId : Error code */
router.put('/error/:idComponent',async(req,res) => {
  if(typeof(req.session.elevatorId) !== "number") {
    res.json({ message: "Elevator not connected" })
    return
  }
  const idComponent = req.params.idComponent
  

  const result = await client.query({
    text:'SELECT * FROM "Component" WHERE "idComponent"=$1 AND "idElevator" = $2;',
    values:[idComponent,req.session.elevatorId]
  })
  const found = result.rows.find(a => a.idComponent == idComponent)
  if(found){

    const resultCheckDate = await client.query({
      text:'SELECT * FROM "Breakdown" WHERE "idComponent"=$1 AND "dateFin" IS null;',
      values:[idComponent]
    })
    const foundCheckDate = resultCheckDate.rows.find(a => a.idComponent == idComponent)
    if(foundCheckDate){
      res.json({ message: "Breakdown still active." })
      return
    }

    var date = new Date()
    var currentUTCDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
    
    const newBreakdown = await client.query({
      text:'INSERT INTO "Breakdown" ("idComponent","dateDebut", "reception") VALUES ($1, $2, $3);',
      values:[idComponent, currentUTCDate, false]
    })

    const updateComponent = await client.query({
      text:'UPDATE "Component" SET "status"=$1 WHERE "idComponent"=$2;',
      values:[false, idComponent]
    })

    const resultError = await client.query({
      text:'SELECT * FROM "Error" WHERE "idError"=$1',
      values:[found.idError]
    })
    const foundError = resultError.rows.find(a => a.idError == found.idError)

    const resultClient = await client.query({
      text:'SELECT "idElevator","Elevator"."idClient","Elevator"."idAdresse","email","tel" FROM "Elevator","Client" WHERE "Client"."idClient" = "Elevator"."idClient" AND "idElevator"=$1',
      values:[req.session.elevatorId]
    })
    const foundClient = resultClient.rows.find(a => a.idElevator == req.session.elevatorId) 
    
    const resultAdresse = await client.query({
      text:'SELECT * FROM "Adresse" WHERE "idAdresse"=$1',
      values:[foundClient.idAdresse]
    })
    const foundAdresse = resultAdresse.rows.find(a => a.idAdresse = foundClient.idAdresse)
    /*
    let transport = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
          user: 'elevalert@hotmail.com',
          pass: 'lolpopo123'
      }
    })
    const adresse = foundAdresse.rue + " " + foundAdresse.codePostal + " " + foundAdresse.ville
    const text = "Bonjour, nous avons détecté une panne sur votre ascenseur (ID: "+req.session.elevatorId+") se trouvant à l'adresse "+adresse+".\n"
                  + "La raison de la panne est: "+foundError.description+" (code d'erreur: "+foundError.idError+").\n"
                  + "Veuillez appeler un technicien au plus vite.\nCordialement,\nElevalert\n\nCe message a été généré automatiquement."
    const message = {
      from: 'elevalert@hotmail.com', // Sender address
      to: foundClient.email, // List of recipients
      subject: 'Panne ascenseur', // Subject line
      text: text // Plain text body
    }
    
    transport.sendMail(message, function(err, info) {
      if (err) {
        console.log(err)
      } else {
        console.log(info)
      }
    })
    */
    res.json({ description: found.description, codeError: found.idError, idElevator: req.session.elevatorId, date: currentUTCDate })
    return
  }
  res.status(400).json({ message: 'Component or elevator not found.' })
  return
})


/*  If the website receives a notification of a breakdown, then it has to confirm that it has been notified.
    This function will set to true the 'reception' attribute of notified breakdowns.

    sqlQuery : flexible query string that changes on type of user (client or employee)
    queryValue : array of value(s) that complements the sqlQuery
    
    result: sqlQuery that search unnotified breakdown
    found: list of elevators that have an unrepaired breakdown */
router.post('/reception/:idBreakdown',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }

  const id = req.params.idBreakdown
  const resultBreakdown = await client.query({
    text:'SELECT * FROM "Breakdown" WHERE "idBreakdown"=$1;',
    values:[id]
  })
  const foundBreakdown = resultBreakdown.rows.find(a => a.idBreakdown == id)
  if(!foundBreakdown){
    res.json({ message: "Breakdown not found." })
    return
  }

  if(foundBreakdown.reception == true){
    res.json({ message: "Breakdown already notified." })
    return
  }
  
  if(!req.session.employe) {
    const resultElevator = await client.query({
      text:'SELECT * FROM "Elevator" WHERE "idElevator"=$1;',
      values:[foundBreakdown.idElevator]
    })
    const foundElevator = resultElevator.rows.find(a => a.idElevator == foundBreakdown.idElevator)
    if(foundElevator){
      if(req.session.userId != foundElevator.idClient) {
        res.json({ message: "User is not the owner of the elevator." })
        return
      }
    } else {
      res.json({ message: "Elevator not found." })
      return
    }
  }
  const updateBreakdown = await client.query({
    text:'UPDATE "Breakdown" SET "reception"=$1 WHERE "idBreakdown" = $2;',
    values:[true,id]
  })
  res.json({ message: "Notification success" })
  return
})

/*  Employee has to be able to change the state of an elevator.
    This route will help in that regard. */
router.post('/repaired/:idComponent',async(req,res) => {
  if(typeof(req.session.elevatorId) !== "number") {
    res.json({ message: "Elevator not connected" })
    return
  }

  const id = req.params.idComponent
  const resultBreakdown = await client.query({
    text:'SELECT * FROM "Breakdown" WHERE "idComponent"=$1 AND "dateFin" IS null;',
    values:[id]
  })
  const foundBreakdown = resultBreakdown.rows.find(a => a.idComponent == id)
  if(!foundBreakdown){
    res.json({ message: "Breakdown not found or already repaired." })
    return
  }

  var date = new Date()
  var currentUTCDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))

  const updateBreakdown = await client.query({
    text:'UPDATE "Breakdown" SET "dateFin"=$1 WHERE "idComponent" = $2 AND "idBreakdown" = $3;',
    values:[currentUTCDate,id,foundBreakdown.idBreakdown]
  })

  const updateComponent = await client.query({
    text:'UPDATE "Component" SET "status"=$1 WHERE "idComponent"=$2;',
    values:[true, id]
  })


  res.json({ message: "Repair success" })
  return
})




/*  Elevator has to send an update on his component
    This route will send a request to update a component's details. */
router.put('/update/:idComponent',async(req,res) => {
  if(typeof(req.session.elevatorId) !== "number") {
    res.json({ message: "Elevator not connected" })
    return
  }

  const id = req.params.idComponent

  const resultBreakdown = await client.query({
    text:'SELECT * FROM "Breakdown" WHERE "idComponent"=$1 AND "dateFin" IS null;',
    values:[id]
  })
  const foundBreakdown = resultBreakdown.rows.find(a => a.idComponent == id)
  if(!foundBreakdown){
    res.json({ message: "Breakdown not found." })
    return
  }

  if(foundBreakdown.dateFin != null){
    res.json({ message: "This breakdown has already been repaired." })
    return
  }

  var date = new Date()
  var currentUTCDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))

  const updateBreakdown = await client.query({
    text:'UPDATE "Breakdown" SET "dateFin"=$1 WHERE "idComponent" = $2 AND "idBreakdown" = $3;',
    values:[currentUTCDate,id,foundBreakdown.idBreakdown]
  })

  res.json({ message: "Repair success" })
  return
})



module.exports = router
