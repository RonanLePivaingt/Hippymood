<template>
  <v-col
    class="mood-list pa-0 pt-4"
    align="center"
    sm="10"
    cols="12"
  >
    <v-btn
      v-for="mood in moods"
      :key="mood.id"
      class="mood-btn ma-2"
      :color="mood.id === currentMood.id ? 'secondary' : ''"
      :disabled="videoMode && mood.nbVideo === '0' ? true : false"
      @click="playNextMood(mood)"
    >
      {{ mood.name }}
      <v-icon
        v-if="nextType === 'mood' && next.id === mood.id"
        right
      >
        mdi-update
      </v-icon>
    </v-btn>
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MoodList',
  computed: mapState('music', [
      'moods',
      'currentMood',
      'videoMode',
      'next',
      'nextType',
  ]),
  methods: mapActions('music', [
    'playNextMood',
  ]),
};
</script>

<style lang="scss">
.mood-list {
  .mood-btn {
    > .v-btn__content .v-icon.theme--light {
      color: rgba(0, 0, 0, 0.54) !important;
    }
  }
}
</style>
