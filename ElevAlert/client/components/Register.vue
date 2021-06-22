<template>
  <div>
  	<div v-if="!isLoggedIn">
      <header>
        <nav class="navBar">
	      <router-link to='/' class="navButton"> Accueil </router-link>
	      <router-link to='/login' class="navButton" v-if="!isLoggedIn"> Connexion </router-link>
	      <router-link to='/register/0' class="navButton" v-if="!isLoggedIn"> Inscription </router-link>
	    </nav>
        <div class="fade-in1">
          <h1 id="title">Les derniers survivants</h1>
          <h2 id="subtitle">Préparation au combat</h2>
        </div>
      </header>
      <div class="fade-in1">
        <h2 class="title">Inscription</h2>
        <form id="userForm">
          <label> Entrez votre email ici : </label>
          <input type="email" v-model="information.email" placeholder="Email" required>
          <label> Et votre mot de passe : </label>
          <input type="text" v-model="information.password" placeholder="Mot de passe" required>
          <p> {{ errorMessage }} </p>
          <button @click="confirmRegister()">S'enregistrer</button>
  	  	</form>
  	  </div>
    </div>
    <div v-else id="redirect">
      <div class="redBar">
      	503
      </div>
      <p> Vous êtes inscrit et connecté ! </p>
      <p> Redirection vers la page d'accueil dans {{ count }} secondes </p>
    </div>
  </div>
</template>

<script>

module.exports = {
  props: {
    info: { type:Object },
    error: { type:String }
  },
  data () {
    return {
      information:{
        email:'',
        password:''
      },
      success: 2,
      count:3
    }
  },
  computed: {
  	errorMessage: function() {
  	  if(this.error == 1) {
  	  	return "Email invalide"
  	  }
  	},
    isLoggedIn: function() {
      if(typeof(this.info.id) !== "number"){
        return 0
      }
      return 1
    }
  },
  mounted() {
  	document.body.style="background-image:url('https://wallup.net/wp-content/uploads/2018/10/03/944615-dark-art-artwork-fantasy-artistic-original-psychedelic-horror-evil-creepy-scary-spooky-halloween.jpg'); background-attachment:fixed;"
  	if(this.isLoggedIn){
  		setInterval(this.reduceCount,1000)
  	}
    setTimeout(this.toMainPage, 3000)
  },
  methods: {
  	confirmRegister(){
  	  const mailRegex = /^\S+@\S+$/
  	  this.$emit('confirm-register',this.information)
  	  this.$nextTick(() => {
  	  	if(this.$route.path==='/register/0'){
  	  	  router.push({ path:'/register/1' })
  	  	}
	  })
    },
    toMainPage(){
      if(typeof(this.info.id) === "number"){
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
  .title {
  	color:yellow;
  	font-size:40px;
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

  .navButton:hover {
	color:yellow;
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
    text-decoration:none;
    text-shadow:1px 1px 2px black;
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

  #userForm input {
    background:rgba(255,0,0,0.5);
    border:rgba(0,0,0,0);
    border-radius:10px;
    box-shadow: 0 0 10px red;
    color:white;
    height:50px;
    max-width:300px;
    margin:auto;
    text-align:center;
  }

  #userForm label {
    color:white;
    margin-bottom:10px;
    margin-top:10px;
  }

  #userForm button {
    margin:auto;
    margin-top:20px;
    width:100px;
    background:rgba(255,0,0,0.7);
    border:none;
    border-radius:10px;
    box-shadow: 0 0 5px 5px rgba(255,0,0,0.6);
    color:white;
  }

  #userForm {
    display:flex;
    flex-direction:column;
    justify-content: center;
    max-width:500px;
    margin:auto;
  }
</style>
