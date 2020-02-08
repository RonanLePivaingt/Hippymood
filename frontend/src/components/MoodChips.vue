<template>
  <v-card-text class="player-card-mood">
    <v-tooltip
      top
      :disabled="nbSongsLeft < 5 ? false : true"
    >
      <template v-slot:activator="{ on }">
        <v-chip v-on="on">
          {{ currentMood.name }}
          <v-avatar
            v-show="nbSongsLeft < 5"
            color="secondary"
            right
          >
            <span class="white--text caption">
              {{ nbSongsLeft }}
            </span>
          </v-avatar>
        </v-chip>
      </template>

      <span v-show="nbSongsLeft > 0">{{ nbSongsLeft }} chansons restantes</span>
      <span v-show="nbSongsLeft === 0">{{ nbSongsLeft }} chanson restante</span>
    </v-tooltip>

    <v-chip
      v-if="nextType === 'mood'"
      class="ml-2"
      close
      @click:close="resetNext()"
    >
      {{ next.name }}
    </v-chip>

    <v-chip
      v-if="nextType === 'song'"
      class="ml-2"
      close
      @click:close="resetNext()"
    >
      {{ next.song }} - {{ next.artist }}
    </v-chip>
  </v-card-text>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'MoodChips',
  computed: {
    ...mapState('music', [
      'currentSong',
      'currentMood',
      'nextType',
      'next',
      'playbackState',
    ]),
    ...mapGetters('music', [
      'nbSongsLeft',
    ]),
  },
  methods: mapActions('music', [
    'resetNext',
  ]),
};
</script>

<style>
.player-card-mood {
  text-align: center;
}
</style>
