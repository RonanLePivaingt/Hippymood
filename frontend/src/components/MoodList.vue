<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="8" align="center">
        <v-btn
          v-for="mood in moods"
          :key="mood.id"
          @click="changeMood(mood)"
          class="mood-btn">
          {{ mood.name }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'MoodList',
  computed: mapState('music', [ 'moods' ]),
  methods: mapActions('music', [ 'changeMood' ])
};
</script>

<style>
.mood-btn {
  margin: 0.5rem;
}
</style>
