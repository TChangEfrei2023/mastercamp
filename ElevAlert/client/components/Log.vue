<template>
	<div>
		<div id="acc" v-if="isLoggedIn">
		  <!-- Wait for async props -->
		  <div v-if="zombies && typeof(items[0]) !== 'undefined' && info.equipped !== null">
	      	<header>
		      <nav class="navBar">
			    <router-link to='/' class="navButton"> Accueil </router-link>
			    <router-link to='/profile' class="navButton"> Profile </router-link>
			    <router-link to='/shop' class="navButton"> Boutique </router-link>
			    <router-link to='/combat' class="navButton"> Combat </router-link>
			  </nav>
		      <h1 id="title">Les derniers survivants</h1>
		      <h2 id="subtitle"> La chasse est ouverte ! </h2>
		    </header>
			<div>
			  <div class="stats">
			  	<div class="desc">
			  	  <p> Règles : </p>
			  	  <p> &#9830; Vous gagnez l'argent uniquement si le zombie est vaincu </p>
			  	  <p class="color"> &#9830; Vous perdez tout votre argent si vous mourrez </p>
				  <p> &#9830; [S'enfuire] sert à éviter le zombie et tomber sur un autre </p>
				  <p> &#9830; [Strike] sert à attaquer le zombie, vous prenez des dégâts en retour, <span class="color">même si le zombie meurt !</span></p>
				  <p> &#9830; [Soin] vous permet de gagner <span class="color">+50 Vies</span>, consomme <span class="color">1 Medipack</span> à l'utilisation. Achetable dans la boutique</p>
				  <p> &#9830; Appuyez sur [Chercher un zombie] lorsque vous battez un zombie </p>
				  <p> &#9830; <span class="color">Si vous êtes mort, dépensez votre argent avant de revivre en appuyant sur [Vous êtes mort] </span> </p>
			    </div>
			  </div>
			  <div class="stats">
			    <div class="desc">
			      <div class="pic" :style="{ backgroundImage:'url('+'https://u.cubeupload.com/NinjaSg/human.png'+')' }"></div>
			      <h2> Vous </h2>
				  <p> Vie : <span class="color">{{ getHp }} </span> <span v-if="damageTaken!==0"> (-{{ damageTaken }}) </span></p>
				  <p> Dégâts : <span class="color">{{ items[getKnife].properties + items[getGun].properties }} </span> </p>
				  <p> Défense : <span class="color">{{ items[getArmor].properties + items[getHelmet].properties }} </span> </p>
				  <button @click="heal" v-if="getHp>0 && getHp<100 && info.equipped[4]>0"> Soin ({{ info.equipped[4] }}) </button>
				  <button disabled v-else> Soin ({{ info.equipped[4] }}) </button>
				  <button @click="flee" v-if="zombieHp>0 && info.hp>0"> S'enfuire </button>
				  <button v-else disabled> S'enfuir </button>
				  <button @click="revive" v-if="info.hp<=0"> VOUS ETES MORT ! </button>
			    </div>
			    <p class="vs"> VS </p>
			    <div class="desc zombie">
			      <div class="pic" :style="{ backgroundImage:'url('+'https://u.cubeupload.com/NinjaSg/zombie.png'+')' }"></div>
			      <h2> {{ zombieType }} </h2>
				  <p> Vie : 
				  	<span class="color">{{ zombies.hp }}</span><span v-if="damageGiven!==0"> (-{{ damageGiven }}) </span></p>
				  <p> Dégâts : <span class="color">{{ zombies.atk }} </span> </p>
				  <p> Défense : <span class="color">{{ zombies.def }} </span> </p>
				  <p v-if="zombieHp<=0"> Gain de {{ zombies.prize }} $</p>
				  <button @click="strike" v-if="zombieHp>0 && info.hp>0"> Strike </button>
				  <button v-else disabled> Strike </button>
				  <button @click="flee" v-if="zombieHp<=0"> Chercher un zombie </button>
			    </div>
			  </div>
			</div>
		  </div>
		</div>
		<div v-else id="redirect">
		  <div class="redBar">
		    403
		  </div>
		  <p> Halte-là ! Vous n'êtes pas connecté ! </p>
		  <p> Redirection vers la page d'accueil dans {{ count }} secondes </p>
		</div>
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type: Object },
	  items : { type: Array, default: [] },
	  zombies : { type: Object }
	},
	data () {
	  return {
	  	loaded:0,
	    count:3,
	    damageTaken:0,
	    damageGiven:0
	  }
	},
	mounted() {
	  document.body.style="background-image:url('https://wallup.net/wp-content/uploads/2018/10/03/944615-dark-art-artwork-fantasy-artistic-original-psychedelic-horror-evil-creepy-scary-spooky-halloween.jpg'); background-attachment:fixed;"
	  if(!this.isLoggedIn){
  		setInterval(this.reduceCount,1000)
	  }
	  setTimeout(this.toMainPage, 3000)
	},
	watch:{
	  items:function(){
	  	this.loaded += 1	
	  },
	  zombies:function(){
	  	this.loaded += 1
	  }
	},
	computed: {
	  isLoggedIn: function() {
	  	if(typeof(this.info.id) !== "number"){
	  		return 0
	  	}
	  	return 1
	  },
	  getHp: function() {
	  	if(this.info.hp>0){
	  	  return this.info.hp
	  	} else {
	  	  return 0
	  	}
	  },
	  getHelmet: function() {
	  	return this.info.equipped[0]-1
	  },
	  getArmor: function() {
	  	return this.info.equipped[1]-1
	  },
	  getKnife: function() {
	  	return this.info.equipped[2]-1
	  },
	  getGun: function() {
	  	return this.info.equipped[3]-1
	  },
	  getMedipack: function() {
	  	return this.info.equipped[4]
	  },
	  zombieType: function() {
	  	if(!this.zombies) {
	  		return "undefined"
	  	}

	  	if(this.zombies.type === 1) {
	  	  return "Zombie Faible"
	  	} else if(this.zombies.type === 2){
	  		return "Zombie Commun"
	  	} else if(this.zombies.type === 3){
	  		return "Zombie Brutal"
	  	} else if(this.zombies.type === 4){
	  		return "Boss"
	  	} else if(this.zombies.type === 0 ){
	  		return "Premier zombie de votre carrière"
	  	} else {
	  		return "Pas de zombies"
	  	}
	  },
	  zombieHp: function() {
	  	if(!this.zombies) {
	  		return "undefined"
	  	}
	  	return this.zombies.hp
	  }
	},
	methods: {
	  strike() {
	  	const damageGiven = (this.items[this.getKnife].properties+this.items[this.getGun].properties)-this.zombies.def
	  	const damageTaken = (this.zombies.atk-(this.items[this.getHelmet].properties+this.items[this.getArmor].properties))
	  	if(damageGiven > 0) {
	  		this.zombies.hp = this.zombies.hp - damageGiven
	  		this.info.stats[1] += damageGiven
	  		this.damageGiven = damageGiven
	  		if(this.zombies.hp < 0) {
	  			this.info.stats[2] += 1
	  			this.zombies.hp = 0
	  			this.info.money = this.info.money + this.zombies.prize
	  		}
	  	}
	  	if(damageTaken > 0) {
	  		this.info.hp = this.info.hp-damageTaken
	  		this.damageTaken = damageTaken
	  		if(this.info.hp < 0) {
	  			this.info.stats[3] += 1
	  			this.info.hp = 0
	  		}
	  	}
	  	this.$emit('combat',this.zombies.hp)
	  },
	  flee() {
	  	this.generateZombie()
	  	this.$emit('find-zombie',this.zombies)
	  	this.damageTaken = 0
	  	this.damageGiven = 0
	  },
	  generateZombie() {
	  	const type = Math.floor(Math.random() * Math.floor(4)) + 1
	  	this.zombies.type = type
	    if(type === 1) {//Light zombie
	      this.zombies.hp = Math.floor(Math.random() * Math.floor(26)) + 25  //[25-50] hp
	      this.zombies.def = Math.floor(Math.random() * Math.floor(6)) //[0-5] def
	      this.zombies.atk = Math.floor(Math.random() * Math.floor(6)) + 20 //[20-25] atk
	      this.zombies.prize = this.zombies.hp + Math.floor(Math.random() * Math.floor(this.zombies.hp/2)) //[25 - 74] $
	    } else if(type === 2) { //Normal zombie
	      this.zombies.hp = Math.floor(Math.random() * Math.floor(101)) + 100 //[100-200] hp
	      this.zombies.def = Math.floor(Math.random() * Math.floor(6)) + 5 //[5-10] def
	      this.zombies.atk = Math.floor(Math.random() * Math.floor(11)) + 25 //[25-35] atk
	      this.zombies.prize = this.zombies.hp + Math.floor(Math.random() * Math.floor(this.zombies.hp/2)) //[100 - 299] $
	    } else if(type === 3) { //Heavy zombie
	      this.zombies.hp = Math.floor(Math.random() * Math.floor(301)) + 200 //[200-500] hp
	      this.zombies.def = Math.floor(Math.random() * Math.floor(6)) + 20 //[20-25] def
	      this.zombies.atk = Math.floor(Math.random() * Math.floor(21)) + 50 //[50-70] atk
	      this.zombies.prize = this.zombies.hp + Math.floor(Math.random() * Math.floor(this.zombies.hp/2)) //[200-724] $ 
	    } else { //Boss
	      this.zombies.hp = 1000
	      this.zombies.def = 50
	      this.zombies.atk = 100
	      this.zombies.prize = 5000
	    }
	  },
	  revive() {
	  	if(this.info.hp<=0){
	  	  this.$emit('revive',this.info.hp)
	  	  this.info.hp = 100
	  	  this.info.money = 0
	  	}
	  	this.flee()
	  },
	  heal() {
	  	if(this.getMedipack>0 && this.getHp>0){
	  	  this.$emit('heal')
	  	  if(this.getHp+50 >= 100) {
	  	  	this.info.hp = 100
	  	  } else {
	  	  	this.info.hp = this.info.hp + 50
	  	  }
	  	  this.info.equipped[4] = this.info.equipped[4]-1
	  	}
	  },
	  toMainPage(){
        if(typeof(this.info.id) !== "number"){
          router.push({ path:'/' })
        }
      },
      reduceCount(){
        this.count = this.count-1;
      }
	}
  }
