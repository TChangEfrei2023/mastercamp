<template>
	<div id="acc" v-if="isLoggedIn">
		<h1> Client list </h1>
    <table class="table mt-5">
      <thead>
        <tr>
          <th scope="col"> ID Panne </th>
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
		  return newDate.getUTCDay()+"/"+newDate.getUTCMonth()+"/"+newDate.getUTCFullYear()+" à "+newDate.getUTCHours()+"h"+newDate.getUTCMinutes()
	  },
	  isRepaired(attribute) {
		if(typeof(attribute) !== "number"){
		  return "En cours de réparation."
        }
        return attribute
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