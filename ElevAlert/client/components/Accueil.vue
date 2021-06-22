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
	.text {
		font-family: 'Lucida Sans';
		font-size:15px;
	}

	.partName {
	  	color:yellow;
	  	font-size:25px;
	  	text-shadow: 1px 1px 3px red;
	}

	.subPart {
		font-size:35px;
	}

	#acc {
		display:flex;
		flex-direction: column;
	}

	button {
		width:100px;
		height:50px;
		margin:auto;
	}

	.pictures {
		width:0;
		height:0;
		background-size:cover;
		margin:auto;
		margin-top:50px;
		border:1px solid rgba(255,255,255,0.3);
		font-size:30px;
		transition:all 0.2s;
		overflow:hidden;
	}

	.clip-path {
		width:300px;
		height:300px;
		transition:all 0.2s;
	}

	#ex2 {
		clip-path: polygon(35% 8%, 8% 16%, 22% 47%, 20% 100%, 54% 79%, 76% 93%, 93% 66%, 88% 44%, 89% 7%, 49% 15%, 28% 25%);
		background-image:url("https://u.cubeupload.com/NinjaSg/Gameplay2.png");
		background-repeat:no-repeat;
		background-position:center;
	}

	#ex1 {
		clip-path: polygon(47% 2%, 8% 16%, 18% 41%, 1% 65%, 28% 71%, 43% 94%, 81% 89%, 81% 64%, 92% 40%, 93% 13%, 75% 16%, 55% 30%);
		background-image:url("https://u.cubeupload.com/NinjaSg/Gameplay.png");
		background-repeat:no-repeat;
		background-position:center;
	}

	#ex1:hover, #ex2:hover {
		clip-path: none;
		max-width:100%;
		transform:scale(1.5);
		z-index:2;
	}

	.pictures {
		border:1px solid rgba(255,255,255,0.1);
		margin-top:50px;
		font-size:30px;
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
	    text-shadow:1px 1px 2px black;
	    text-decoration:none;
	    margin-left:20px;
	    margin-right:20px;
	    flex:3;
	    transition:all 0.3s;
    }

    #acc button {
    	font-family: 'Creepster', cursive;
    	background:none;
    	color:red;
    	width:300px;
    	font-size:30px;
    	border:none;
    	border-right:1px solid rgba(255,0,0,0.5);
    	border-left:1px solid rgba(255,0,0,0.5);
    	transition:all 1s;
    }

    #acc button:hover {
    	color:yellow;
    	text-shadow:0px 0px 10px red;
    	transition:transform 0.5s;
    }

    .navButton:hover {
    	background: -webkit-linear-gradient(yellow, red);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:0 0 0;
		transition:all 0s;
    }
</style>