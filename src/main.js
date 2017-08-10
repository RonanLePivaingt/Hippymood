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
    previous: [],
    previousIndex: 0,
    current: {},
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
    }
  },
  actions: {
    playMood: function ({ commit }, moodId) {
      Vue.http.get('/mood/' + moodId).then(response => {
        if (response.body.songs) {
          commit('setCurrent', response.body.songs[0])
          commit('setPlaying')
        }
      }, response => {
        console.log('Shit it the fan !')
        commit('setPaused')
      })
    },
    setNextMood: function ({ dispatch, commit }, moodId) {
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
        return dispatch('nextSong')
      }
    },
    setNextSong: function ({ dispatch, commit }, song) {
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
        }
      } else {
        // Should be triggering the next song action
        return dispatch('nextSong')
      }
    },
    nextSong: function ({ commit }) {
      if (store.state.previousIndex === 0) {
        // Normal next song handling
        var moodId
        if (store.state.next.type === undefined) {
          moodId = store.state.currentMood
          Vue.http.get('/mood/' + moodId).then(response => {
            if (response.body.songs) {
              commit('setCurrent', response.body.songs[0])
              commit('setPlaying')
            }
          }, response => {
            commit('setPaused')
          })
        } else if (store.state.next.type === 'mood') {
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
              store.state.next = {}
            })
          }
        } else if (store.state.next.type === 'song') {
          commit('setCurrent', store.state.next.song)
          store.state.next = {}
        }
      } else {
        // Handling from
        commit('decrementPreviousIndex')
        var songIndex = store.state.previous.length - store.state.previousIndex - 1
        commit('setCurrent', store.state.previous[songIndex])
      }
    },
    previousSong: function ({ commit }) {
      if (store.state.previous.length - 2 >= store.state.previousIndex) {
        commit('incrementPreviousIndex')
        var songIndex = store.state.previous.length - store.state.previousIndex
        commit('setCurrent', store.state.previous[songIndex])
      } else {
        console.log('Cant go back further :/')
      }
    },
    unlockedStatus: function ({ commit }, status) {
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
    play: function () {
      var playerHTML5 = document.getElementById('playerHTML5')
      playerHTML5.play()
      this.$store.commit('setPlaying')
    },
    pause: function () {
      var playerHTML5 = document.getElementById('playerHTML5')
      playerHTML5.pause()
      this.$store.commit('setPaused')
    },
    togglePlayPause: function () {
      var playerHTML5 = document.getElementById('playerHTML5')
      if (this.$store.state.playerState === 'playing') {
        playerHTML5.pause()
        this.$store.commit('setPaused')
      } else {
        playerHTML5.play()
        this.$store.commit('setPlaying')
      }
    },
    playNextSong: function () {
      this.$store.dispatch('nextSong')
    },
    playPreviousSong: function () {
      this.$store.dispatch('previousSong')
    },
    displayPlayer: function () {
      this.$router.push('/')
    },
    displaySearch: function () {
      this.$router.push('/search')
    },
    displayDownload: function () {
      this.$router.push('/download')
    },
    displayAbout: function () {
      this.$router.push('/about')
    }
  }
})
