const Accueil = window.httpVueLoader('./components/Accueil.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Clients = window.httpVueLoader('./components/Clients.vue')
const Elevators = window.httpVueLoader('./components/Elevators.vue')
const Log = window.httpVueLoader('./components/Log.vue')
const Disconnect = window.httpVueLoader('./components/Disconnect.vue')

const Navigation = window.httpVueLoader('./components/Navigation.vue')

const routes = [
  { path: '/', components: {main: Accueil, nav: Navigation}},
  { path: '/login', components: {main: Login, nav: Navigation} },
  { path: '/clients', components: {main: Clients, nav: Navigation} },
  { path: '/elevators', components: {main: Elevators, nav: Navigation} },
  { path: '/log', components: {main: Log, nav: Navigation} },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    info: {
      id:null,
      employe:false,
      nom:'',
    },
    elevators: [],
    breakdowns: [],
    clients: [],
    notifications: []
  },
  async mounted() {
    const sessionInfo = await axios.get('/api/me')
    this.info.id = sessionInfo.data.id
    this.info.employe = sessionInfo.data.employe
    this.info.nom = sessionInfo.data.nom

    if(typeof(this.info.id) === "number") {

      const elevatorList = await axios.get('/api/elevators')
      this.elevators = elevatorList.data.content

      const breakdownList = await axios.get('/api/breakdowns')
      this.breakdowns = breakdownList.data.content
      
      const notifList = await axios.get('/api/notification')
      this.notifications = notifList.data.result

      if(this.info.employe == true){
        const clientList = await axios.get('/api/clients')
        this.clients = clientList.data.content
      }

      setInterval(this.checkNewBreakdown,30000)
    }
  },
  methods: {
    async connect(credientials) {
      if(await axios.post('/api/login',credientials)) {
        router.push({ path:'/' })
        location.reload()
      }
    },
    async disconnect() {
      if(await axios.post('/api/logout')){
        location.reload()
      }
    },
    async confirmNotification(idBreakdown) {
      if(await axios.post('/api/reception/'+idBreakdown)){
        this.notifications.splice(this.notifications.findIndex(a=>a.idBreakdown == idBreakdown),1)
      }
    },
    async checkNewBreakdown(){
      const notifList = await axios.get('/api/notification')
      if(notifList){
        this.notifications = notifList.data.result
        const breakdownList = await axios.get('/api/breakdowns')
        this.breakdowns = breakdownList.data.content
      }
    },
    async addClient(form){
      if(await axios.post('/api/register',form)){
        if(this.info.employe == true){
          const clientList = await axios.get('/api/clients')
          this.clients = clientList.data.content
        }
      }
    },
    async addElevator(form){
      if(await axios.post('/api/installation',form)){
        if(this.info.employe == true){
          const elevatorList = await axios.get('/api/elevators')
          this.elevators = elevatorList.data.content
        }
      }
    }
  }
})
