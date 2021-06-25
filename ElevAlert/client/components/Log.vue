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
	  }
	},
	methods: {

	}
  }
</script>

<style scoped>

</style>