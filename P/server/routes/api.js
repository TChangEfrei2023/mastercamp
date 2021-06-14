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

//Achat d'un item
router.post('/shop',async(req,res) => {
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
  }

  const productId = Number(req.body.itemId)

  //Vérification de la validité de l'item
  if(isNaN(productId) || productId<=0) {
    res.status(501).json({ message: productId})
    return
  }

  //Vérification présence dans l'inventaire
  const search = found.items.find(a => a === productId)
  if(!search) {
    const result2 = await client.query({
      text:"SELECT price FROM items WHERE id=$1;",
      values:[productId]
    })
    if(productId<17) {
      found.items.push(productId)
      await client.query({
        text:"UPDATE users SET items=$1,money=$2 WHERE id=$3;",
        values:[found.items,(found.money-result2.rows[0].price),req.session.userId]
      })
    } else {
      found.equipped[4]++;
      await client.query({
        text:"UPDATE users SET equipped=$1,money=$2 WHERE id=$3;",
        values:[found.equipped,(found.money-result2.rows[0].price),req.session.userId]
      })
    }
  } else {
    res.status(501).json({ message: 'Item already in inventory'})
    return
  }

  res.send()
})

//Le combat (échange de dégâts entre zombie et joueur)
router.post('/combat',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(401).json({ message: "User not connected" })
    return
  }

  //Obtention de l'utilisateur
  const result = await client.query({
    text:"SELECT * FROM users;"
  })
  const human = result.rows.find(a => a.id === req.session.userId)
  if(!human){
    res.status(403).json({ message: "Forbidden" })
  }

  //Obtention du zombie appartenant au joueur
  var result2 = await client.query({
    text:"SELECT * FROM zombies;"
  })
  var zombie = result2.rows.find(a => a.id === req.session.userId)

  if(!zombie){
    res.status(401).json({ message: "No zombie" })
    return
  }

  const listOfItems = await client.query({
    text:"SELECT * FROM items ORDER BY id ASC;"
  })

  const helmet = listOfItems.rows[human.equipped[0]-1].properties
  const armor = listOfItems.rows[human.equipped[1]-1].properties
  const knife = listOfItems.rows[human.equipped[2]-1].properties
  const gun = listOfItems.rows[human.equipped[3]-1].properties

  //Méchanique infliger des dégâts
  var damageDealt = (knife+gun)-zombie.def
  if(damageDealt > 0){
    human.stats[0] += damageDealt
    await client.query({
      text:"UPDATE users SET stats=$1 WHERE id=$2",
      values:[human.stats,req.session.userId]
    })

    await client.query({
      text:"UPDATE zombies SET hp=$1 WHERE id=$2",
      values:[zombie.hp-damageDealt, req.session.userId]
    })
  }

  //Méchanique : prendre des dégâts
  const damageTaken = zombie.atk-(helmet+armor)
  if(damageTaken > 0){
    await client.query({
      text:"UPDATE users SET hp=$1 WHERE id=$2",
      values:[human.hp-damageTaken,req.session.userId]
    })
    if(human.hp-damageTaken <= 0){
      human.stats[2] += 1
      await client.query({
        text:"UPDATE users SET stats=$1 WHERE id=$2",
        values:[human.stats,req.session.userId]
      })
    }
  }

  res.send()
})

//Changement d'équipement
router.put('/shop/:itemId',async(req, res) => {
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
  }

  const productId = Number(req.params.itemId)

  //Vérification de la validité de l'item
  if(isNaN(productId) || productId<=0) {
    res.status(501).json({ message: 'Incorrect input on id'})
    return
  }

  const listOfItems = await client.query({
    text:"SELECT * FROM items ORDER BY id ASC;"
  })

  //Vérification de la présence dans l'inventaire
  const search = found.items.find(a => a === productId)
  if(search) {
    const type = listOfItems.rows[search-1].type
    found.equipped[type-1] = search

    await client.query({
      text:"UPDATE users SET equipped=$1 WHERE id=$2;",
      values:[found.equipped,req.session.userId]
    })

    res.send()
  } else {
    res.status(501).json({ message: 'Product not found in inventory' })
    return
  }
})

