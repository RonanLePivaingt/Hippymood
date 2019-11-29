<template>
  <v-container>
    <v-row justify="center">
      <v-card
        v-if="currentSong.song"
        max-width="30rem"
        >
        <v-card-text>
          <p class="display-1 text--primary">
            <v-icon>mdi-music-note</v-icon>
            {{ currentSong.song }}
          </p>
        </v-card-text>

        <v-card-text>
          <p v-show="currentSong.album">
            <v-icon>mdi-album</v-icon>
            {{ currentSong.album }}
          </p>

          <div class="text--primary">
            <v-icon>mdi-account</v-icon>
            {{ currentSong.artist}}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn text>Play</v-btn>
          <v-btn text>Pause</v-btn>
          <v-btn @click.stop="playNext" text>Next</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PlayerCard',
  computed: mapState('music', [ 'currentSong' ]),
  methods: mapActions('music', [ 'playNext' ]),
};
</script>

<style>
.mood-btn {
  margin: 0.5rem;
}
</style>
