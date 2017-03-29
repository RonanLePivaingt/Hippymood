// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import router from '@/router'
import App from '@/App'
import PlayerHtml5 from '@/components/PlayerHtml5'
import MoodList from '@/components/MoodList'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueResource)

Vue.component('mood-list', MoodList)
Vue.component('player-html5', PlayerHtml5)

const store = new Vuex.Store({
  state: {
    moods: [],
    current: {},
    currentMood: 0
  },
  mutations: {
    setMoods (state, moods) {
      state.moods = moods
    },
    setCurrent (state, current) {
      state.current = current
      if (current.moodId !== state.currentMood) {
        state.currentMood = current.moodId
      }
    }
  },
  actions: {
    playMood: function ({ commit }, moodId) {
      Vue.http.get('/mood/' + moodId).then(response => {
        if (response.body.songs) {
          console.log(response.body.songs)
          commit('setCurrent', response.body.songs[0])
        }
      }, response => {
        console.log('Shit it the fan !')
      })
    }
  }
})

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
