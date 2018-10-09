<template>
  <div v-if="current.song">
    <md-card v-if="!videoMode" class="player-card md-primary">
      <md-card-header>
        <div class="md-title"><md-icon>audiotrack</md-icon>{{ current.song }}</div>
        <div
          v-if="current.album"
          class="md-subhead">
          <md-icon>album</md-icon>{{ current.album }}
        </div>
      </md-card-header>

      <md-card-content>
        <md-icon>person</md-icon> {{ current.artist }}
      </md-card-content>

      <md-card-actions class="player-card-actions">
        <md-button @click="pause()">Pause</md-button>
        <md-button @click="play()">Play</md-button>
        <md-button @click="next()">Next</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import VideoPlayer from './VideoPlayer'

export default {
  name: 'player',
  components: {
    VideoPlayer
  },
  computed: {
    moods () { return this.$store.state.moods },
    current () { return this.$store.state.current },
    videoMode () { return this.$store.state.videoMode }
  },
  methods: {
    play () {
      this.$store.dispatch('askPlay')
    },
    pause () {
      this.$store.dispatch('askPause')
    },
    next () {
      return this.$store.dispatch('askFindAndPlayNextSong')
    }
  }
}
</script>

<style lang="scss">
@media screen and (min-width: 600px) {
  .player-card {
    width: 30rem;
    margin: 2rem auto !important;
  }
}
.player-card-actions {
  justify-content: center !important;
}
@media screen and (min-width: 600px) {
  .player-card {
  }
}
</style>
