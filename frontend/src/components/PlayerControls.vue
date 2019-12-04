<template>
  <v-row class="player-card-actions justify-center d-none d-sm-flex" :class="fab ? 'fab' : ''">
    <v-btn
      @click="play()"
      v-show="playbackState === 'paused'"
      color="primary"
      class="play"
      :fab="fab"
      :rounded="rounded"
      large>
      <v-icon>mdi-play</v-icon>
    </v-btn>

    <v-btn
      @click="pause()"
      v-show="playbackState === 'playing'"
      color="primary"
      :fab="fab"
      :rounded="rounded"
      large>
      <v-icon>mdi-pause</v-icon>
    </v-btn>

    <v-btn
      @click.stop="playNext"
      :fab="fab"
      :rounded="rounded"
      large>
      <v-icon>mdi-skip-next</v-icon>
    </v-btn>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PlayerControls',
  props: [ 'fab', 'rounded' ],
  computed: mapState('music', [
    'currentSong',
    'videoMode',
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
.player-card-actions {
  .fab {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  &:not(.fab) button:last-child {
    margin-left: 1rem;
  }
  .v-application--is-ltr .v-card__actions .player-card-actions .v-btn--fab + .v-btn--fab {
    margin-left: 0px;
  }
}
</style>
