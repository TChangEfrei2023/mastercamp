const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Client } = require('pg')
var validator = require("email-validator")

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: 'lolpopo',
  database: 'Survivors'
})

client.connect()

router.use((req,res,next) => {
  next()
})

//Obtention de l'id de l'utilisateur
router.get('/me',(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }
  res.json(req.session.userId)
})

//Obtention des infos du joueur
router.get('/profile',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }

  const result = await client.query({
    text:"SELECT * FROM users;"
  })

  var found = result.rows.find(a => a.id === req.session.userId)

  if(found){
    delete found['password'] //Ne pas envoyer le mdp évidemment
    res.json(found)
  } else {
    res.status(401).json({ message: "Authentication problem has occured." })
    req.session.userId = null
    return
  }
})

//Obtention de la liste d'items du jeu
router.get('/items',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.json({ message: "User not connected" })
    return
  }

  const result = await client.query({
    text:"SELECT * FROM items ORDER BY id ASC;"
  })
  res.json(result.rows)
})

//Obtention des infos du zombie attribué au joueur
router.get('/zombies',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(401).json({ message: "User not connected" })
    return
  }

  //Obtention de l'utilisateur
  const result = await client.query({
    text:"SELECT * FROM users;"
  })
  const found = result.rows.find(a => a.id === req.session.userId)
  if(!found){
    res.status(403).json({ message: "Forbidden" })
    return
  }

  //Obtention du zombie appartenant au joueur
  var result2 = await client.query({
    text:"SELECT * FROM zombies;"
  })
  var found2 = result2.rows.find(a => a.id === req.session.userId)

  if(!found2){
    found2 = {id:0,hp:0,def:0,type:-1,prize:0,atk:0}
  }

  res.json(found2)
})

//Inscription
router.post('/register',async(req,res) => {
  const email = req.body.email
  const password = req.body.password

  if(!validator.validate(req.body.email)) {
    res.status(501).json({ message: "Invalid email format" })
    return
  }

  const result = await client.query({
    text:"SELECT email, password FROM users;"
  })
  const found = result.rows.find(a => a.email === email)
  if(found){
    res.status(400).json({ message: 'Email has already been taken.' })
    return
  }

  const hash = await bcrypt.hash(password, 10)
  const newPlayer = await client.query({
    text:"INSERT INTO users (email, password, items, equipped, money, hp, stats, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;",
    values:[email,hash,[1,5,9,13],[1,5,9,13,0],0,100,[0,0,0],new Date()]
  })

  //Ajout d'un zombie dans la liste de zombies
  await client.query({
    text:"INSERT INTO zombies (id, hp, def, type, prize, atk) VALUES ($1, $2, $3, $4, $5, $6)",
    values:[newPlayer.rows[0].id,100,0,0,100,25]
  })

  res.send()
})

//Login
router.post('/login',async(req,res) => {
  const email = req.body.email
  const password = req.body.password

  //User not connected
  if(typeof(req.session.userId) !== 'number') {
    const result = await client.query({
      text:"SELECT * FROM users;"
    })

    const found = result.rows.find(a => a.email === email)

    if(found){
      if(await bcrypt.compare(password,found.password)) {
        req.session.userId = found.id
        res.send()
      } else {
        res.status(400).json({ message: "Wrong password" })
        return
      }
    } else {
      res.status(400).json({ message: "Email doesn't exist" })
      return
    }
  } else { //Already connected
    res.status(401).json({ message: "User already connected" })
    return
  }
})

router.post('/disconnect',(req,res) => {
  req.session.userId = null
  res.send()
})


module.exports = router