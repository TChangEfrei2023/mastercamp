<template>
	<div id="acc" v-if="isLoggedIn">
    <h1> Liste ascenseurs </h1>
    <div v-if="isEmployee">
      <button class="custom-btn" @click="showForm()"> <span v-if="!visibilityForm">Nouvelle ascenseur</span><span v-else> Annuler </span> </button>
      <button class="custom-btn" @click="showCompoForm()" v-if="!visibilityForm"> <span v-if="!visibilityCompoForm">Nouveau composant</span><span v-else> Annuler </span> </button>
      <form v-if="visibilityForm">
        <h3> Formulaire nouvelle ascenseur </h3>
        <label> ID Client: </label>
        <input type="text" v-model="form.idClient" placeholder="ID Client">
        <label> Rue: </label>
        <input type="text" v-model="form.rue" placeholder="Nom rue">
        <label> Code Postal: </label>
        <input type="text" v-model="form.codePostal" placeholder="Num code postal">
        <label> Ville: </label>
        <input type="text" v-model="form.ville" placeholder="Nom ville">
        <button class="custom-btn" @click="addElevator()"> Confirmer </button>
      </form>

      <form v-if="visibilityForm || visibilityCompoForm">
        <h3> Formulaire nouveau composant </h3>
        <label v-if="!visibilityForm"> ID Ascenseur: </label>
        <input v-if="!visibilityForm" type="text" v-model="compoForm.idElevator" placeholder="ID Ascenseur">
        <label> ID Erreur: </label>
        <input type="text" v-model="compoForm.idError" placeholder="Code d'erreur">
        <label> Nom: </label>
        <input type="text" v-model="compoForm.nom" placeholder="Nom du composant">
        <button class="custom-btn" @click="insertComponent()" v-if="visibilityForm"> + </button>
        <button class="custom-btn" @click="addComponent()" v-if="!visibilityForm"> Ajouter </button>
      </form>

      <h2 v-if="visibilityCompoForm && visibilityForm"> Composants: </h2>
      <div class="center">
        <table class="minimalistBlack" v-if="visibilityCompoForm && visibilityForm">
          <thead>
            <tr>
              <th scope="col" v-if="!visibilityForm"> ID Ascenseur </th>
              <th scope="col"> ID Erreur </th>
              <th scope="col"> Nom </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry) in form.components" :key="entry.idElevator">
              <td v-if="!visibilityForm">{{ entry.idElevator }}</td>
              <td>{{ entry.idError }}</td>
              <td>{{ entry.nom }}</td>
              <td class="no"><button class="custom-btn" @click="deleteComponent(entry.id)"> X </button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="center">
      <table class="minimalistBlack">
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
          id:0,
          idElevator:'',
          idError:'',
          nom:''
        },
        visibilityForm:false,
        visibilityCompoForm:false,
        idCpt:0
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
              this.visibilityCompoForm = false
              this.resetFields()
        } else {
          this.visibilityForm = true
          this.visibilityCompoForm = true
        }
      },
      showCompoForm(){
        if(this.visibilityCompoForm){
          this.visibilityCompoForm = false
          this.resetFields()
        } else {
          this.visibilityCompoForm = true
        }
      },
      addElevator(){
        this.$emit('add-elevator',this.form)
        this.resetFields()
      },
      insertComponent(){
        var formCopy = {
          id:this.compoForm.id,
          idElevator:this.compoForm.idElevator,
          idError:this.compoForm.idError,
          nom:this.compoForm.nom
        }

        this.form.components.push(formCopy)
        this.idCpt++
        this.compoForm = {
          id:this.idCpt,
          idElevator:'',
          idError:'',
          nom:''
        }
      },
      deleteComponent(id){
        this.form.components.splice(this.form.components.findIndex(x=>x.id == id),1)
      },
      resetFields(){
        this.form = {
          idClient:'',
          rue:'',
          codePostal:'',
          ville:'',
          components:[]
        }
        this.compoForm = {
          idElevator:'',
          idError:'',
          nom:''
        }
      },
      addComponent(){
        this.$emit('add-component',this.compoForm)
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
.no {
  border:none;
}

</style>