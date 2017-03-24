// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import App from './App'
import MoodList from './components/MoodList'
import PlayerHtml5 from './components/PlayerHtml5'
import router from './router'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueResource)

Vue.component('mood-list', MoodList)
Vue.component('player-html5', PlayerHtml5)

const store = new Vuex.Store({
  state: {
    count: 0,
    message: 'Yop',
    link: 'http://jaimeleschips.fr',
    success: true,
    moods: [],
    current: {},
    infos: {}
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App },
  methods: {
    playGenre: function (genreId) {
      console.log('Coucou')
      this.$http.get('/mood/' + genreId).then(response => {
        console.log(response.body.songs)
        // get body data
        if (response.body.songs) {
          // this.current = response.body.songs[0]
        }
        // this.infos = response.body.infos
      }, response => {
        console.log('Shit it the fan !')
      })
    }
  }
})

window.vm.$on('mood-selected', id => {
  console.log(`Oh, that's nice. It's gotten ${id} clicks! :)`)
  window.vm.playGenre(id)
})
