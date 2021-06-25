<template>
	<div id="acc">
		
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type:Object }
	},
	data () {
	  return {
	    message: "Hello"
	  }
	},
	mounted() {
	  //document.body.style="background-image:url('https://wallup.net/wp-content/uploads/2018/10/03/944615-dark-art-artwork-fantasy-artistic-original-psychedelic-horror-evil-creepy-scary-spooky-halloween.jpg'); background-attachment:fixed;"
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
	  }
	}
  }
</script>

<style scoped>

</style>