<template>
  <v-col
    v-if="videoMode"
    align="center"
    class="video-player pa-0"
    >
    <youtube
      :video-id="videoId"
      :player-vars="playerVars"
      @ready="ready"
      @playing="setPlaybackState('playing')"
      @paused="setPlaybackState('paused')"
      @ended="playNext"
      />

    <v-card class="video-player-card" elevation="0">
      <v-card-text class="song-information" align="left">
        <p class="ma-0">
          <v-icon>mdi-music-note</v-icon>
          {{ currentSong.song }}
        </p>

        <p v-if="currentSong.album" class="ma-0">
          <v-icon>mdi-album</v-icon>
          {{ currentSong.album }}
        </p>

        <p class="ma-0">
          <v-icon>mdi-account</v-icon>
          {{ currentSong.artist}}
        </p>
      </v-card-text>

      <PlayerControls rounded />

      <v-card-text>
        <v-chip>
          {{ currentMood.name }}
        </v-chip>
      </v-card-text>
    </v-card>
  </v-col>
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
  data: () => ({
    playerVars: {
      autoplay: 1,
      iv_load_policy: 3,
      rel: 0,
    }
  }),
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

<style lang="scss">
.video-player {
  iframe {
    width: 100%;

    @media screen and (min-width: 600px) {
      width: 60%;
    }
  }

  .video-player-card {
    @media screen and (min-width: 600px) {
      width: 30rem;
    }
  }

  .song-information {
    padding-bottom: 0;
  }
}
</style>
