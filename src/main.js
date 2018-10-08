import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
// Vuex needs Promise and here is a polyfill for IE...
import 'es6-promise/auto'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import VueProgressBar from 'vue-progressbar'
import VueYouTubeEmbed from 'vue-youtube-embed'
// Components used by vue router
import Admin from './components/Admin'
import About from './components/About'
import Download from './components/Download'
import MoodList from './components/MoodList'
import Player from './components/Player'
import Search from './components/Search'
import Suggestions from './components/Suggestions'
import WhatsNew from './components/WhatsNew'

import Config from '@/../config.js'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueAxios, Axios)
Vue.use(VueMaterial)
Vue.use(VueProgressBar, {
  color: 'rgb(0, 188, 212)',
  failedColor: 'red',
  height: '4px'
})
Vue.use(VueYouTubeEmbed)

const BACKEND_API_URL = 'http://192.168.1.15:8087'
// const BACKEND_API_URL = 'http://localhost:8087'

const store = new Vuex.Store({
  state: {
    moods: [],
    previous: [],
    previousIndex: 0,
    current: {},
    currentSongsLeft: 99,
    next: {},
    nextMood: 0,
    whatsNew: [],
    intro: 1,
    unlocked: -1,
    playerState: 'intro',
    authCombination: Config.auth.combination,
    authCombinationCode: Config.auth.combinationCode,
    videoMode: false,
    betaMode: false,
    demoMode: Config.demoMode,
    user: {},
    suggestions: [],
    loadingSuggestions: true,
    backendApiUrl: BACKEND_API_URL
  },
  mutations: {
    setMoods (state, moods) {
      state.moods = moods
    },
    setCurrent (state, current) {
      // Adding current song to history if the user is not trying to listen to previous songs
      if (state.previousIndex === 0) {
        state.previous.push(state.current)
      }
      state.current = current

      // Removing intro text
      if (state.intro) {
        state.intro = 0
      }
    },
    setCurrentSongsLeft (state, nbSongsLeft) {
      state.currentSongsLeft = nbSongsLeft
    },
    setNext (state, next) {
      state.next = next
    },
    deleteNext (state) {
      state.next = {}
    },
    setPlaying (state) {
      state.playerState = 'playing'
    },
    setPaused (state) {
      state.playerState = 'paused'
    },
    setUnlocked (state, unlocked) {
      state.unlocked = unlocked
    },
    incrementPreviousIndex (state) {
      state.previousIndex++
    },
    decrementPreviousIndex (state) {
      state.previousIndex--
    },
    toggleVideoMode (state) {
      if (state.videoMode === true) {
        state.videoMode = false
      } else {
        state.videoMode = true
      }
    },
    toggleBetaMode (state) {
      if (state.betaMode === true) {
        state.betaMode = false
      } else {
        state.betaMode = true
      }
    },
    setWhatsNew (state, whatsNew) {
      state.whatsNew = state.whatsNew.concat(whatsNew)
    },
    setUser (state, userData) {
      state.user = userData

      localStorage.setItem('user', JSON.stringify(userData))
    },
    setSuggestions (state, suggestions) {
      if (Object.keys(suggestions).length > 0) {
        state.suggestions = suggestions
      }
      state.loadingSuggestions = false
    }
  },
  actions: {
    askPause: function ({ commit }) {
      commit('setPaused')
    },
    askPlay: function ({ commit }) {
      commit('setPlaying')
    },
    askPlayMood: function ({ commit }, moodId) {
      var videoMode = store.state.videoMode
      window.vm.$Progress.start()
      Vue.axios.post(BACKEND_API_URL + '/mood/', { moodId: moodId, videoMode: videoMode }).then((response) => {
        if (response.data.songs) {
          commit('setCurrent', response.data.songs[0])
          commit('setPlaying')
          window.vm.$Progress.finish()
        }
        if (response.data.nbSongsLeft !== undefined) {
          commit('setCurrentSongsLeft', response.data.nbSongsLeft)
        }
      }, response => {
        // eslint-disable-next-line
        console.log('Shit it the fan !')
        window.vm.$Progress.fail()
        commit('setPaused')
      })
    },
    askNextMood: function ({ dispatch, commit }, moodId) {
      if (store.state.next.moodId !== moodId && store.state.current.moodId !== moodId) {
        commit(
          'setNext',
          {
            moodId: moodId,
            type: 'mood'
          }
        )
      } else {
        // Should be triggering the next song action
        return dispatch('askFindAndPlayNextSong')
      }
    },
    askNextSong: function ({ dispatch, commit }, song) {
      if (store.state.next.type !== 'mood') {
        if (store.state.current.id !== undefined) {
          commit(
            'setNext',
            {
              song: song,
              type: 'song'
            }
          )
        } else {
          commit('setCurrent', song)
          commit('setPlaying', song)
          Vue.http.get('/searchSongPlayed/' + song.id)
        }
      } else {
        // Should be triggering the next song action
        return dispatch('askNextSong')
      }
    },
    askFindAndPlayNextSong: function ({ commit }) {
      if (store.state.previousIndex === 0) {
        // Normal next song handling
        var moodId
        var videoMode
        if (store.state.next.type === undefined) {
          window.vm.$Progress.start()
          moodId = store.state.current.moodId
          videoMode = store.state.videoMode
          Vue.http.post('/mood/', { moodId: moodId, videoMode: videoMode }).then(response => {
            if (response.body.songs) {
              commit('setCurrent', response.body.songs[0])
              commit('setPlaying')
              window.vm.$Progress.finish()
            }
            if (response.body.nbSongsLeft !== undefined) {
              commit('setCurrentSongsLeft', response.body.nbSongsLeft)
            }
          }, response => {
            window.vm.$Progress.fail()
            commit('setPaused')
          })
        } else if (store.state.next.type === 'mood') {
          moodId = store.state.next.moodId
          videoMode = store.state.next.videoMode
          store.state.next = {}
          window.vm.$Progress.start()
          Vue.http.post('/mood/', { moodId: moodId, videoMode: videoMode }).then(response => {
            if (response.body.songs) {
              commit('setCurrent', response.body.songs[0])
              if (response.body.nbSongsLeft !== undefined) {
                commit('setCurrentSongsLeft', response.body.nbSongsLeft)
              }
              commit('setPlaying')
              window.vm.$Progress.finish()
            }
          }, response => {
            // eslint-disable-next-line
            console.log('Shit it the fan !')
            window.vm.$Progress.fail()
            commit('setPaused')
            store.state.next = {}
          })
        } else if (store.state.next.type === 'song') {
          // Putting the searched song instead of the current one
          commit('setCurrent', store.state.next.song)
          store.state.next = {}
          // Telling the server that this searched song is played and shouldn't been played again
          var songId = store.state.current.id
          Vue.http.get('/searchSongPlayed/' + songId)
        }
      } else {
        // Handling from
        commit('decrementPreviousIndex')
        var songIndex = store.state.previous.length - store.state.previousIndex - 1
        commit('setCurrent', store.state.previous[songIndex])
      }
    },
    askPreviousSong: function ({ commit }) {
      if (store.state.previous.length - 2 >= store.state.previousIndex) {
        commit('incrementPreviousIndex')
        var songIndex = store.state.previous.length - store.state.previousIndex
        commit('setCurrent', store.state.previous[songIndex])
      } else {
        // eslint-disable-next-line
        console.log('Cant go back further :/')
      }
    },
    askUnlockedStatus: function ({ commit }, status) {
      commit('setUnlocked', status)
    },
    askWhatsNew: function ({ dispatch, commit }) {
      var url = '/newSongs/' + store.state.whatsNew.length.toString()

      Vue.http.get(url).then(
        response => {
          if (response.body.newSongs !== undefined) {
            commit('setWhatsNew', response.body.newSongs)
          } else {
            // eslint-disable-next-line
            console.log('Shit it the fan !')
          }
        }
      )
    },
    askSetUser: function ({ commit }, seed) {
      window.vm.$Progress.start()

      Vue.http.post(
        '/login/',
        { seed: seed }
      ).then(
        response => {
          if (!isNaN(parseInt(response.body.id))) {
            window.vm.$Progress.finish()
            commit(
              'setUser',
              {
                id: response.body.id,
                name: response.body.name || '',
                status: response.body.status || '',
                masterUser: response.body.masterUser
              }
            )
            if (window.vm.$route.name === 'Login') {
              window.vm.$router.go(-1)
            }
          } else {
            window.vm.$Progress.fail()
          }
        }
      )
    },
    askSuggestions: function ({ commit }) {
      window.vm.$Progress.start()
      Vue.http.get('/suggestions/').then(
        response => {
          var suggestions = response.body.suggestions
          commit('setSuggestions', suggestions)
          window.vm.$Progress.finish()
        }
      )
    }
  }
})

const routes = [
  { path: '/', component: Player },
  { path: '/About', component: About },
  { path: '/Admin', component: Admin },
  { path: '/Download', component: Download },
  { path: '/Moods', component: MoodList },
  { path: '/Search', component: Search },
  { path: '/Suggestions', component: Suggestions },
  { path: '/WhatsNew', component: WhatsNew }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

// Vue instance
window.vm = new Vue({
  render: h => h(App),
  store,
  router,
  created: function () {
    Vue.axios.get(BACKEND_API_URL + '/moods').then((response) => {
      this.$store.commit('setMoods', response.data)
    })
  }
}).$mount('#app')