</script>

<style scoped>
	.vs {
	  font-size:50px;
	  margin:auto;
	  text-shadow:1px 1px 2px white;
	  width:100%;
	}

	.stats {
	  display:flex;
	  flex-wrap:wrap;
	}

	.color {
		color:yellow;
	}

	.desc {
		margin:auto;
		margin-bottom:5px;
		background-color:rgba(0,0,25,0.5);
		width:500px;
		font-family: 'Lucida Sans';
		border-radius: 25px;
		border: 1px rgba(255,255,255,0.2) solid;

	}

	.zombie {
	  background-color:rgba(255,0,0,0.2);
	}

	.pic {
		width:150px;
		height:150px;
		margin:auto;
		border-radius:25px;
		margin-bottom:5px;
	}

	#acc {
		display:flex;
		flex-direction: column;
	}

	button {
		width:100px;
		height:50px;
		margin:auto;
	}

	.navBar {
    	position: absolute;
	    top:1;
	    left: 50%;
	    transform: translate(-50%, 0);
	    font-size:25px;
	    background-image: linear-gradient(#660000, red);
	    border-radius:5px;
	    width:100%;
  	}

    #acc button {
    	font-family: 'Creepster', cursive;
    	background:none;
    	color:red;
    	width:300px;
    	font-size:30px;
    	border:none;
    	transition:all 1s;
    }

    #acc button:disabled {
    	color:grey;
    }

    #acc button:disabled:hover {
    	color:grey;
    }

    #acc button:hover {
    	color:yellow;
    	transition:transform 0.5s;
    }

    .navButton {
	    display:inline-flex;
	    color:red;
	    text-shadow:1px 1px 2px black;
	    text-decoration:none;
	    margin-left:20px;
	    margin-right:20px;
	    flex:3;
	    transition:all 0.3s;
    }

    .navButton:hover {
    	background: -webkit-linear-gradient(yellow, red);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:0 0 0;
		transition:all 0s;
    }

	#redirect {
  		font-size:30px
  	}

	.redBar {
    	position:absolute;
	    left:0;
	    top:1;
	    width:100%;
	    height:30px;
	    background:#660000;
	    color:yellow;
  	}
</style>