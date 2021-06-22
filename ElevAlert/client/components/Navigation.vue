<template>
	<div>
      	<header>
	      <nav class="navBar">
		    <router-link to='/login' class="navButton"> Se connecter </router-link>
		    <router-link to='/clients' class="navButton"> Mes clients </router-link>
		    <router-link to='/lifts' class="navButton"> Ascenseurs </router-link>
		    <router-link to='/log' class="navButton"> Log </router-link>
		    <router-link to='/disconnect' class="navButton"> Se déconnecter </router-link>
		  </nav>
	    </header>
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type:Object }
	},
	data () {
	  return {
	      
	  }
	},
	mounted() {
	  //document.body.style="background-image:url('https://wallup.net/wp-content/uploads/2018/10/03/944615-dark-art-artwork-fantasy-artistic-original-psychedelic-horror-evil-creepy-scary-spooky-halloween.jpg'); background-attachment:fixed;"
	},

  }
</script>

<style scoped>

</style>

