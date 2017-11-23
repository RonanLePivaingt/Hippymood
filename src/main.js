// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import router from '@/router'
import App from '@/App'

import Config from '@/../build/serverConfig.js'

import VueYouTubeEmbed from 'vue-youtube-embed'
Vue.use(VueYouTubeEmbed)

import VueSocketio from 'vue-socket.io'
Vue.use(VueSocketio, '/')

import 'chart.js'
import 'hchs-vue-charts'
Vue.use(window.VueCharts)

var VueTouch = require('vue-touch')
// Declaring a quintuple tap for the beta unlocking features in the about view
VueTouch.registerCustomEvent('quintupletap', {
  type: 'tap',
  taps: 5
})
Vue.use(VueTouch, {name: 'v-touch'})

// Youtube like progress bar
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: 'rgb(0, 188, 212)',
  failedColor: 'red',
  thickness: '3px'
})

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueMaterial)

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
    betaMode: false
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
    }
  },
  actions: {
    askPlayMood: function ({ commit }, moodId) {
      var videoMode = store.state.videoMode
      window.vm.$Progress.start()
      Vue.http.post('/mood/', {moodId: moodId, videoMode: videoMode}).then(response => {
        if (response.body.songs) {
          commit('setCurrent', response.body.songs[0])
          commit('setPlaying')
          window.vm.$Progress.finish()
        }
        if (response.body.nbSongsLeft !== undefined) {
          commit('setCurrentSongsLeft', response.body.nbSongsLeft)
        }
      }, response => {
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
          Vue.http.post('/mood/', {moodId: moodId, videoMode: videoMode}).then(response => {
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
          Vue.http.post('/mood/', {moodId: moodId, videoMode: videoMode}).then(response => {
            if (response.body.songs) {
              commit('setCurrent', response.body.songs[0])
              if (response.body.nbSongsLeft !== undefined) {
                commit('setCurrentSongsLeft', response.body.nbSongsLeft)
              }
              commit('setPlaying')
              window.vm.$Progress.finish()
            }
          }, response => {
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
          console.log(response)
          if (response.body.newSongs !== undefined) {
            commit('setWhatsNew', response.body.newSongs)
          } else {
            console.log('Shit it the fan !')
          }
        }
      )
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
      } else {
        console.log('Unlocking')
        this.$store.commit('setMoods', response.body)
        this.$store.commit('setUnlocked', 1)
      }
    }, response => {
      console.log('Shit it the fan !')
    })
  },
  methods: {
    extUnlock: function () {
      this.$http.post(
        '/',
        {combination: window.combination}
      )
        .then(
          function (response) {
            // Redirecting to main page if server response is good
            if (response.body === 'OK') {
              this.$http.get('/moods').then(response => {
                if (response.body === 'Must auth') {
                  this.$store.commit('setUnlocked', 0)
                } else {
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
    },
    extPlay: function () {
      var playerHTML5 = document.getElementById('playerHTML5')
      if (playerHTML5) {
        playerHTML5.play()
      }
      this.$store.commit('setPlaying')
    },
    extPause: function () {
      var playerHTML5 = document.getElementById('playerHTML5')
      if (playerHTML5) {
        playerHTML5.pause()
      }
      this.$store.commit('setPaused')
    },
    extTogglePlayPause: function () {
      var playerHTML5 = document.getElementById('playerHTML5')
      if (this.$store.state.playerState === 'playing') {
        playerHTML5.pause()
        this.$store.commit('setPaused')
      } else {
        playerHTML5.play()
        this.$store.commit('setPlaying')
      }
    },
    extPlayNextSong: function () {
      this.$store.dispatch('askFindAndPlayNextSong')
    },
    extPlayPreviousSong: function () {
      this.$store.dispatch('askPreviousSong')
    },
    extDisplayPlayer: function () {
      this.$router.push('/')
    },
    extDisplaySearch: function () {
      this.$router.push('/search')
    },
    extDisplayDownload: function () {
      this.$router.push('/download')
    },
    extDisplayAbout: function () {
      this.$router.push('/about')
    },
    extActivateBetaFeatures: function () {
      /* Video go open
      if (this.$store.state.betaMode === false) {
        this.$children[0].$refs.snackbar.open()
      } else if (this.$store.state.videoMode === true) {
        // Desactivating video mode as well
        this.$store.commit('toggleVideoMode')
      }

      this.$store.commit('toggleBetaMode')
      */
    },
    extToggleVideoMode: function () {
      this.$store.commit('toggleVideoMode')
    }
  }
})
