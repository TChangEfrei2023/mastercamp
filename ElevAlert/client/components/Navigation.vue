<template>
	<div>
      	<header>
			<div class=notifBox v-if="hidden && isLoggedIn">
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
				<router-link to='/login' class="navButton" v-if="!isLoggedIn"> Se connecter </router-link>
				<router-link to='/clients' class="navButton" v-if="isLoggedIn && isEmployee"> Mes clients </router-link>
				<router-link to='/elevators' class="navButton" v-if="isLoggedIn"> Ascenseurs </router-link>
				<router-link to='/log' class="navButton" v-if="isLoggedIn"> Log </router-link>
				<button @click="disconnect()" class="navButton" v-if="isLoggedIn">  Se déconnecter </button>
				<span id="user"> {{ getPrivilege() }} {{ info.nom }}</span>
				<button id="notifBtn" @click="showHide()" v-if="isLoggedIn"> Notif </button>
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
			return newDate.getUTCDay()+"/"+newDate.getUTCMonth()+"/"+newDate.getUTCFullYear()+" à "+newDate.getUTCHours()+"h"+newDate.getUTCMinutes()
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
	},
	mounted() {
		setInterval(this.checkNewBreakdown,60000)
	}
  }
</script>

<style scoped>
	.details {
		 margin: 0;
	}
	#notifBtn {
		position:relative;
		right:0;
		top:0;
	}

	.navBar {
		background-color: skyblue;
	}

	.notifBox {
		border: 2px solid;
		background-color:lightgray;
		position:absolute;
		z-index: 0;
		left:68%;
	}

	.breakdownBox {
		padding: 5px;
		border: 2px solid;
		margin:5px;
		background-color:cadetblue ;
	}

	.announcement {
		text-align: center;
	}
</style>

