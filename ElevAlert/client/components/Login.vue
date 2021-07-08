<template>
  <div>
    <div v-if="!isLoggedIn">
      <div class = "parentBlock">
        <div class = "formLogin">
          <div class="identification">
            <h2> S'identifier </h2>
          </div>
          <div class ="form-box">
            <form class = "login-text">
              <div class = "text-field">
              <input type="text" v-model="credentials.idClient" required>
              <span></span>
              <label>Identifiant</label>
              </div>
              <div class= "text-field">
              <input type="password" id="password-input" v-model="credentials.password" required>
              <span></span>
              <label>Mot de passe</label>
              </div>
              <span @click="showPassword()" class="icon-field"><img id="eye" class ="eye-icone" src="./img/eye-closed.png"></span>
              <button class = "connectButton" @click="connect()">Connexion</button>
            </form>
          </div>
        </div>
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
        idClient:'',
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
    },

    showPassword(){
      var x = document.getElementById("password-input");
      var eye = document.getElementById("eye");
      if (x.type === "password") {
        x.type = "text";
        eye.setAttribute("src", "../img/eye-opened.png");
      } 
      else {
        x.type = "password";
        eye.setAttribute("src", "../img/eye-closed.png");
      }
    }
  }
}

</script>

<style scoped>

@media (max-width: 600px) {
  .formLogin{
    width: 400px;
    height: 300px;
  }
}

.icon-field{
  position: relative;
  float: right;
  margin-left: 250;
  margin-top: -40;
  cursor: pointer;
}

.eye-icone{
  width: 20px;
  height: 20px;
}

.parentBlock{
  display: flex;
  justify-content: center;
  align-items: center;
  background: #AAAAAA;
  width: 100%;
  height: 100%;
}

.formLogin{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 300px;
  height: 300px;
  padding: 30px;
  background: #E8F0F2;
  border-radius: 12px;
}

.formLogin h2{
  text-align:left; 
  font-size: 36px;
  color: #053742;
}

.formLogin form{
  box-sizing: border-box;
}

form .text-field{
  position: relative;
  border-bottom: 2px solid #adadad;
  margin: 15px 0;
}

.login-text{
  display: flex;
  flex-direction: column;
 
}
.text-field input{
  width: 100%;
  padding: 0 5px;
  height: 40px;
  font-size: 16px;
  border: none;
  background: none;
  outline: none;
}

.text-field label{
  position: absolute;
  top: 25px;
  left: 5px;
  color: #053742;
  transform: translateY(-60%);
  transition: .5s;
  pointer-events: none;

}

.text-field span::before{
  content: '';
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #A2DBFA; 
}

.text-field input:focus ~ label,
.text-field input:valid ~ label{
  top: -5px;
  color:  #C8C2BC;
}

.connectButton{
  margin: 30px 0 0;
  width: 100%;
  height: 50px;
  border: 1px solid;
  background: #39A2DB;
  border-radius: 25px;
  font-size: 18px;
  color: #e9f4fb;
  font-weight: 700;
  cursor: pointer;
  outline: none;
}

.connectButton:hover{
  border-color: #A2DBFA;
  background: #053742;
  transition: .3s;
}

</style>
