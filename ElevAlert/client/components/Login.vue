<template>
  <div>
    <div v-if="!isLoggedIn">
      <div>
        <h2> Identification </h2>
        <form>
          <label> Identifiant : </label>
          <input type="text" v-model="credentials.id" placeholder="Identifiant" required>
          <label> Mot de passe : </label>
          <input type="text" v-model="credentials.password" placeholder="Mot de passe" required>
          <button @click="connect()">Connexion</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

module.exports = {
  props: {
    info: { type:Object }
  },
  data () {
    return {
      credentials:{
        id:'',
        password:''
      }
    }
  },
  mounted() {
    if(typeof(this.info.id) === "number"){
      router.push({ path:'/' })
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
  	connect(){
      this.$emit('connect',this.credentials)
    }
  }
}

</script>

<style scoped>

</style>
