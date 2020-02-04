import music from '../../api/music'

// initial state
const state = {
  moods: [],
  currentMood: {},
  currentSong: {},
  nextSongs: [],
  playbackState: '',
  videoMode: false,
  whatsNew: [],
}

// actions
const actions = {
  getMoods ({ commit }) {
    music.getMoods().then(response => {
      commit('setMoods', { moods: response.data });
    });
  },
  changeMood ({ commit, state }, mood) {
    music.getMood(mood.id).then(response => {
      if (state.videoMode) {
        response.data.songs.sort(videoSongsFirst)
      }

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

    // Not negating state.videoMode because above commit is already applied
    if (state.videoMode) {
      commit(
        'setSortedNextSongs',
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
  playSong ({ commit, state }, song) {
    commit('setCurrentSong', song)
    commit('setCurrentMood', state.moods.find(mood => mood.id === song.moodId))
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
  setSortedNextSongs (state, songs) {
    state.nextSongs = Object.freeze(songs)
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
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

// Sort songs to place video songs first
function videoSongsFirst (a, b) {
  if (a.youtube === null && b.youtube === null) {
    return 0
  } else if (a.youtube === null) {
    return 1
  } else {
    return -1
  }
}
