<template>
	<header>
		<nav class="navBar">
			<div class="containerLogo">
				<router-link to='/' class="left"><img class="logo" src="./logo.png" title="ElevAlert"></router-link>
			</div>
			<div class="containerNavBtn">
				<router-link to='/clients' class="navButton" v-if="isLoggedIn && isEmployee"> Mes clients </router-link>
				<router-link to='/elevators' class="navButton" v-if="isLoggedIn"> Mes ascenseurs </router-link>
				<router-link to='/log' class="navButton" v-if="isLoggedIn"> Log </router-link>
			</div>
			<div class="containerOtherBtn">
				<span id="user" class="navText" v-if="isLoggedIn"> 
					{{ getPrivilege() }} 
					<b> {{ info.nom }}</b> 
				</span>
				<button class="navButton" @click="disconnect()"  v-if="isLoggedIn">  Se déconnecter </button>
				<router-link to='/login' class="navButton" v-else> Se connecter </router-link>
				<button class="discButton" @click="showHide()" v-if="isLoggedIn && getNotifLength == 0"> <img class="notifZero" src="./notif.png" title="Voir les notifications"> {{ getNotifLength }} </button>
				<button class="discButton" @click="showHide()" v-if="isLoggedIn && getNotifLength > 0"> <img class="notifMore" src="./notif.png" title="Voir les notifications"> {{ getNotifLength }} </button>
			</div>
		</nav>
		<div class="notifBox" v-if="!hidden && isLoggedIn">
			<p class="announcement"> Notifications </p>
			<div class="line"></div>
			<div v-if="getNotifLength>0">
				<div v-for="notif in notifications" :key="notif.idBreakdown" class="breakdownBox">
					<h4> - Détails - </h4>
					<p class="details"> <b> ID Panne : </b>{{ notif.idBreakdown }} </p>
					<p class="details"> <b> Description : </b>{{ notif.description }} (Code d'erreur : {{ notif.idError }}) </p>
					<p class="details"> <b> Ascenseur situé à : </b>{{ notif.rue+" "+notif.codePostal+" "+notif.ville }} (ID: {{ notif.idElevator }}) </p>
					<p class="details"> <b> Entreprise concerné : </b>{{ notif.nom }} (ID: {{ notif.idClient }}) </p>
					<p class="details"> <b> Provoqué le : </b>{{ formatDate(notif.dateDebut) }} </p>
					<h4> - Contact - </h4>
					<p class="details"> <b> Email : </b> {{ notif.email }}  </p>
					<p class="details"> <b> Tel : </b> {{ notif.tel }} </p>
					<button class="confirmButton"> Confirmer </button>
				</div>
			</div>
			<div v-else>
				<p class="emptyText"> Aucune notification </p> 
			</div>
		</div>
	</header>
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
      },
	  getNotifLength: function(){
		  return this.notifications.length
	  }
	},
	methods: {
		getPrivilege(){
			if(this.info.employe == true){
				return "Employé : "
			} else if(this.info.employe == false){
				return "Entreprise : "
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
	.notifBox {
		overflow-x: hidden;
		position:absolute;
		right:5px;
		top:auto;
		background-color:white;
		border:1px rgba(0, 0, 0,.2) solid;
		box-shadow:0px 2px 4px rgba(0, 0, 0,.2);
		border-radius:8px;
		padding:5px;
		min-width:300px;
		min-height:100px;
		max-height:calc(75vh - 62px - 75px);
		z-index: 1000;
	}

	.announcement {
		font-size:20px;
	}

	.breakdownBox {
		border:solid rgba(0, 0, 0,.2) 1px;
		box-shadow:0px 2px 4px black;
		border-radius:8px;
		margin:5px;
		max-width:300px;
		background-color:white;
	}

	.details {
		padding-left:5px;
		padding-right:5px;
		text-align: left;
	}

	.emptyText {
		margin:50px;
	}

	.line {
		width:250px;
		height:1px;
		margin:auto;
		background-color:black;
	}

	.navBar {
		display:flex;
		flex-wrap:wrap;
		justify-content:space-around;
	}

	header {
		position:sticky;
		top:0;
		width:100%;
	}

	.containerOtherBtn {
		display:flex;
		margin-left:auto;
	}

	.containerLogo {
		margin-top:auto;
		margin-bottom:auto;
		overflow: hidden;
	}

	.discButton:hover, .navButton:hover {
		background-color: lightgray;
	}

	.discButton:active, .navButton:active {
		background-color:grey;
		transition:none;
	}

	body {
        background-color: lightgray;
    }

    nav {
        background-color: #F4F4F4;
        box-shadow: 0px 1px 2px rgba(0, 0, 0,.2);
    }

    .navButton {
		display:table-cell;
		border:none;
		margin:auto;
		padding:20px;
		padding-left:8px;
		padding-right:8px;
		font-size: 16px;
        text-decoration: none;
		color:#00414f;
		background-color: #F4F4F4;
		transition:0.3s;
    }
	
	.navText {
		display:table-cell;
		margin:auto;
		margin-right:50px;
		font-size: auto;
	}

    .logo {
        width: 181px;
        height: 50px;
    }

	.notifZero {
		height:40px;
		width:40px;
		vertical-align:top;
		filter:brightness(0);
	}

	.notifMore {
		height:40px;
		width:40px;
		vertical-align:top;
	}

	.discButton {
		border:none;
		padding-left:10px;
		padding-right:5px;
		background-color: #F4F4F4;
	}

	.confirmButton {
		border:1px rgba(0, 0, 0,.2) solid;
		background-color: whitesmoke;
		padding:3px;
		border-radius:8px;
		margin-top:5px;
		margin-bottom:5px;
		box-shadow: 0px 2px 2px black;
	}

	.confirmButton:hover {
		background-color: lightgray;
		transition:0.5s;
	}

	.confirmButton:active {
		background-color: gray;
		transition:0.1s;
		box-shadow:none;
		transform:translateY(4px);
	}
</style>

