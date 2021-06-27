<template>
	<div id="acc" v-if="isLoggedIn">
		<h1> Breakdown list </h1>
		<table class="table mt-5">
			<thead>
				<tr>
				<th scope="col"> ID Client </th>
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
				<td>{{ isRepaired(entry.dateFin) }}</td>
				</tr>
			</tbody>
		</table>
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
      panneTranslation(panne){
        if(panne == true){
          return "Oui"
        } else {
          return "Non"
        }
      },
	  formatDate(date) {
		  const newDate = new Date(date)
		  return newDate.getDate()+"/"+newDate.getMonth()+"/"+newDate.getFullYear()
	  },
	  isRepaired(date) {
		if(typeof(date) !== "number"){
		  return "En cours de réparation."
        }
        return this.formatDate(date)
	  }
    },
    mounted() {
      if(typeof(this.info.id) !== "number"){
        router.push({ path:'/' })
      }
    },
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