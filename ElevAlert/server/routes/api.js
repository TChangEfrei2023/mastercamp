const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
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
    req.session.elevatorId = null
  }
  next()
})


/*  Get the current session's information */
router.get('/me',(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }
  res.json(req.session.userId)
})


/*  Employee registers a new client. This route checks if the client already
    exists or not, and checks if his adresse already exists in the Adresse table
    before creating the client.

    nom : Client's name
    password : Password 
    email : Email (Must have for alert)
    tel : Client's phone number

    Adresse's var (self-explanatory): rue, cp, ville

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
  const nom = req.body.nom
  const password = req.body.password
  const email = req.body.email
  const tel = req.body.tel
  
  const rue = req.body.rue
  const cp = req.body.cp
  const ville = req.body.ville

  var idAdresse = 0

  const resultClient = await client.query({
    text:'SELECT * FROM public."Client" WHERE "nom"=$1;',
    values:[nom]
  })

  const foundClient = resultClient.rows.find(a => a.nom == nom)
  if(foundClient){
    res.status(400).json({ message: 'Client already exists.' })
    return

  } else {
    const resultAdresse = await client.query({
      text:'SELECT * FROM public."Adresse" WHERE "rue"=$1 AND "codePostal"=$2 AND "ville"=$3;',
      values:[rue,cp,ville]
    })

    const foundAdresse = resultAdresse.rows.find(a => a.rue == rue)
    if(foundAdresse){
      idAdresse = foundAdresse.idAdresse
    } else {
      const newAdresse = await client.query({
        text:'INSERT INTO public."Adresse" ("rue", "codePostal", "ville") VALUES ($1, $2, $3) RETURNING "idAdresse";',
        values:[rue,cp,ville]
      })

      idAdresse = newAdresse.rows[0].idAdresse
    }
    const hash = await bcrypt.hash(password, 10)
    const newClient = await client.query({
      text:'INSERT INTO public."Client" ("mdp", "nom", "email", "tel", "idAdresse") VALUES ($1, $2, $3, $4, $5);',
      values:[hash, nom, email, tel, idAdresse]
    })

    res.json({ message: "New client successfully added"})
  }
})


/*  Employee registers a new elevator. This route adds a new elevator in the database
    with a client's ID number and an address.

    id : Client's ID number

    Adresse's var (self-explanatory): rue, cp, ville

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
  const id = req.body.id
  
  const rue = req.body.rue
  const cp = req.body.cp
  const ville = req.body.ville

  var idAdresse = 0

  const resultClient = await client.query({
    text:'SELECT * FROM public."Client" WHERE "idClient"=$1;',
    values:[id]
  })

  const foundClient = resultClient.rows.find(a => a.idClient == id)
  if(foundClient){
    const resultAdresse = await client.query({
      text:'SELECT * FROM public."Adresse" WHERE "rue"=$1 AND "codePostal"=$2 AND "ville"=$3;',
      values:[rue,cp,ville]
    })
    const foundAdresse = resultAdresse.rows.find(a => a.rue == rue)
    if(foundAdresse){
      idAdresse = foundAdresse.idAdresse
    } else {
      const newAdresse = await client.query({
        text:'INSERT INTO public."Adresse" ("rue", "codePostal", "ville") VALUES ($1, $2, $3) RETURNING "idAdresse";',
        values:[rue,cp,ville]
      })

      idAdresse = newAdresse.rows[0].idAdresse
    }
    const newElevator = await client.query({
      text:'INSERT INTO public."Elevator" ("idClient", "idAdresse") VALUES ($1, $2);',
      values:[foundClient.idClient,idAdresse]
    })
    res.json({ message: "New elevator successfully installed."})
    return
  } else {
    res.status(400).json({ message: "Client not found."})
  }
})


/*  User tries to login from login page. Successful if both password and id checks out.
    id : Client's ID input
    password : Password input

    result : SQL query to check if client exists
    found : contains data of the query */
router.post('/login',async(req,res) => {
  const id = req.body.id
  const password = req.body.password

  if(typeof(req.session.userId) !== 'number') {
    const result = await client.query({
      text:'SELECT * FROM public."Client" WHERE "idClient" = $1;',
      values:[id]
    })

    const found = result.rows.find(a => a.idClient == id)

    if(found){
      if(await bcrypt.compare(password,found.mdp)) {
        req.session.userId = found.idClient
        res.json({ message: "Login successful" })
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
  const id = req.body.id
  const password = req.body.password

  if(typeof(req.session.elevatorId) !== 'number') {
    const resultElevator = await client.query({
      text:'SELECT * FROM public."Elevator" WHERE "idElevator" = $1;',
      values:[id]
    })
    const foundElevator = resultElevator.rows.find(a => a.idElevator == id)
    if(foundElevator){
      const resultClient = await client.query({
        text:'SELECT * FROM public."Client" WHERE "idClient" = $1;',
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
router.post('/disconnect',(req,res) => {
  req.session.userId = null
  req.session.elevatorId = null
  res.send()
})

/*  Elevator sends an error to server, which creates a new breakdown :
    elevatorId : Elevator's session ID
    errorId : Error code */
router.put('/error/:errorId',async(req,res) => {
  if(typeof(req.session.elevatorId) !== "number") {
    res.json({ message: "Elevator not connected" })
    return
  }
  const errorId = req.params.errorId
  
  const result = await client.query({
    text:'SELECT * FROM public."Error" WHERE "idError"=$1;',
    values:[errorId]
  })

  const found = result.rows.find(a => a.idError == errorId)
  if(found){
    

    res.json({ description: found.description, codeError: found.idError, idElevator: req.session.elevatorId })
    return
  }
  res.status(400).json({ message: 'Error not found.' })
})

module.exports = router