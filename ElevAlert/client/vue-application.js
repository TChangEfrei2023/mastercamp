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
      items:[], //Inventaire
      equipped:[], //Equipements portés
      money:0,  //Money
      hp:0, //Vie
      stats:[null,0,0,0] //Statistiques de l'utilisateur : Register date, Total de dégâts (0), de zombies tués(1), de morts(2)
    },
    items: [],
    zombies: null
  },
  components: {
    Navigation
  },
  async mounted() {
    const res = await axios.get('/api/me') //L'id de l'utilisateur
    this.info.id = res.data

    const res2 = await axios.get('/api/profile') //Ses infos
    this.info.items = res2.data.items
    this.info.equipped = res2.data.equipped
    this.info.money = res2.data.money
    this.info.hp = res2.data.hp

    const res3 = await axios.get('/api/items') //La liste des objets
    this.items = res3.data

    if(typeof(this.info.id) === 'number'){
      this.info.stats[0] = res2.data.date     //Register date
      this.info.stats[1] = res2.data.stats[0] //Total de dégâts
      this.info.stats[2] = res2.data.stats[1] //Total de zombies tués
      this.info.stats[3] = res2.data.stats[2] //Total de morts
      const res4 = await axios.get('/api/zombies') //Zombie
      this.zombies = res4.data
    }
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