<template>
    <div>
		<div id="acc" v-if="isLoggedIn">
		  <!-- Wait for async props -->
		  <div v-if="typeof(items[0]) !== 'undefined' && info.equipped !== null">
	      	<header>
		      <nav class="navBar">
			    <router-link to='/' class="navButton"> Accueil </router-link>
			    <router-link to='/profile' class="navButton"> Profile </router-link>
			    <router-link to='/shop' class="navButton"> Boutique </router-link>
			    <router-link to='/combat' class="navButton"> Combat </router-link>
			  </nav>
		      <h1 id="title" class="fade-in1">Votre profil</h1>
		    </header>
		    <div class="fade-in2">
		      <h2> Statistiques </h2>
			  <div class="desc">
				<p> Vie : <span class="color"> {{ getHp }} </span> </p>
				<p> Dégâts total : <span class="color"> {{ items[getKnife].properties + items[getGun].properties }} </span> </p>
				<p> Défense totale : <span class="color"> {{ items[getArmor].properties + items[getHelmet].properties }} </span> </p>
				<p> Argent : <span class="color"> {{ getMoney }} </span> </p>
			  </div>
			  <div class="desc">
				<p> Date de recrutement : <span class="color"> {{ getDate }} </span> </p>
				<p> Total de dégâts infligés : <span class="color"> {{ info.stats[1] }} </span> </p>
				<p> Total de zombies tués : <span class="color"> {{ info.stats[2] }} </span> </p>
				<p> Total de morts : <span class="color"> {{ info.stats[3] }} </span> </p>
			  </div>
			</div>
		  	<button @click="disconnect" class="fade-in3"> Se déconnecter </button>
		  	<h2 class="fade-in4"> Vos équipements </h2>
		  	<div id="player" class="fade-in5">
				<div class="desc">
					<div class="pic" :style="{ backgroundImage: 'url('+ items[getHelmet].image +')', backgroundColor:getRarity(getHelmet)[1] }"> {{ getRarity(getHelmet)[0] }} </div>
					<h3> {{ items[getHelmet].name }} </h3>
					<p> Level : <span class="color"> {{ items[getHelmet].level }} </span> </p>
					<p> Effets : <span class="color"> Défense +{{ items[getHelmet].properties }} </span> </p>
					<p> Description :
						<br>
						<span class="color"> {{ items[getHelmet].description }} </span> 
					</p>
				</div>
				<div class="desc">
					<div class="pic" :style="{ backgroundImage: 'url('+ items[getArmor].image +')', backgroundColor:getRarity(getArmor)[1] }"> {{ getRarity(getArmor)[0] }} </div>
					<h3> {{ items[getArmor].name }} </h3>
					<p> Level : <span class="color"> {{ items[getArmor].level }} </span> </p>
					<p> Effets : <span class="color"> Défense +{{ items[getArmor].properties }} </span> </p>
					<p> Description : 
						<br> 
						<span class="color"> {{ items[getArmor].description }} </span> 
					</p>
				</div>
				<div class="desc">
					<div class="pic" :style="{ backgroundImage: 'url('+ items[getKnife].image +')', backgroundColor:getRarity(getKnife)[1] }"> {{ getRarity(getKnife)[0] }} </div>
					<h3> {{ items[getKnife].name }} </h3>
					<p> Level : <span class="color"> {{ items[getKnife].level }} </span> </p>
					<p> Effets : <span class="color"> Dégâts +{{ items[getKnife].properties }} </span> </p>
					<p> Description : 
						<br> 
						<span class="color"> {{ items[getKnife].description }} </span> 
					</p>
				</div>
				<div class="desc">
					<div class="pic" :style="{ backgroundImage: 'url('+ items[getGun].image +')', backgroundColor:getRarity(getGun)[1] }"> {{ getRarity(getGun)[0] }} </div>
					<h3> {{ items[getGun].name }} </h3>
					<p> Level : <span class="color"> {{ items[getGun].level }} </span> </p>
					<p> Effets : <span class="color"> Dégâts +{{ items[getGun].properties }} </span> </p>
					<p> Description : 
						<br> 
						<span class="color"> {{ items[getGun].description }} </span> 
					</p>
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
	  items : { type: Array, default: [] }
	},
	data () {
	  return {
	  	 count:3
	  }
	},
	mounted() {
	  document.body.style="background-image:url('https://wallup.net/wp-content/uploads/2018/10/03/944615-dark-art-artwork-fantasy-artistic-original-psychedelic-horror-evil-creepy-scary-spooky-halloween.jpg'); background-attachment:fixed;"
	  if(!this.isLoggedIn){
  		setInterval(this.reduceCount,1000)
	  }
	  setTimeout(this.toMainPage, 3000)
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
	  getMoney: function() {
	  	return this.info.money
	  },
	  getDate: function() {
	  	return this.info.stats[0].slice(0,10)
	  }
	},
	methods: {
	  getRarity(itemId) {
	  	const itemLevel = this.items[itemId].level
	  	if(itemLevel === 1) {
	  		return ["Normal","grey"]
	  	} else if(itemLevel === 2) {
	  		return ["Rare","blue"]
	  	} else if(itemLevel === 3) {
	  		return ["Elite","purple"]
	  	} else {
	  		return ["Legendary","orange"]
	  	}
	  },
      toMainPage(){
        if(typeof(this.info.id) !== "number"){
          router.push({ path:'/' })
        }
      },
      reduceCount(){
        this.count = this.count-1;
      },
      disconnect(){
      	this.$emit('disconnect')
      }
	}
  }
</script>

<style scoped>
	.color {
		color:yellow;
	}

	.desc {
		margin:auto;
		margin-bottom:5px;
		background-color:rgba(0,0,25,0.5);
		max-width:500px;
		font-family: 'Lucida Sans';
		border-radius: 25px;
		border: 1px rgba(255,255,255,0.2) solid;
	}

	.pic {
		width:150px;
		height:150px;
		margin:auto;
		margin-top:10px;
		border-radius:25px;
		margin-bottom:5px;
	}

	#player {
		color:white;
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

	.pictures div {
		width:300px;
		height:300px;
		margin:auto;
	}

	.pictures div:hover {
		transform:scale(1.5);
		width:50%;
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

    #acc button {
    	font-family: 'Creepster', cursive;
    	background:none;
    	color:red;
    	width:300px;
    	font-size:30px;
    	border:none;
    	transition:all 1s;
    }

    #acc button:hover {
    	color:yellow;
    	text-shadow:0px 0px 10px red;
    	transition:transform 0.5s;
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