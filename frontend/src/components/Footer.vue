<template>
  <v-footer
    v-if="currentSong.song"
    class="d-flex d-sm-none"
    fixed>
    <router-link to="/">
      <div class="flex-column song-information">
        <p>
        <v-icon>mdi-music-note</v-icon>
          {{ currentSong.song }}
        </p>
        <p v-show="currentSong.album">
          <v-icon>mdi-album</v-icon>
          {{ currentSong.album }}
        </p>
        <p>
          <v-icon>mdi-account</v-icon>
          {{ currentSong.artist}}
        </p>
      </div>
    </router-link>

    <v-spacer></v-spacer>

    <div class="actions">
      <v-btn @click="play"
        v-show="playbackState === 'paused'"
        color="primary"
        fab>
        <v-icon>mdi-play</v-icon>
      </v-btn>

      <v-btn
        v-show="playbackState === 'playing'"
        @click="pause"
        color="primary"
        fab>
        <v-icon>mdi-pause</v-icon>
      </v-btn>

      <v-btn
        @click="playNext"
        fab outlined>
        <v-icon>mdi-skip-next</v-icon>
      </v-btn>
    </div>
  </v-footer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Footer',
  computed: mapState('music', [
    'currentSong',
    'playbackState',
  ]),
  methods: {
    ...mapActions('music', [ 'playNext' ]),
    play() {
      this.$root.$emit('play');
    },
    pause() {
      this.$root.$emit('pause');
    },
  },
};
</script>

<style lang="scss">
.v-application .song-information p {
  margin-bottom: 0px;
}
.v-application footer {
  flex-wrap: nowrap;

  > a {
    color: rgba(0, 0, 0, 0.87);
  }
  &.theme--dark a  {
    color: white;
  }

  > a {
    text-decoration: none;
    overflow: hidden;

    .song-information {
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .actions {
    flex-shrink: 0;

    button {
      margin-left: 8px;
    }
  }
}
</style>
