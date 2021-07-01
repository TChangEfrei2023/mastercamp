<template>
	<div id="acc" v-if="isLoggedIn">
		<h1> Elevator list </h1>
    <button @click="showForm()"> <span v-if="!visibilityForm">Nouvelle ascenseur</span><span v-else> Annuler </span> </button>
		<form v-if="visibilityForm">
			<p> Formulaire nouvelle ascenseur </p>
			<label> ID Client: </label>
			<input type="text" v-model="form.idClient" placeholder="ID Client">
			<label> Rue: </label>
			<input type="text" v-model="form.rue" placeholder="Nom rue">
			<label> Code Postal: </label>
			<input type="text" v-model="form.codePostal" placeholder="Num code postal">
			<label> Ville: </label>
			<input type="text" v-model="form.ville" placeholder="Nom ville">
			<button @click="addElevator()"> Confirmer </button>
		</form>

    <table v-if="visibilityForm">
      <label> Composants: </label>
      <thead>
        <tr>
          <th scope="col"> ID Ascenseur </th>
          <th scope="col"> ID Erreur </th>
          <th scope="col"> Nom </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry) in elevators" :key="entry.idElevator">
          <th scope="row">{{ entry.idElevator }}</th>
          <td v-if="info.employe">{{ entry.nom }}</td>
          <td>{{ entry.rue }}</td>
          <td>{{ entry.codePostal }}</td>
          <td>{{ entry.ville }}</td>
          <td>{{ panneTranslation(entry.exists) }} </td>
        </tr>
      </tbody>
    </table>

    <table class="table">
      <thead>
        <tr>
          <th scope="col"> ID Ascenseur </th>
          <th scope="col" v-if="info.employe"> Entreprise </th>
          <th scope="col" colspan="3"> Adresse </th>
          <th scope="col"> Status </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry) in elevators" :key="entry.idElevator">
          <th scope="row">{{ entry.idElevator }}</th>
          <td v-if="info.employe">{{ entry.nom }}</td>
          <td>{{ entry.rue }}</td>
          <td>{{ entry.codePostal }}</td>
          <td>{{ entry.ville }}</td>
          <td>{{ panneTranslation(entry.exists) }} </td>
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
        form:{
          idClient:'',
          rue:'',
          codePostal:'',
          ville:'',
          components:[]
        },
        compoForm:{
          idElevator:'',
          idError:'',
          nom:'',
          dureeVie:'',
          status:false
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
      }
    },
    methods: {
      panneTranslation(panne){
        if(panne == true){
          return "En panne"
        } else {
          return "Fonctionnel"
        }
      },
      showForm(){
        if(this.visibilityForm){
              this.visibilityForm = false
        } else {
          this.visibilityForm = true
        }
      },
      addElevator(){
        this.$emit('add-elevator',this.form)
        this.form = {
          idClient:'',
          rue:'',
          codePostal:'',
          ville:'',
          components:[]
        }
      }
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