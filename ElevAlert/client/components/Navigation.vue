<template>
	<div>
      	<header>
			<nav class="navBar">
				<router-link to='/login' class="navButton" v-if="!isLoggedIn"> Se connecter </router-link>
				<router-link to='/clients' class="navButton" v-if="isLoggedIn && isEmployee"> Mes clients </router-link>
				<router-link to='/elevators' class="navButton" v-if="isLoggedIn"> Ascenseurs </router-link>
				<router-link to='/log' class="navButton" v-if="isLoggedIn"> Log </router-link>
				<button @click="disconnect()" class="navButton" v-if="isLoggedIn">  Se déconnecter </button>
				<span id="user"> {{ getPrivilege() }} {{ info.nom }}</span>
			</nav>
	    </header>
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type:Object },
	},
	data () {
	  return {
	    
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
        if(this.info.employe == true){
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
		disconnect(){
			this.$emit('disconnect')
		}
	}
  }
</script>

<style scoped>
	.navBar {
		background-color: skyblue;
	}
</style>

