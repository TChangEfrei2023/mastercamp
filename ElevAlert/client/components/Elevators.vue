<template>
	<div id="acc" v-if="isLoggedIn">
		<h1> Elevator list </h1>
    <button @click="showForm()"> <span v-if="!visibilityForm">Nouvelle ascenseur</span><span v-else> Annuler </span> </button>
		<form v-if="visibilityForm">
			<p> Formulaire nouvelle ascenseur </p>
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
			<button @click="addClient()"> Confirmer </button>
		</form>
    <table class="table mt-5">
      <thead>
        <tr>
          <th scope="col"> ID Ascenseur </th>
          <th scope="col"> Nom </th>
          <th scope="col" colspan="3"> Adresse </th>
          <th scope="col"> Panne </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry) in elevators" :key="entry.idElevator">
          <th scope="row">{{ entry.idElevator }}</th>
          <td>{{ entry.nom }}</td>
          <td>{{ entry.rue }}</td>
          <td>{{ entry.codePostal }}</td>
          <td>{{ entry.ville }}</td>
          <td>{{ panneTranslation(entry.exists) }}</td>
        </tr>
      </tbody>
    </table>
	</div>
</template>

<script>
  module.exports = {
    props: {
      info: { type: Object },
      elevators: { type: Array, default:[]}
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
      }
    },
    methods: {
      panneTranslation(panne){
        if(panne == true){
          return "Oui"
        } else {
          return "Non"
        }
      },
    },
    mounted() {
      if(typeof(this.info.id) !== "number"){
        router.push({ path:'/' })
      }
    }
  }
</script>

<style scoped>
table,
td {
    font-size: 150%;
    border: 1px solid #333;
}

thead,
tfoot {
    background-color: #333;
    color: #fff;
}
</style>