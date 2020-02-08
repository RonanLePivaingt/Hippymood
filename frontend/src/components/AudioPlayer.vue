<template>
  <audio
    v-if="audioPlayback"
    ref="audioPlayer"
    :src="/music/ + currentSong.path"
    autoplay
    @-on:ended="playNext"
  >
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AudioPlayer',
  computed: {
    ...mapState('music', [
      'currentSong',
      'videoMode',
    ]),
    audioPlayback () {
      if (this.videoMode && this.currentSong.youtube !== null) {
        return false
      }

      return true
    }
  },
  created () {
    this.$root.$on('pause', this.pause);
    this.$root.$on('play', this.play);
  },
  methods: {
    ...mapActions('music', [
      'setPlaybackState',
      'playNext',
    ]),
    pause() {
      if (this.audioPlayback) {
        this.$refs.audioPlayer.pause()
        this.setPlaybackState('paused')
      }
    },
    play() {
      if (this.audioPlayback) {
        this.$refs.audioPlayer.play()
        this.setPlaybackState('playing')
      }
    },
  }
};
</script>

<style>
.mood-btn {
  margin: 0.5rem;
}
</style>
