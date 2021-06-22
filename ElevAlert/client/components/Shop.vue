<template>
	<div>
		<div id="acc" v-if="isLoggedIn">
		  <!-- Wait for async props -->
		  <div v-if="typeof(items[0]) !== 'undefined' && info.equipped !== null">
	      	<header>
		      <nav class="navBar">
			    <router-link to='/' class="navButton"> Accueil </router-link>
			    <router-link to='/profile' class="navButton"> Profile </router-link>
			    <router-link to='/shop' class="navButton"> Boutique </router-link>
			    <router-link to='/combat' class="navButton"> Combat </router-link>
			  </nav>
			  <div class="fade-in1">
			  	<h1 id="title">Les derniers magasins</h1>
		      	<h2 class="title"> Bienvenue dans l'armurerie ! </h2>
			  </div>
		    </header>
	        <div v-for="type in [1,2,3,4,5]" class="shop">
        	  <h2 :class="getFade(type)"> {{ section(type) }}  </h2>
        	  <div class="list">
			    <div v-for="item in getItemsType(type)" :key="item.id" :class="getFade(type)" class="size" >
			  	  <div class="desc">
			  	      <div class="pic" :style="{ backgroundImage: 'url('+ item.image +')', backgroundColor:getRarity(item.id-1)[1] }"> {{ getRarity(item.id-1)[0] }} </div>
			          <h3 :style="{color:getRarity(item.id-1)[1]}"> {{ item.name }} </h3>
			          <p> Level : <span class="color"> {{ item.level }} </span> </p>
			          <p v-if="item.type < 3"> Effet : <span class="color"> Défense +{{ item.properties }} </span> </p>
			          <p v-if="item.type < 5 && item.type > 2"> Effet : <span class="color"> Dégâts +{{ item.properties }} </span> </p>
			          <p v-if="item.type==5"> Effet : <span class="color"> Vie +{{ item.properties }} </span> </p>
			          <p> Prix : <span class="color"> {{ item.price }} $</span> </p>
			          <p v-if="item.id == 17"> Quantité : <span class="color"> {{ getMedipack }} </span> </p>
			          <p> Description :
				        <br> 
				        <span class="color"> {{ item.description }} </span> 
			          </p>
			          <div v-if="!possessed(item.id)">
			      	    <button @click="buyGear(item.id)" v-if="affordable(item.id)"> Payer {{ item.price }}$</button>
			      	    <button disabled v-else> Pas assez d'argent ! </button>
			          </div>
				      <div v-else>
				  	    <button disabled> Acheté </button>
				  	    <button v-if="inInventory(item.id) && !equipped(item.id)" @click="changeGear(item.id)"> Équiper </button>
				  	    <button v-else disabled> Équipé </button>
				      </div>
			      </div>
			    </div>
			  </div>
			</div>
		  </div>
		</div>
		<div v-else id="redirect">
		  <div class="redBar">
		    403
		  </div>
		  <p> Halte-là ! Vous n'êtes pas connecté ! </p>
		  <p> Redirection vers la page d'accueil dans {{ count }} secondes </p>
		</div>
	</div>
</template>

