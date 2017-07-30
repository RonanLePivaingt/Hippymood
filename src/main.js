// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import router from '@/router'
import App from '@/App'
import PlayerHtml5 from '@/components/PlayerHtml5'
import MoodList from '@/components/MoodList'

import Config from '@/../build/serverConfig.js'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueMaterial)

Vue.component('mood-list', MoodList)
Vue.component('player-html5', PlayerHtml5)

const store = new Vuex.Store({
  state: {
    moods: [],
    current: {},
    currentMood: 0,
    next: {},
    nextMood: 0,
    intro: 1,
    unlocked: -1,
    playerState: 'intro',
    authCombination: Config.auth.combination,
    authCombinationCode: Config.auth.combinationCode
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
    },
    setNext (state, next) {
      state.next = next
    },
    setPlaying (state) {
      state.playerState = 'playing'
    },
    setPaused (state) {
      state.playerState = 'paused'
    },
    removeIntro (state) {
      state.intro = 0
    },
    setUnlocked (state, unlocked) {
      state.unlocked = unlocked
    }
  },
  actions: {
    playMood: function ({ commit }, moodId) {
      Vue.http.get('/mood/' + moodId).then(response => {
        if (response.body.songs) {
          commit('setCurrent', response.body.songs[0])
          commit('setPlaying')
          commit('removeIntro')
        }
      }, response => {
        console.log('Shit it the fan !')
        commit('setPaused')
      })
    },
    setNextMood: function ({ dispatch, commit }, moodId) {
      // That dont variable is ugly but eslinter is shouting on else if use...
      var dont = false
      if (store.state.next.type !== 'mood' && store.state.next.moodId !== moodId) {
        dont = true
        commit(
          'setNext',
          {
            moodId: moodId,
            type: 'mood'
          }
        )
      }
      if (store.state.next.type === 'mood' && store.state.next.moodId === moodId && dont === false) {
        // Should be triggering the next song action
        return dispatch('nextSong')
      }
    },
    nextSong: function ({ commit }) {
      var moodId
      if (store.state.next === {}) {
        moodId = store.state.currentMood
        Vue.http.get('/mood/' + moodId).then(response => {
          if (response.body.songs) {
            commit('setCurrent', response.body.songs[0])
            commit('setPlaying')
          }
        }, response => {
          commit('setPaused')
        })
      }
      if (store.state.next !== {}) {
        if (store.state.next.type === 'mood') {
          moodId = store.state.next.moodId
          store.state.currentMood = moodId
          store.state.next = {}
          Vue.http.get('/mood/' + moodId).then(response => {
            if (response.body.songs) {
              commit('setCurrent', response.body.songs[0])
              commit('setPlaying')
            }
          }, response => {
            console.log('Shit it the fan !')
            commit('setPaused')
          })
        }
      }
    },
    unlockedStatus: function ({ commit }, status) {
      console.log('Changing unlocked status')
      commit('setUnlocked', status)
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
  created: function () {
    this.$http.get('/moods').then(response => {
      if (response.body === 'Must auth') {
        this.$store.commit('setUnlocked', 0)
      }
      if (response.body !== 'Must auth') {
        console.log('Unlocking')
        this.$store.commit('setMoods', response.body)
        this.$store.commit('setUnlocked', 1)
      }
    }, response => {
      console.log('Shit it the fan !')
    })
  },
  methods: {
    unlock: function () {
      this.$http.post(
        '/',
        {combination: this.$store.state.authCombinationCode}
      )
        .then(
          function (response) {
            // Redirecting to main page if server response is good
            if (response.body === 'OK') {
              this.$http.get('/moods').then(response => {
                console.log(response)
                if (response.body === 'Must auth') {
                  this.$store.commit('setUnlocked', 0)
                }
                if (response.body !== 'Must auth') {
                  console.log('Unlocking')
                  this.$store.commit('setMoods', response.body)
                  this.$store.commit('setUnlocked', 1)
                }
              }, response => {
                console.log('Shit it the fan !')
              })
            }
          }
        )
    }
  }
})
