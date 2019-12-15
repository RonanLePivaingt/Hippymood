import music from '../../api/music'

// initial state
const state = {
  moods: [],
  currentMood: {},
  currentSong: {},
  nextSongs: [],
  playbackState: '',
  videoMode: false,
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
      if (!state.videoMode) {
        commit('setNextSongs', state.nextSongs)
      } else {
        const data = {}
        data.nextVideoSongs = state.nextSongs.filter(song => song.youtube !== null)
        const nextVideoId = data.nextVideoSongs[0].id
        data.nextSongs = state.nextSongs.filter(song => song.youtube !== nextVideoId)
        commit('setVideoNextSongs', data)
      }
    }
  },
  playSearchSong ({ commit, state }, song) {
    commit('setCurrentSong', song)
    commit('setCurrentMood', state.moods.find(mood => mood.id === song.moodId))
  },
  setPlaybackState ({ commit }, playbackState) {
    commit('setPlaybackState', playbackState)
  },
  toggleVideoMode ({ commit, state }) {
    commit('setVideoMode', !state.videoMode)
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
  setCurrentSong (state, song) {
    state.playbackState = 'playing'
    state.currentSong = song
  },
  setNextSongs (state, songs) {
    state.currentSong = songs[0]
    state.playbackState = 'playing'
    state.nextSongs = Object.freeze(songs.slice(1))
  },
  setVideoNextSongs (state, data) {
    state.currentSong = data.nextVideoSongs[0]
    state.playbackState = 'playing'
    state.nextSongs = Object.freeze(data.nextSongs.slice(1))
  },
  setPlaybackState (state, playbackState) {
    state.playbackState = playbackState
  },
  setVideoMode (state, videoMode) {
    state.videoMode = videoMode
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

