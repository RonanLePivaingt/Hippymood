import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from '../plugins/vuetify'
import music from './modules/music'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    darkMode: false,
    lang: 'fr',
    langIndex: 0,
  },
  actions: {
    toggleDarkMode ({ commit, state }) {
      commit('setDarkMode', !state.darkMode)
    },
    setLang ({ commit, state }, lang) {
      commit('setLang', lang)
    },
  },
  mutations: {
    setDarkMode (state, value) {
      state.darkMode = value
      Vuetify.framework.theme.dark = value
    },
    setLang (state, lang) {
      state.lang = lang.lang
      state.langIndex = lang.index
    },
  },
  modules: {
    music
  }
})