<script>
  module.exports = {
	props: {
	  info: { type: Object },
	  items : { type: Array, default: [] }
	},
	data () {
	  return {
	  	equippedGear:{
	  		helmet:0,
	  		armor:0,
	  		knife:0,
	  		gun:0,
	  		medipack:0
	  	},
	  	count:3, //redirect counter
	  	counter:2 //fade
	  }
	},
	mounted() {
	  document.body.style="background-image:url('https://www.hoffyspawnandgun.com/wp-content/uploads/2016/12/Slide-06.jpg'); background-attachment:fixed;"
	  if(!this.isLoggedIn){
  		setInterval(this.reduceCount,1000)
	  }
	  setTimeout(this.toMainPage, 3000)
	},
	computed: {
	  isLoggedIn: function() {
	  	if(typeof(this.info.id) !== "number"){
	  		return 0
	  	}
	  	return 1
	  },
	  getMedipack: function() {
	  	return this.equippedGear.medipack
	  }
	},
	methods: {
	  getRarity(itemId) {
	  	const itemLevel = this.items[itemId].level
	  	if(itemLevel === 1) {
	  		return ["Normal","grey"]
	  	} else if(itemLevel === 2) {
	  		return ["Rare","blue"]
	  	} else if(itemLevel === 3) {
	  		return ["Elite","purple"]
	  	} else {
	  		return ["Legendaire","orange"]
	  	}
	  },
	  possessed(itemId) {
	  	//Data initiation
	  	const withoutMedipack = this.info.equipped.slice(0,-1)
	  	const equipment = withoutMedipack.find(a => a === itemId)
	  	if(equipment){
	  		const type = this.items[equipment-1].type
	  		if(type===1){
	  			this.equippedGear.helmet = equipment
	  		} else if(type===2) {
	  			this.equippedGear.armor = equipment
	  		} else if(type===3) {
	  			this.equippedGear.knife = equipment
	  		} else if(type===4) {
	  			this.equippedGear.gun = equipment
	  		}
	  	} else if(itemId === 17) {
	  		this.equippedGear.medipack = this.info.equipped[4]
	  	}

	  	const found = this.info.items.find(a => a === itemId)
	  	if(found && itemId !== 17){
	  		return 1
	  	} else {
	  		return 0
	  	}
	  },
	  equipped(itemId) {
	  	if(itemId === this.equippedGear.helmet ||
	  		itemId === this.equippedGear.armor ||
	  		itemId === this.equippedGear.knife ||
	  		itemId === this.equippedGear.gun) {
	  		return 1
	  	} else {
	  		return 0
	  	}
	  },
	  inInventory(itemId) {
	  	const found = this.info.items.find(a => a === itemId) 
	  	if(found) {
	  		return 1
	  	} else {
	  		return 0
	  	}
	  },
	  affordable(itemId) {
	  	if(this.info.money >= this.items[itemId-1].price) {
	  		return 1
	  	} else {
	  		return 0
	  	}
	  },
	  changeGear(itemId) {
	  	this.$emit('change-gear',itemId)
	  	const type = this.items[itemId-1].type
	  	if(type === 1) {
	  		this.equippedGear.helmet = itemId
	  		this.info.equipped[0] = itemId
	  	} else if(type === 2) {
	  		this.equippedGear.armor = itemId
	  		this.info.equipped[1] = itemId
	  	} else if(type === 3) {
	  		this.equippedGear.knife = itemId
	  		this.info.equipped[2] = itemId
	  	} else {
	  		this.equippedGear.gun = itemId
	  		this.info.equipped[3] = itemId
	  	}
	  },
	  buyGear(itemId) {
	  	this.$emit('buy-gear',itemId)
	  	if(itemId<17) {
	  	  this.info.items.push(itemId)
	  	} else {
	  		this.info.equipped[4]++
	  		this.equippedGear.medipack++
	  	}
	  	this.info.money = this.info.money - this.items[itemId-1].price
	  },
      toMainPage(){
        if(typeof(this.info.id) !== "number"){
          router.push({ path:'/' })
        }
      },
      reduceCount(){
        this.count = this.count-1;
      },
      getItemsType(type){
      	var list = []
      	var numberOfItem = 4
      	if(type===5){
      	  numberOfItem = 1
      	}
      	for(var i=0 ; i < numberOfItem ; i++){
      	  var index = (type-1)*4 + i
      	  list.push(this.items[index])
      	}
      	return list
      },
      section(type){
      	if(type===1){
      		return "Section Casque"
      	} else if(type===2){
      		return "Section Armure"
      	} else if(type===3){
      		return "Section Couteau"
      	} else if(type===4){
      		return "Section Arme à feu"
      	} else if(type===5){
      		return "Section soin"
      	} else {
      		return "Section inconnue"
      	}
      },
      getFade(type){
      	return "fade-in"+type.toString()
      }
	}
  }
</script>

<style scoped>
	.title {
	  color:yellow;
	  font-size:40px;
	  text-shadow: 1px 1px 3px red;
	}

	.color {
		color:yellow;
	}

	.desc {
		margin:2px;
		background-color:rgba(0,0,25,0.5);
		font-family: 'Lucida Sans';
		border-radius: 25px;
		border: 1px rgba(255,255,255,0.2) solid;
		height:100%;
	}

	.pic {
		width:150px;
		height:150px;
		margin:auto;
		border-radius:25px;
		margin-bottom:5px;
		margin-top:5px;
	}


	.shop {
		margin:auto;
		color:white;
	}

	.shop h2 {
		font-size:50px;
	}

	#acc {
		display:flex;
		flex-direction: column;
		overflow:hidden;
	}

	button {
		width:100px;
		height:50px;
		margin:auto;
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

	.navButton:hover {
    	background: -webkit-linear-gradient(yellow, red);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow:0 0 0;
		transition:all 0s;
    }

    #acc button {
    	font-family: 'Creepster', cursive;
    	background:none;
    	color:red;
    	width:auto;
    	max-width:300px;
    	font-size:30px;
    	border:none;
    	transition:all 1s;
    }

    #acc button:disabled {
    	color:grey;
    }

    #acc button:disabled:hover {
    	color:grey;
    }

    #acc button:hover {
    	color:yellow;
    	transition:transform 0.5s;
    }

	#redirect {
  		font-size:30px
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

  	.list {
  		display:flex;
  		flex-direction:row;
  		flex-wrap:wrap;
  		justify-content:space-around;
  	}

  	.size {
  		width:25%;
  		min-width:300px;
  	}
</style>