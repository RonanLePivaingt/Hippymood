<template>
  <v-col
    v-if="currentSong.song"
    class="pa-0 pb-4"
  >
    <v-card class="player-card">
      <v-card-actions
        class="player-card-top d-none d-sm-flex"
        color="primary"
      >
        <v-spacer />

        <v-btn
          to="/search"
          text
          fab
          small
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="ma-2"
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
      </v-card-actions>

      <v-card-text class="player-card-top">
        <p class="title">
          <v-icon>mdi-music-note</v-icon>
          {{ currentSong.song }}
        </p>
      </v-card-text>

      <v-card-text class="song-information">
        <div
          v-show="currentSong.album"
          class="text--primary subtitle-1"
        >
          <v-icon>mdi-album</v-icon>
          {{ currentSong.album }}
        </div>

        <div class="text--primary subtitle-1">
          <v-icon>mdi-account</v-icon>
          {{ currentSong.artist }}
        </div>
      </v-card-text>

      <v-card-actions>
        <PlayerControls fab />
      </v-card-actions>

      <v-card-text class="player-card-mood">
        <v-chip>
          {{ currentMood.name }}
        </v-chip>
      </v-card-text>
    </v-card>

    <DemoSnackbar v-if="demoMode" />
  </v-col>
</template>

<script>
import { mapState } from 'vuex'
import Menu from './Menu'
import PlayerControls from './PlayerControls'
import DemoSnackbar from './DemoSnackbar'

export default {
  name: 'PlayerCard',
  components: {
    PlayerControls,
    Menu,
    DemoSnackbar ,
  },
  data: () => ({
    demoMode: CONFIG.global.demoMode,
  }),
  computed: mapState('music', [
    'currentSong',
    'currentMood',
    'playbackState',
  ]),
};
</script>

<style lang="scss">
.player-card {
  text-align: left;

  @media screen and (min-width: 600px) {
    width: 30rem;
  }

  .player-card-top {
    background-color: var(--v-primary-base);

    .theme--light.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
      background-color: inherit;
    }

    i.v-icon {
      color: rgba(255, 255, 255, 0.8);
    }
    p {
      color: #fff;
      margin-top: 2rem;
      margin-bottom: 0rem;
    }
  }

  .song-information {
    padding-bottom: 0px;
  }

  .player-card-actions {
    justify-content: center;

    button {
      transform: scale(1.3);

      &.play {
        z-index: 5;
      }
    }
  }
  .player-card-mood {
    text-align: center;
  }
}
</style>
