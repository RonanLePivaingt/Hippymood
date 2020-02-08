import music from '../../api/music'

const state = {
  moods: [],
  currentMood: {},
  currentSong: {},
  nextSongs: [],
  nextType: '',
  next: {},
  playbackState: '',
  videoMode: false,
  whatsNew: [],
  moodSongsAlreadyPlayed: {},
}

const getters = {
  nbSongsLeft: state => {
    if (!state.videoMode) {
      return state.nextSongs.length
    } else {
      return state.nextSongs
        .filter(song => song.youtube !== null)
        .length
    }
  }
}

const actions = {
  getMoods ({ commit }) {
    music.getMoods().then(response => {
      commit('setMoods', { moods: response.data });
    });
  },
  playNextMood ({ commit, state, dispatch }, mood) {
    if (state.playbackState !== 'playing') {
      dispatch('loadAndPlayMood', mood)
    } else if (state.currentSong.moodId === mood.id) {
      if (state.nextType !== '') {
        commit('resetNext')
      }

      dispatch('playNext')
    } else if (state.nextType === '' || state.next.id !== mood.id) {
        commit('setNextType', 'mood')
        commit('setNext', mood)
    } else {
      dispatch('loadAndPlayMood', mood)
    }
  },
  playNextSong ({ commit, state, dispatch }, song) {
    commit('setNextType', 'song')
    commit('setNext', song)

    if (state.playbackState !== 'playing') {
      dispatch('playNext')
    }
  },
  playNext ({ commit, state, dispatch }) {
    if (state.moodSongsAlreadyPlayed.id) {
      return false
    }
    if (state.nextType === 'mood') {
      dispatch('loadAndPlayMood', state.next)
    } else if (state.nextType === 'song') {
      // Setting current mood and song
      commit('setCurrentSong', state.next)
      commit('setCurrentMood', state.moods.find(mood => mood.id === state.currentSong.moodId))

      dispatch('loadMood', state.next.moodId)
    } else {
      commit('setCurrentSong', state.nextSongs[0])

      if (state.nextSongs.length > 0) {
        commit('setNextSongs', state.nextSongs.slice(1))
      }
    }

    if (state.currentSong.moodId !== state.currentMood.id) {
      commit('setCurrentMood', state.moods.find(mood => mood.id === state.currentSong.moodId))
    }

    if (state.next !== {}) {
      commit('resetNext')
    }
  },
  loadMood ({ commit, state, dispatch }, moodId) {
    return music.getMood(moodId).then(response => {
      if (response.data.error && response.data.error.allSongGenrePlayed) {
        commit('setMoodSongsAlreadyPlayed', state.moods.find(mood => mood.id === moodId))
      } else {
        if (state.videoMode) {
          response.data.songs.sort(videoSongsFirst)
        }

        return commit('setNextSongs', response.data.songs)
      }
    });
  },
  loadAndPlayMood ({ commit, state, dispatch }, mood) {
    dispatch('loadMood', mood.id).then( () => {
      dispatch('playNext')
    })
  },
  setPlaybackState ({ commit }, playbackState) {
    commit('setPlaybackState', playbackState)
  },
  toggleVideoMode ({ commit, state }) {
    commit('setVideoMode', !state.videoMode)

    // Not negating state.videoMode because above commit is already applied
    if (state.videoMode) {
      commit(
        'setNextSongs',
        JSON.parse(JSON.stringify(state.nextSongs)).sort(videoSongsFirst)
      )
    }
  },
  getWhatsNew ({ commit, state }) {
    const page = state.whatsNew.length ? state.whatsNew.length / 10 : 0
    music.getWhatsNew(page).then(response => {
      commit('setWhatsNew', [...state.whatsNew, ...response.data]);
    });
  },
  resetMoodSongsAlreadyPlayed ({ commit }) {
    commit('setMoodSongsAlreadyPlayed', {})
  },
  resetSessionBeforePlay ({ commit, state, dispatch }, mood) {
    music.resetMoodSession(mood.id).then(response => {
      commit('setMoodSongsAlreadyPlayed', {})
      dispatch('loadAndPlayMood', mood)
    })
  },
  resetNext ({ commit }) {
    commit('resetNext')
  },
}

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
    music.postPlayedSong(song.id)
  },
  setNextSongs (state, songs) {
    state.nextSongs = Object.freeze(songs)
  },
  setNextType (state, type) {
    state.nextType = type
  },
  setNext (state, next) {
    state.next = next
  },
  setPlaybackState (state, playbackState) {
    state.playbackState = playbackState
  },
  setVideoMode (state, videoMode) {
    state.videoMode = videoMode
  },
  setWhatsNew (state, whatsNew) {
    state.whatsNew = Object.freeze(whatsNew)
  },
  setMoodSongsAlreadyPlayed (state, mood) {
    state.moodSongsAlreadyPlayed = Object.freeze(mood)
  },
  resetNext (state) {
    state.next = {}
    state.nextType = ''
  },
}

// Sort function to reoarganize songs with video first
function videoSongsFirst (a, b) {
  if (a.youtube === null && b.youtube === null) {
    return 0
  } else if (a.youtube === null) {
    return 1
  } else {
    return -1
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
