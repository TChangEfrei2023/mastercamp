<template>
	<div id="acc" v-if="isLoggedIn && info.employe">
		<h1> Client list </h1>
		<button class="custom-btn" @click="showForm()"> <span v-if="!visibilityForm">Nouveau client</span><span v-else> Annuler </span> </button>
		<form v-if="visibilityForm">
			<p> Formulaire nouveau client </p>
			<label> Nom: </label>
			<input type="text" v-model="form.nom" placeholder="Nom">
			<label> Email: </label>
			<input type="text" v-model="form.email" placeholder="Email">
			<label> Tel: </label>
			<input type="text" v-model="form.tel" placeholder="Téléphone">
			<label> Rue: </label>
			<input type="text" v-model="form.rue" placeholder="Nom rue">
			<label> Code Postal: </label>
			<input type="text" v-model="form.codePostal" placeholder="Num code postal">
			<label> Ville: </label>
			<input type="text" v-model="form.ville" placeholder="Nom ville">
			<button class="custom-btn" @click="addClient()"> Confirmer </button>
		</form>
		<table class="minimalistBlack">
			<thead>
				<tr>
				<th scope="col"> ID Client </th>
				<th scope="col"> Nom </th>
				<th scope="col"> Email </th>
				<th scope="col"> Tel </th>
				<th scope="col" colspan="3"> Adresse </th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(entry) in clients" :key="entry.idClient">
				<th scope="row">{{ entry.idClient }}</th>
				<td>{{ entry.nom }}</td>
				<td>{{ entry.email }}</td>
				<td>{{ entry.tel }}</td>
				<td>{{ entry.rue }}</td>
				<td>{{ entry.codePostal }}</td>
				<td>{{ entry.ville }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
  module.exports = {
    props: {
      info: { type: Object },
      clients: { type: Array, default:[]}
    },
    data () {
      return {
		form:{
		  nom:'',
		  email:'',
		  tel:'',
		  rue:'',
		  codePostal:'',
		  ville:''
		},
        visibilityForm:false
      }
    },
    computed: {
      isLoggedIn: function() {
        if(typeof(this.info.id) !== "number"){
          return 0
        }
        return 1
      },
    },
    methods: {
	  showForm(){
		if(this.visibilityForm){
	  	  this.visibilityForm = false
		} else {
		  this.visibilityForm = true
		}
	  },
	  addClient(){
		this.$emit('add-client',this.form)
	  }
    },
    mounted() {
      if(typeof(this.info.id) !== "number" && this.info.employe != true){
        router.push({ path:'/' })
      }
    },
  }
</script>

<style scoped>

</style>