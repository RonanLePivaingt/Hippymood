<template>
  <div>
    <audio
      id="playerHTML5"
      ref="playerHTML5"
      autoplay="autoplay"
      :src="sourcePath"
      v-on:ended="next()"
      ></audio>

    <!-- Trick to force Vuejs reactivity with playerState -->
    <span class="hidden">{{ playerState }}</span>
  </div>
</template>

<script>

export default {
  name: 'audio-player',
  computed: {
    current () {
      return this.$store.state.current
    },
    playerState () {
      if (this.$store.state.playerState === 'paused') {
        this.$refs['playerHTML5'].pause()
      } else if (this.$store.state.playerState === 'playing') {
        this.$refs['playerHTML5'].play()
      }
      return this.$store.state.playerState
    },
    sourcePath () {
      if (this.$store.state.current.path !== undefined) {
        return this.$store.state.backendApiUrl + '/' + this.$store.state.current.path
      } else {
        return false
      }
    }
  },
  methods: {
    next () {
      return this.$store.dispatch('askFindAndPlayNextSong')
    }
  }
}
</script>

<style>
.hidden {
  display: none;
}
</style>
