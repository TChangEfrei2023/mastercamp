<template>
	<div id="acc" v-if="isLoggedIn">
		<h1> Liste des pannes </h1>
    <div class="center">
      <table class="minimalistBlack">
        <thead>
          <tr>
          <th scope="col"> ID Panne </th>
          <th scope="col"> ID Ascenseur </th>
          <th scope="col" colspan="3"> Adresse </th>
          <th scope="col"> Date Panne </th>
          <th scope="col"> Date Résolution </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry) in breakdowns" :key="entry.idBreakdown">
          <th scope="row">{{ entry.idBreakdown }}</th>
          <td>{{ entry.idElevator }}</td>
          <td>{{ entry.rue }}</td>
          <td>{{ entry.codePostal }}</td>
          <td>{{ entry.ville }}</td>
          <td>{{ formatDate(entry.dateDebut) }}</td>
          <td>{{ isRepaired(entry.dateFin) }}  </td>
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
      breakdowns: { type: Array, default:[]}
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
      },
    },
    methods: {
      formatDate(date) {
        const newDate = new Date(date)
        return newDate.getDate()+"/"+newDate.getMonth()+"/"+newDate.getFullYear()
      },
      isRepaired(date) {
        if(typeof(date) !== "string"){
          return "En cours de réparation."
        }
          return this.formatDate(date)
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

</style>