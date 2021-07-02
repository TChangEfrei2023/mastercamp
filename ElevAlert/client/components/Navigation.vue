<template>
	<div>
      	<header>
			<div class=notifBox v-if="!hidden && isLoggedIn">
				<p v-if="notifications[0] == null" class="announcement"> Aucune notification. </p>
				<div v-else>
					<p class="announcement"> Nouvelles pannes détectées ! </p> 
					<div v-for="notif in notifications" :key="notif.idBreakdown" class="breakdownBox">
						<h4 class="details"> - Détails - </h4>
						<p class="details"> Identification de la panne : {{ notif.idBreakdown }} </p>
						<p class="details"> Code d'erreur : {{ notif.idError }} </p>
						<p class="details"> Description : {{ notif.description }} </p>
						<p class="details"> Ascenseur situé à : {{ notif.rue+" "+notif.codePostal+" "+notif.ville }} (ID: {{ notif.idElevator }}) </p>
						<p class="details"> Entreprise concerné : {{ notif.nom }} (ID: {{ notif.idClient }}) </p>
						<p class="details"> Provoqué le : {{ formatDate(notif.dateDebut) }} </p>
						<h4 class="details"> - Contact - </h4>
						<p class="details"> Email : {{ notif.email }} </p>
						<p class="details"> Tel : {{ notif.tel }} </p>
						<button @click="confirmNotification(notif.idBreakdown)"> Confirmer </button>
					</div>
				</div>
			</div>
			<nav class="navBar">
				<select class="select" onchange="location = this.option[this.selectIndex].value">
                        <option value="">Accueil</option>
                        <option value="">Mes clients</option>
                        <option value="">Ascenseur</option>
                        <option value="">Log/Historique</option>
                        <option value="">Mes employés</option>
                        <option value="">Se déconnecter</option>
                </select>
				<ul>
					<li class="item"><router-link to='/' class="navButton-left"><img class="img0"
                            src="./logo.png" title="ElevAlert"></router-link></li>
					<li class="item"><router-link to='/login' class="navButton" v-if="!isLoggedIn"> Se connecter </router-link></li>
					<li class="item"><router-link to='/clients' class="navButton" v-if="isLoggedIn && isEmployee"> Mes clients </router-link></li>
					<li class="item"><router-link to='/elevators' class="navButton" v-if="isLoggedIn"> Ascenseurs </router-link></li>
					<li class="item"><router-link to='/log' class="navButton" v-if="isLoggedIn"> Log </router-link></li>
					<li class="item"><span id="user"> {{ getPrivilege() }} {{ info.nom }}</span></li>
					<li class="item1"><button @click="disconnect()" class="navButton-right" v-if="isLoggedIn">  Se déconnecter </button></li>
					<li class="item1"><button class="notif-right" id="notifBtn" @click="showHide()" v-if="isLoggedIn"> Notif </button></li>
			</nav>
	    </header>
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type:Object },
	  notifications: { type:Array, default:[] }
	},
	data () {
	  return {
	    hidden:true
	  }
	},
	computed: {
	  isLoggedIn: function() {
		if(typeof(this.info.id) !== "number"){
			return 0
		}
		return 1
	  },
      isEmployee: function() {
        if(this.info.employe == true) {
          return 1
        }
        return 0
      }
	},
	methods: {
		getPrivilege(){
			if(this.info.employe == true){
				return "Employé: "
			} else if(this.info.employe == false){
				return "Entreprise: "
			} else {
				return "Non connecté"
			}
		},
		showHide(){
			if(this.hidden == true){
				this.hidden = false
			} else {
				this.hidden = true
			}
		},
		formatDate(date) {
			const newDate = new Date(date)
			return newDate.getDate()+"/"+newDate.getMonth()+"/"+newDate.getFullYear()
	  	},
		disconnect(){
			this.$emit('disconnect')
		},
		confirmNotification(idBreakdown){
			this.$emit('confirm-notification',idBreakdown)
		},
		checkNewBreakdown(){
			console.log("Checking...")
			this.$emit('check-new-breakdown')
		}
	}
  }
</script>

<style scoped>
	body {
        background-color: lightgray;
    }
    nav {
        background-color: #F4F4F4;
        padding: 10px;
        padding-bottom: 0.1px;
        margin-left: -8px;
        margin-right: -8px;
        margin-top: -16px;
        box-shadow: 0px 1px 2px rgba(0, 0, 0,.2);
    }
    .navButton {
        text-decoration: none;
        padding-top: 600px;
        padding-bottom: 17.5px;
        padding-left: 18px;
        padding-right: 18px;
        text-align: center;
    }
    .navButton:hover {
        background-color: lightgray;
    }
    .navButton-left {
        padding-top: 600px;
        padding-bottom: 17.5px;
        padding-left: 18px;
        padding-right: 18px;
        text-decoration: none;
    }
    .navButton-right {
        float: right;
        margin-right: 32px;
        margin-top: 16px;
        text-decoration: none;
		font-size: 20px;
    }
	.notif-right {
		float: right;
        margin-right: 32px;
        margin-top: 16px;
        text-decoration: none;
		font-size: 20px;
	}
    .navButton-right:hover {
        background-color: red;
    }
    li {
        display: inline;
    }
    .item {
        font-size: 25px;
        padding-bottom: 300px;
    }
    .item1 {
        font-size: 25px;
    }
    ul {
        display: block;
    }
    img {
        width: 181px;
        height: 50px;
        margin-right: 100px;
    }
    .active {
        background-color: #E6E6E6;
        padding-bottom: 20px;
    }
    .select {
        display: none;
    }
    @media screen and (max-width: 775px) {
        li {
            display: none;
        }
        ul {
            display : none;
        }
        nav {
            padding : 8px;
        }
        .select {
            display: block;
            height: 35px;
            text-align: center;
            width: 100%;
            color: gray;
            background-color: #FAFAFA;
            font-size: 25px;
            text-decoration: none;
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 2px solid gray;
        }
    }
</style>

