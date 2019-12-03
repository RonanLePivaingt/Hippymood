<template>
  <v-col
    align="center"
    sm="8"
    cols="12"
    class="pa-0"
    >
    <v-btn
      v-for="mood in moods"
      :key="mood.id"
      @click="changeMood(mood)"
      class="mood-btn"
      :color="mood.id === currentMood.id ? 'primary' : ''"
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
.mood-btn {
  margin-bottom: 0.5rem;
}
</style>
