<template>
  <v-col
    v-if="videoMode && currentSong.song"
    class="video-player pa-0"
    align="center"
  >
    <youtube
      v-show="currentSong.youtube"
      :video-id="videoId"
      :player-vars="playerVars"
      @ready="ready"
      @playing="setPlaybackState('playing')"
      @paused="setPlaybackState('paused')"
      @ended="playNext"
    />

    <v-card
      class="video-player-card"
      elevation="0"
    >
      <v-card-text
        class="song-information"
        align="left"
      >
        <v-container
          v-show="!currentSong.youtube"
          class="video-problem"
        >
          <v-row
            class="flex-nowrap"
            align="center"
            justify="center"
          >
            <!-- eslint-disable -->
            <p class="emoji ma-4">(>_<)</p>
            <!-- eslint-enable -->

            <div
              v-show="currentMood.nbVideo !== '0'"
              class="message text-left"
            >
              <p>
                Il n'y a pas de vidéo pour cette chanson
              </p>
              <p class="ma-0">
                Pour continuer en mode vidéo, clique sur suivant ou deux fois sur une autre mood
              </p>
            </div>

            <div
              v-show="currentMood.nbVideo === '0'"
              class="message text-left"
            >
              <p>
                Il n'y a pas de vidéo pour cette mood
              </p>
              <p class="ma-0">
                Pour continuer en mode vidéo, clique deux fois sur une autre mood
              </p>
            </div>
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
import Menu from './Menu'

export default {
  name: 'PlayerVideo',
  components: {
    PlayerControls,
    Menu,
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
  margin-bottom: 1rem;

  iframe {
    width: 100%;
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

    .message {
      padding-right: 1rem;
    }
  }

  .song-information {
    padding-bottom: 0;
  }
}
</style>
