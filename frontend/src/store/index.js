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
    setDarkMode ({ commit, state }, bool) {
      commit('setDarkMode', bool)

      localStorage.setItem("darkMode", bool.toString())
    },
    setLang ({ commit, state }, lang) {
      commit('setLang', lang)

      localStorage.setItem("lang", lang)
    },
  },
  mutations: {
    setDarkMode (state, value) {
      state.darkMode = value
      Vuetify.framework.theme.dark = value
    },
    setLang (state, lang) {
      state.lang = lang
    },
  },
  modules: {
    music
  }
})
