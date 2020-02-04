<template>
  <v-col class="whats-new">
    <h2> Quoi de neuf ? </h2>

    <v-list>
      <v-list-item
        v-for="song in whatsNew"
        :key="song.id"
        class="pa-0"
        :two-line="!song.album ? true : false"
        :three-line="song.album ? true : false"
        :disabled="videoMode && !song.youtube ? true : false"
        @click="play(song)"
      >
        <v-list-item-content class="pa-0">
          <v-row
            class="pr-1 ma-0"
            justify="space-between"
            align="center"
          >
            <v-col class="metadata flex-wrap pl-0">
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
              :disabled="videoMode && !song.youtube ? true : false"
            >
              <v-icon
                v-show="videoMode && song.youtube"
                left
              >
                mdi-youtube
              </v-icon>
              {{ song.mood }}
            </v-btn>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-col class="text-center">
      <v-btn
        color="secondary"
        @click="getWhatsNew"
      >
        Charger plus
      </v-btn>
    </v-col>
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'WhatsNew',
  computed: mapState('music', [
    'whatsNew',
    'videoMode',
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
  .v-list {
    background: transparent;
  }

  .metadata {
    overflow: hidden;

    .v-list-item__subtitle {
      display: inherit;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .v-btn > .v-btn__content .v-icon.theme--light {
    color: rgba(0, 0, 0, 0.54);
  }
}
</style>
