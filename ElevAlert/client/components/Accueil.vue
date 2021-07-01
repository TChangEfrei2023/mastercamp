<template>
	<div id="acc">
		<p>ELEVALERT</p>
		<h1>kl</h1>
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
	}
  }
</script>

<style scoped>

</style>