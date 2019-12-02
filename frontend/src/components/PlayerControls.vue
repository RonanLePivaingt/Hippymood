<template>
  <div class="d-none d-sm-flex player-card-actions">
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
  </div>
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

