import music from '../../api/music'

// initial state
const state = {
  moods: [],
  currentMood: {},
  currentSong: {},
  nextSongs: []
}

// actions
const actions = {
  getMoods ({ commit }) {
    music.getMoods().then(response => {
      commit('setMoods', { moods: response.data });
    });
  },
  changeMood ({ commit }, mood) {
    music.getMood(mood.id).then(response => {
      commit('setNextSongs', response.data.songs)
      commit('setCurrentMood', mood)
    });
  },
  playNext ({ commit, state }) {
    if (state.nextSongs.length > 0) {
      commit('setNextSongs', state.nextSongs)
    }
  },

}

// mutations
const mutations = {
  setMoods (state, { moods }) {
    // Perf optimisation because reactivity is not needed for this data
    // more info there : https://vuedose.tips/tips/improve-performance-on-large-lists-in-vue-js/
    state.moods = Object.freeze(moods)
  },
  setCurrentMood (state, mood) {
    state.currentMood = mood
  },
  setNextSongs (state, songs) {
    state.currentSong = songs[0]
    state.nextSongs = Object.freeze(songs.slice(1))
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

