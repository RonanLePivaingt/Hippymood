<template>
  <div
    v-if="!currentSong.song"
    class="intro px-4"
  >
    <p class="text-left">
      Un site pour écouter de la musique selon ta "mood"
    </p>

    <p class="text-left">
      C'est comme une boite de chocolat, tant que t'as pas essayé tu ne sais pas! Des fois tu reviens, des fois pas...
    </p>

    <div class="actions d-flex justify-center align-center mb-3">
      <v-switch
        :input-value="videoMode"
        color="secondary"
        label="Mode video"
        @change="toggleVideoMode"
      />

      <v-btn
        to="/search"
        class="mx-4"
        fab
        small
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn
        class="mr-4"
        fab
        small
        @click="toggleDarkMode()"
      >
        <v-icon v-show="!darkMode">
          mdi-brightness-7
        </v-icon>
        <v-icon v-show="darkMode">
          mdi-brightness-4
        </v-icon>
      </v-btn>

      <v-btn
        class="new"
        to="/whatsnew"
      >
        <v-icon left>
          mdi-new-box
        </v-icon>
        Quoi de neuf ?
      </v-btn>
    </div>

    <v-divider />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Intro',
  computed: {
    ...mapState('music', [
      'currentSong',
      'videoMode',
    ]),
    ...mapState(['darkMode']),
  },
  methods: {
    ...mapActions('music', [
      'playNext',
      'toggleVideoMode',
    ]),
    ...mapActions([ 'toggleDarkMode' ]),
  }
};
</script>

<style lang="scss">
.intro {
  p {
    font-size: 1.3rem;

    @media screen and (min-width: 1000px) {
      font-size: 1.4rem;
    }
  }

  .actions {
    flex-wrap: wrap;

    .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
      margin-bottom: 6px;
    }
    .theme--light.v-label {
      color: rgba(0, 0, 0, 0.87);
    }
    .v-btn > .v-btn__content .v-icon.theme--light {
      color: rgba(0, 0, 0, 0.54);
    }
  }

  .v-divider {
    width: 40%;
  }
}
</style>
