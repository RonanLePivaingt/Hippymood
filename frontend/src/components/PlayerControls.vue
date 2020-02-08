<template>
  <v-row
    class="player-card-actions justify-center d-none d-sm-flex"
    :class="fab ? 'fab' : ''"
  >
    <v-btn
      v-show="playbackState === 'paused'"
      color="secondary"
      class="play"
      :fab="fab"
      :rounded="rounded"
      large
      @click="play()"
    >
      <v-icon>mdi-play</v-icon>
    </v-btn>

    <v-btn
      v-show="playbackState === 'playing'"
      color="secondary"
      :fab="fab"
      :rounded="rounded"
      large
      @click="pause()"
    >
      <v-icon>mdi-pause</v-icon>
    </v-btn>

    <v-btn
      v-show="!displayReplayButton"
      :class="!fab ? 'ml-2' : ''"
      :fab="fab"
      :rounded="rounded"
      large
      @click.stop="playNext"
    >
      <v-icon>mdi-skip-next</v-icon>
    </v-btn>

    <v-btn
      v-show="displayReplayButton"
      :class="!fab ? 'ml-2' : ''"
      :fab="fab"
      :rounded="rounded"
      large
      @click.stop="resetSessionBeforePlay(currentMood)"
    >
      <v-icon>mdi-replay</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'PlayerControls',
  props: {
    fab: Boolean,
    rounded: Boolean
  },
  computed: {
    ...mapState('music', [
      'currentSong',
      'currentMood',
      'videoMode',
      'playbackState',
      'nextType',
    ]),
    ...mapGetters('music', [
      'nbSongsLeft',
    ]),
    displayReplayButton () {
      if (this.nbSongsLeft === 0) {
        if (this.nextType !== '') {
          return false
        }
        return true
      }
      return false
    }
  },
  methods: {
    ...mapActions('music', [
      'playNext',
      'loadAndPlayMood',
      'resetSessionBeforePlay',
    ]),
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
.player-card-actions {
  .fab {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .v-application--is-ltr .v-card__actions .player-card-actions .v-btn--fab + .v-btn--fab {
    margin-left: 0px;
  }
}
</style>
