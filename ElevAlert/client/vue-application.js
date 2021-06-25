const Accueil = window.httpVueLoader('./components/Accueil.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Clients = window.httpVueLoader('./components/Clients.vue')
const Lifts = window.httpVueLoader('./components/Lifts.vue')
const Log = window.httpVueLoader('./components/Log.vue')
const Disconnect = window.httpVueLoader('./components/Disconnect.vue')

const Navigation = window.httpVueLoader('./components/Navigation.vue')

const routes = [
  { path: '/', component: Accueil },
  { path: '/login', component: Login },
  { path: '/clients', component: Clients, props:true },
  { path: '/lifts', component: Lifts },
  { path: '/log', component: Log },
  { path: '/disconnect', component: Disconnect }
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    info:{
      id:0,
      employe:false,
      nom:'',
    },
  },
  components: {
    Navigation
  },
  async mounted() {
    const res = await axios.get('/api/me') //L'id de l'utilisateur
    this.info.id = res.data.id
    this.info.employe = res.data.employe
    this.info.nom = res.data.nom
  },
  methods:{
    async confirmRegister(profile) {
      if(await axios.post('/api/register',profile)){
        router.push({ path:'/login' })
      }
    },
    async confirmLogin(profile) {
      if(await axios.post('/api/login',profile)) {
        router.push({ path:'/' })
        location.reload()
      }
    },
    async changeGear(itemId) {
      await axios.put('/api/shop/'+itemId)
    },
    async buyGear(itemId) {
      await axios.post('/api/shop',{itemId:itemId})
    },
    async combat(hp) {
      await axios.post('/api/combat')
      if(hp<=0){
        await axios.delete('/api/zdeath')
      }
    },
    async findZombie(zombie) {
      await axios.put('/api/zfind',{zombie:zombie})
    },
    async revive(hp) {
      await axios.put('/api/death',{hp:hp})
    },
    async heal() {
      await axios.put('/api/heal')
    },
    async disconnect() {
      if(await axios.post('/api/disconnect')){
        router.push({ path:'/' })
        location.reload()
      }

    }
  }
})
