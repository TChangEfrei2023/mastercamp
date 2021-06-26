<template>
	<div id="acc" v-if="isLoggedIn">
		<h1> Elevator list </h1>
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