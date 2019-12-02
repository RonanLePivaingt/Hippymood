<template>
  <v-container>
    <v-row justify="center">
      <v-col
        v-if="currentSong.song"
        cols="12"
        sm="8"
        md="6"
        lg="5"
        >

        <v-card>
          <v-card-text class="player-card-top">
            <p class="title">
            <v-icon>mdi-music-note</v-icon>
            {{ currentSong.song }}
            </p>
          </v-card-text>

          <v-card-text>
            <div v-show="currentSong.album" class="text--primary subtitle-1">
              <v-icon>mdi-album</v-icon>
              {{ currentSong.album }}
            </div>

            <div class="text--primary subtitle-1">
              <v-icon>mdi-account</v-icon>
              {{ currentSong.artist}}
            </div>
          </v-card-text>

          <v-card-actions
            class="d-none d-sm-flex player-card-actions"
            >
            <v-btn
              @click="play()"
              v-show="playbackState === 'paused'"
              color="primary"
              class="play"
              fab large>
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              @click="pause()"
              v-show="playbackState === 'playing'"
              color="primary"
              fab large>
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn
              @click.stop="playNext"
              fab large>
              <v-icon>mdi-skip-next</v-icon>
            </v-btn>
          </v-card-actions>

          <v-card-text class="player-card-mood">
            <v-chip>
              {{ currentMood.name }}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <MoodList/>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MoodList from './MoodList';

export default {
  name: 'PlayerCard',
  components: {
    MoodList,
  },
  computed: mapState('music', [
    'currentSong',
    'currentMood',
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
.mood-btn {
  margin: 0.5rem;
}
.player-card-top {
  background-color: rgb(25, 118, 210);

  i.v-icon {
    color: rgba(255, 255, 255, 0.8);
  }
  p {
    color: #fff;
    margin-top: 2rem;
    margin-bottom: 0rem;
  }
}
.player-card-actions {
  justify-content: center;

  button {
    transform: scale(1.3);

    &.play {
      z-index: 10;
    }
  }
}
.player-card-mood {
  text-align: center;
}
</style>
