<template>
  <v-col class="whats-new">
    <h2> What's New </h2>

    <v-list-item
      v-for="song in whatsNew"
      :key="song.id"
      @click="play(song)"
      class="pa-0"
      three-line>
      <v-list-item-content class="flex-nowrap">
        <v-col class="metadata flex-wrap">
          <v-list-item-title>
            <v-icon>mdi-music-note</v-icon>
            {{ song.song }}
          </v-list-item-title>
          <v-list-item-subtitle v-show="song.album">
            <v-icon>mdi-album</v-icon>
            {{ song.album }}
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <v-icon>mdi-account</v-icon>
            {{ song.artist }}
          </v-list-item-subtitle>
        </v-col>
        <v-btn
          class="mood-btn"
          >
          {{ song.mood }}
        </v-btn>

      </v-list-item-content>

    </v-list-item>

    <v-col class="text-center">
      <v-btn @click="getWhatsNew" color="primary">Load moar</v-btn>
    </v-col>

  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'WhatsNew',
  computed: mapState('music', [
    'whatsNew',
  ]),
  created () {
    this.$store.dispatch('music/getWhatsNew')
  },
  methods: {
    ...mapActions('music', [
      'getWhatsNew',
      'playSong'
    ]),
    play(song) {
      this.playSong(song)
      this.$router.push('/')
    }
  },
};
</script>

<style lang="scss">
.whats-new {
  .metadata {
    overflow: hidden;

    .v-list-item__subtitle {
      display: inherit;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
