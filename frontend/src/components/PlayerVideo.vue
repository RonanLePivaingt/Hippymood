<template>
  <v-col
    v-if="videoMode && currentSong.song"
    class="video-player pa-0"
    align="center"
  >
    <youtube
      v-show="currentSong.youtube"
      class="youtube-container"
      :video-id="videoId"
      :player-vars="playerVars"
      player-width="100%"
      player-height="100%"
      @ready="ready"
      @playing="setPlaybackState('playing')"
      @paused="setPlaybackState('paused')"
      @ended="playNext"
    />

    <v-card
      class="video-player-card mt-4"
      elevation="2"
    >
      <v-card-text
        class="pb-0"
        align="left"
      >
        <v-container
          v-show="!currentSong.youtube"
          class="video-problem"
        >
          <v-row
            class="flex-nowrap pr-4"
            align="center"
            justify="center"
          >
            <!-- eslint-disable -->
            <p class="emoji my-4">(>_<)</p>
            <!-- eslint-enable -->

            <v-col
              v-show="currentMood.nbVideo !== '0'"
              class="message text-left"
            >
              <p>
                Il n'y a pas de vidéo pour cette chanson
              </p>
              <p class="ma-0">
                Pour continuer en mode vidéo, clique sur suivant ou deux fois sur une autre mood
              </p>
            </v-col>

            <v-col
              v-show="currentMood.nbVideo === '0'"
              class="message text-left"
            >
              <p>
                Il n'y a pas de vidéo pour cette mood
              </p>
              <p class="ma-0">
                Pour continuer en mode vidéo, clique deux fois sur une autre mood
              </p>
            </v-col>
          </v-row>
        </v-container>
        <v-row>
          <v-col>
            <p class="ma-0">
              <v-icon>mdi-music-note</v-icon>
              {{ currentSong.song }}
            </p>

            <p
              v-if="currentSong.album"
              class="ma-0"
            >
              <v-icon>mdi-album</v-icon>
              {{ currentSong.album }}
            </p>

            <p class="ma-0">
              <v-icon>mdi-account</v-icon>
              {{ currentSong.artist }}
            </p>
          </v-col>
          <v-menu
            bottom
            left
          >
            <template v-slot:activator="{ on }">
              <v-btn
                class="d-none d-sm-flex ma-2"
                text
                fab
                small
                v-on="on"
              >
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <Menu />
          </v-menu>
        </v-row>
      </v-card-text>

      <PlayerControls rounded />

      <MoodChips />
    </v-card>
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PlayerControls from './PlayerControls'
import Menu from './Menu'
import MoodChips from './MoodChips'

export default {
  name: 'PlayerVideo',
  components: {
    PlayerControls,
    Menu,
    MoodChips,
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
  created () {
    this.$root.$on('pause', this.pause);
    this.$root.$on('play', this.play);
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
  /* CSS magic to make Youtube iframe quite responsive */
  .youtube-container {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 30px;
    height: 0;
    overflow: hidden;

    iframe {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .video-player-card,
  .video-problem {
    width: 100%;

    @media screen and (min-width: 600px) {
      width: 30rem;
    }

    .emoji {
      font-size: 3rem;
      color: rgba(0, 0, 0, 0.6);

      .theme--dark & {
        color: white;
      }
    }
  }
}
</style>
