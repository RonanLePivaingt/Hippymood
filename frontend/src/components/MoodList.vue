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
      class="mood-btn"
      :color="mood.id === currentMood.id ? 'secondary' : ''"
      @click="changeMood(mood)"
    >
      {{ mood.name }}
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
  ]),
  methods: mapActions('music', [ 'changeMood' ])
};
</script>

<style>
.mood-list {
  .mood-btn {
    margin-bottom: 0.5rem;
  }
}
</style>
