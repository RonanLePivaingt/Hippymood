<template>
  <audio
    v-if="audioPlayback"
    ref="audioPlayer"
    autoplay
    :src="currentSong.path ? `/music/${currentSong.path}` : ''"
    @ended="playNext"
  >
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { MediaSession } from '../utils/mediaSession'

export default {
  name: 'AudioPlayer',
  data: () => ({
    mediaSession: {},
  }),
  computed: {
    ...mapState('music', [
      'currentSong',
      'playbackState',
      'videoMode',
    ]),
    audioPlayback () {
      if (this.videoMode && this.currentSong.youtube !== null) {
        return false
      }

      return true
    }
  },
  watch: {
    currentSong (newSong) {
      this.mediaSession.setSong(newSong)
    }
  },
  created () {
    this.$root.$on('pause', this.pause);
    this.$root.$on('play', this.play);

    this.mediaSession = new MediaSession(this.currentSong)
    this.mediaSession.emitter.on('playNext', this.playNext)
    this.mediaSession.emitter.on('pause', this.pause)
    this.mediaSession.emitter.on('play', this.play)
  },
  beforeDestroy: function () {
    this.MediaSession.destroy()
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
  },
};
</script>