//Trouver un nouveau zombie (changement des valeurs du zombie quand le joueur s'enfui)
router.put('/zfind',async(req,res) => {
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
  }

  //Obtention du zombie appartenant au joueur
  var result2 = await client.query({
    text:"SELECT * FROM zombies;"
  })
  var found2 = result2.rows.find(a => a.id === req.session.userId)

  var zombie = req.body.zombie
  if(typeof(zombie) === "undefined"){
    res.status(400).json({ message: "Error zombie in body" })
    return
  }

  if(!found2){
    //Ajout d'un zombie si absence
    await client.query({
      text:"INSERT INTO zombies (id, hp, def, type, prize, atk) VALUES ($1, $2, $3, $4, $5, $6);",
      values:[found.id, zombie.hp, zombie.def, zombie.type, zombie.prize, zombie.atk]
    })
  } else {
    await client.query({
      text:"UPDATE zombies SET hp=$1, def=$2, type=$3, prize=$4, atk=$5 WHERE id=$6;",
      values:[zombie.hp, zombie.def, zombie.type, zombie.prize, zombie.atk,found.id]
    })
  }

  res.send()
})

//Mort du joueur (réinitialisation de son argent et remis à 100 de ses PV)
router.put('/death',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(401).json({ message: "User not connected" })
    return
  }
  //Vérification de l'existence de l'utilisateur
  const result = await client.query({
    text:"SELECT * FROM users WHERE id=$1;",
    values:[req.session.userId]
  })
  if(!result){
    res.status(403).json({ message: "Forbidden" })
    return
  }

  if(req.body.hp <= 0) {
    await client.query({
      text:"UPDATE users SET hp=$1, money=$2, stats=$3 WHERE id=$4",
      values:[100, 0, result.rows[0].stats, req.session.userId]
    })
  }
  
  res.send()
})

//Utilisation d'un medipack
router.put('/heal',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(401).json({ message: "User not connected" })
    return
  }
  //Vérification de l'existence de l'utilisateur
  const result = await client.query({
    text:"SELECT * FROM users WHERE id=$1;",
    values:[req.session.userId]
  })
  if(!result){
    res.status(403).json({ message: "Forbidden" })
    return
  }

  var player = result.rows[0]

  if(player.equipped[4]>0){
    player.equipped[4]--
    if(player.hp+50>=100){ //Max 100 hp
      await client.query({
        text:"UPDATE users SET hp=$1, equipped=$2 WHERE id=$3;",
        values:[100,player.equipped,req.session.userId]
      })
    } else if(player.hp+50 < 100 && player.hp!==0) {
      await client.query({
        text:"UPDATE users SET hp=$1, equipped=$2 WHERE id=$3;",
        values:[player.hp + 50,player.equipped,req.session.userId]
      })
    } else { //Tous les autres cas, y compris HP à 0
      res.status(403).json({ message: "Forbidden operation : medipack" })
      return
    }
  }

  res.send()
})

//Effacer le zombie en cas de sa mort et attribuer l'argent au joueur
router.delete('/zdeath',async(req,res) => {
  if(typeof(req.session.userId) !== "number") {
    res.status(401).json({ message: "User not connected" })
    return
  }
  
  //Vérification de l'existence de l'utilisateur
  var result = await client.query({
    text:"SELECT * FROM users WHERE id=$1;",
    values:[req.session.userId]
  })
  if(!result){
    res.status(403).json({ message: "Forbidden" })
    return
  }

  //Vérification de l'existence du zombie
  const result2 = await client.query({
    text:"SELECT * FROM zombies WHERE id=$1;",
    values:[req.session.userId]
  })
  if(!result2.rows[0]){
    res.status(403).json({ message: "No zombie to delete to begin with." })
    return
  }

  result.rows[0].stats[1] += 1
  //Gagner de l'argent
  await client.query({
    text:"UPDATE users SET money=$1, stats=$2 WHERE id=$3;",
    values:[result.rows[0].money+result2.rows[0].prize,result.rows[0].stats,req.session.userId]
  })

  //Effacer le zombie
  await client.query({
    text:"DELETE FROM zombies WHERE id=$1",
    values:[req.session.userId]
  })

  res.send()
})

module.exports = router