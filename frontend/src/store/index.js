import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from '../plugins/vuetify'
import music from './modules/music'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    darkMode: false,
  },
  actions: {
    toggleDarkMode ({ commit, state }) {
      commit('setDarkMode', !state.darkMode)
    },
  },
  mutations: {
    setDarkMode (state, value) {
      state.darkMode = value
      Vuetify.framework.theme.dark = value
    },
  },
  modules: {
    music
  }
})
