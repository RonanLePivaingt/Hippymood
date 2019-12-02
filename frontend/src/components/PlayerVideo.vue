<template>
  <div
    v-if="videoMode"
    class="text-center"
    >
    <youtube
      :video-id="videoId"
      :player-vars="{ autoplay: 1 }"
      @ready="ready"
      @playing="setPlaybackState('playing')"
      @paused="setPlaybackState('paused')"
      @ended="playNext"
      />

    <PlayerControls rounded />

    <v-chip>
      {{ currentMood.name }}
    </v-chip>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PlayerControls from './PlayerControls'

export default {
  name: 'PlayerVideo',
  components: {
    PlayerControls,
  },
  created () {
    this.$root.$on('pause', this.pause);
    this.$root.$on('play', this.play);
  },
  computed: {
    ...mapState('music', [
      'currentSong',
      'currentMood',
      'videoMode',
    ]),
    videoId() {
      if (this.currentSong.youtube) {
        return this.$youtube.getIdFromURL(this.currentSong.youtube)
      }

      return ''
    }
  },
  methods: {
    ...mapActions('music', [
      'playNext',
      'setPlaybackState',
    ]),
    ready (event) {
      this.player = event.target
    },
    play () {
      this.player.playVideo()
      this.setPlaybackState('playing')
    },
    pause () {
      this.player.pauseVideo()
      this.setPlaybackState('paused')
    },
  },
};
</script>

<style>
iframe {
  width: 100%;
}
</style>
