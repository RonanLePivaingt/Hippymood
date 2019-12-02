<template>
  <audio
    autoplay
    v-on:ended="playNext()"
    :src="/music/ + currentSong.path"
    ref="audioPlayer"
    >
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AudioPlayer',
  computed: mapState('music', [ 'currentSong' ]),
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
      this.$refs.audioPlayer.pause()
      this.setPlaybackState('paused')
    },
    play() {
      this.$refs.audioPlayer.play()
      this.setPlaybackState('playing')
    },
  }
};
</script>

<style>
.mood-btn {
  margin: 0.5rem;
}
</style>
