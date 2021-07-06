<template>
	<div>
		<section id="cover">
			<div class = "cover-contain">
				<h1>Bienvenue</h1>
				<h1>sur</h1> 
				<h1>ElevAlert</h1>
			</div>
			<p class="presentation1">ElevAlert est un service technique qui permet à ses adhérants d'avoir 
			une meilleure vue sur les éventuelles pannes qui peuvent se produire à tout moment.</p>
		</section>
		<h2> - Nos services - </h2>
		<br>
		<div class="inline">
			<button class="sizeBtn" @click="moveSlideShow(false)"> &lt; </button>
			<div class="display">
				<div v-if="page==0" class="cadre">
					<div class="test"></div>
					<h3 class="sectionTitle"> Détection des pannes</h3>
					<p class="presentation2"> En tant qu'adhérant chez ElevAlert, vous profiterez d'une réduction considérable de temps de réparation de vos ascenseurs en cas de pannes.
					Notre but est de faciliter la réparation des pannes de vos ascenseurs en localisant l'origine des pannes avec une bonne précision à l'aide de nos outils. </p>
				</div>
				<div v-if="page==1" class="cadre">
					<h3> Rapport détaillé pour chaque panne </h3>
					<p class="presentation2"> Grâce à la détection des pannes, nous sommes capables de vous fournir un rapport détaillé sur une éventuelle panne qui permettra 
						aux réparateurs de se focaliser sur le problème et ainsi réduire considérablement le temps de réparation. </p>
				</div>
				<div v-if="page==2" class="cadre">
					<h3> Accès à la platforme ElevAlert </h3>
					<p class="presentation2"> Vous êtes une entreprise possédant beaucoup d'ascenseurs ? Pas de soucis, nos adhérants possèdent un accès sur notre
						platforme web. Il vous suffira de vous connecter afin d'avoir une vue générale sur l'état de vos ascenseurs équipés de nos outils, 
						ainsi qu'un historique des pannes réglées et même en cours de réparation. </p>
				</div>
				<div v-if="page==3" class="cadre">
					<h3> Notifications des pannes </h3>
					<p class="presentation2"> Le plus important pour nos adhérants est de pouvoir être averti le plus vite possible. Lorsqu'une panne survient,
						notre serveur est capable de recevoir l'information rapidement afin qu'on puisse vous en avertir par deux moyens : 
						un appel téléphonique de notre part pour vous avertir et fournir les détails, et un mail à votre adresse éléctronique dans le cas où
						vous seriez indisponible.</p>
				</div>
			</div>
			<button class="sizeBtn" @click="moveSlideShow(true)"> &gt; </button>
		</div>
		<div class="minicadre">
			<h2> - Contact - </h2>
			<br>
			<p> Email : elevalert@hotmail.com </p>
			<p> Tel : 01 50 25 16 52 </p>
		</div>
		<footer>
		</footer>
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type:Object }
	},
	data () {
	  return {
	    message: "Hello",
		page:0
	  }
	},
	mounted() {
	  
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
	  redirectReg() {
	  	this.$router.push({ path:'/register/0' })
	  },
	  moveSlideShow(forward){
		  if(forward){
			  this.page = (this.page+1)%4
		  } else {
			  if(this.page == 0){
				  this.page = 3
			  } else {
				  this.page--
			  }
		  }
		  
	  }
	}
  }
</script>

<style scoped>
	.sizeBtn {
		height:70vh;
	}

	.inline {
		display:flex;
		justify-content: center;
	}

	#cover {
		background-image: url("../img/ascenseur.jpg");
		background-size: cover;
		background-position: top center;
		position: relative;
		z-index: 1;
		height: 100%;
		width: 100%;
	}

	#cover::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: black;
		opacity: .6;
		z-index: -1;
	}
	#cover .cover-contain h1{
		display: block;
		font-size: 4rem;
		width: fit-content;
		color: #EFEFEF;
		margin-left: auto;
    	margin-right: auto;
		padding-top: 40px;
	}

	#cover .cover-contain p{
		padding: 5px;
		
	}
	#cover .cover-contain{
		padding-top: 30px;
	}

	.cadre {
		border:1px black solid;
	}
	
	.test {

		background-image:url("/schema.png");
		background-color:rgba(0,0,0,0.3);
		background-repeat: no-repeat;
		background-position:center;
		height:100%;
		width:100%;
		max-width:70vw;
		max-height: 70vh;
		opacity:0.5;
		z-index: -2;
		filter:blur(2px);
		box-sizing: border-box;
	}

	.presentation1 {
		max-width:500px;
		margin:auto;
		margin-top:25px;
		margin-bottom:25px;
		color: #EFEFEF;
		padding-top: 55px;

	}

	.presentation2 {
		max-width:800px;
		margin:auto;
		margin-top:40vh;
		background-color:rgba(0,0,0,0.3);
		border-radius:5px;
		padding:25px;
	}

	.display {
		max-width:70vw;
		max-height:70vh;
		margin-top:auto;
		margin-bottom:auto;
		position:relative;
		z-index: -2;
	}

	.sectionTitle {
		padding:25px;
		background-color:rgba(0,0,0,0.3)
	}

	.minicadre {
		padding-top:100px;
		padding-bottom:100px;
		margin:auto;
	}
</style>