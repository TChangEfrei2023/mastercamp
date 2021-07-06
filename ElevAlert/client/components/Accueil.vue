<template>
	<div>
		<section id="cover">
			<div class = "cover-contain">
				<h1>Bienvenue</h1>
				<h1>sur</h1> 
				<h1>ElevAlert</h1>
				<p class="presentation1">ElevAlert est un service technique qui permet à ses adhérants d'avoir 
			une meilleure vue sur les éventuelles pannes qui peuvent se produire à tout moment.</p>
			</div>
		</section>
		<h2> - Nos services - </h2>
		<br>
		<div class="inline">
			<div class="display">
				<button class="sizeBtn left" @click="moveSlideShow(false)"> &lt; </button>
				<div class="containerCadre">
					<div v-if="page==0" class="cadre">
						<div class="image pic0"></div>
						<h3 class="sectionTitle"> Détection des pannes</h3>
						<p class="presentation2"> En tant qu'adhérant chez ElevAlert, vous profiterez d'une réduction considérable de temps de réparation de vos ascenseurs en cas de pannes.
						Notre but est de faciliter la réparation des pannes de vos ascenseurs en localisant l'origine des pannes avec une bonne précision à l'aide de nos outils. </p>
					</div>
					<div v-if="page==1" class="cadre">
						<div class="image pic1"></div>
						<h3 class="sectionTitle"> Rapport détaillé pour chaque panne </h3>
						<p class="presentation2"> Grâce à la détection des pannes, nous sommes capables de vous fournir un rapport détaillé sur une éventuelle panne qui permettra 
							aux réparateurs de se focaliser sur le problème et ainsi réduire considérablement le temps de réparation. </p>
					</div>
					<div v-if="page==2" class="cadre">
						<div class="image pic2"></div>
						<h3 class="sectionTitle"> Accès à la platforme ElevAlert </h3>
						<p class="presentation2"> Vous êtes une entreprise possédant beaucoup d'ascenseurs ? Pas de soucis, nos adhérants possèdent un accès sur notre
							platforme web. Il vous suffira de vous connecter afin d'avoir une vue générale sur l'état de vos ascenseurs équipés de nos outils, 
							ainsi qu'un historique des pannes réglées et même en cours de réparation. </p>
					</div>
					<div v-if="page==3" class="cadre">
						<div class="image pic3"></div>
						<h3 class="sectionTitle"> Notifications des pannes </h3>
						<p class="presentation2"> Le plus important pour nos adhérants est de pouvoir être averti le plus vite possible. Lorsqu'une panne survient,
							notre serveur est capable de recevoir l'information rapidement afin qu'on puisse vous en avertir par deux moyens : 
							un appel téléphonique de notre part pour vous avertir et fournir les détails, et un mail à votre adresse éléctronique dans le cas où
							vous seriez indisponible.</p>
					</div>
				</div>
				<button class="sizeBtn right" @click="moveSlideShow(true)"> &gt; </button>
			</div>
		</div>
		<div class="minicadre">
			<h2> - Contact - </h2>
			<br>
			<p class="detail"> Email : <b>elevalert@hotmail.com</b> </p>
			<p class="detail"> Tel : <b>01 50 25 16 52</b> </p>
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

	.containerCadre {
		position:relative;
		z-index: -1;
		box-shadow:0px 10px 10px rgba(0,0,0,0.6);
	}
	.inline {
		display:flex;
		justify-content: center;
	}

	#cover {
		display: flex;
		background-image: url("../img/ascenseur.jpg");
		background-size: cover;
		background-position: top center;
		height: 100%;
		width: 100%;
		align-items: center;
  		justify-content: center;
		font-size: 30px;
		z-index: 1;
		margin-bottom:50px;
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
		color: #EFEFEF;
		margin-left: auto;
    	margin-right: auto;
	}
	
	#cover .cover-contain p{
		padding: 5px;
	}

	.cadre {
		z-index:0;
	}
	
	.pic0 {
		background-image:url("../img/schema.png");
		background-color:rgba(255,255,255,0.1);
	}

		
	.pic1 {
		background-image:url("../img/reparation.jpg");
		background-color:rgba(0,0,0,0.3);
		background-attachment:scroll;
		background-size:100%;
	}

		
	.pic2 {
		background-image:url("../img/screenshotClient.png");
		background-color:rgba(0,0,0,0.3);
	}

		
	.pic3 {
		background-image:url("../img/details.png");
		background-color:rgba(0,0,0,0.3);
	}

	.presentation1 {
		max-width:700px;
		margin:auto;
		margin-top:250px;
		margin-bottom:25px;
		color: #EFEFEF;
		padding-top: 55px;
	}

	.presentation2 {
		padding-top:150px;
		padding-bottom:100px;
		padding-right:50px;
		padding-left:50px;
		background-color:rgba(0,0,0,0.5);
		color:white;
		border-radius:5px;
		font-size:20px;
		z-index:-2;
	}

	.display {
		position:relative;
		min-height: 300px;
		min-width: 400px;
		max-height:900px;
		max-width: 1000px;
		display:flex;
	}

	.sectionTitle {
		color:white;
		background-color:rgba(0,0,0,0.5);
		padding-top:100px;
		font-size:30px;
		z-index: -1;
	}

	.sizeBtn {
		width:50%;
		height:100%;
		border:none;
		color:white;
		background-color: rgba(255,255,255,1);
		position:absolute;
		z-index: 2;
		font-size:100px;
		opacity:0.1;
	}

	.image {
		background-color:rgba(0,0,0,0.9);
		opacity:0.9;
		background-repeat: no-repeat;
		background-position:center;
		background-size: 100%;
		height:100%;
		width:100%;
		filter:blur(1px);
		filter:brightness(0.5);
		box-sizing: border-box;
		position:absolute;
		z-index: -2;
	}

	.left {
		margin-right:50%;
		text-align: left;
		background-color: rgba(100,255,255,0);
	}

	.right {
		margin-left:50%;
		text-align: right;
		background-color: rgba(255,255,100,0);
	}

	.inline {
		display:flex;
		justify-content: center;
	}

	.minicadre {
		border:1px solid rgba(0,0,0,0.5);
		max-width: 500px;
		margin-left:auto;
		margin-right:auto;
		margin-top:50px;
		margin-bottom:50px;
		padding-top:50px;
		padding-bottom:50px;
		border-radius:15px;
		box-shadow: 0px 10px 10px rgba(0,0,0,0.5);
	}

	.detail {
		margin-bottom:25px;
		margin-top:25px;
	}

</style>