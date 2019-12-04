<template>
  <div v-if="!currentSong.song" class="intro pa-4">
    <h1 class="display-3 ma-6"> Hippy Mood </h1>

    <p class="text-left">
       Un site pour écouter de la musique selon ta "mood"
    </p>

    <p class="text-left">
      C'est comme une boite de chocolat, tant que t'as pas essayé tu ne sais pas! Des fois tu reviens, des fois pas...
    </p>

    <div class="actions d-flex justify-center align-center">
      <v-switch
        :input-value="videoMode"
        @change="toggleVideoMode"
        label="Mode video"
        ></v-switch>

      <v-btn
        to="/search"
        class="ma-4"
        fab small>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn class="new" to="/whatsnew">
        <v-icon>mdi-new-box</v-icon>
        Quoi de neuf ?
      </v-btn>
    </div>

    <v-divider></v-divider>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Intro',
  computed: mapState('music', [
    'currentSong',
    'videoMode',
  ]),
  methods: mapActions('music', [
    'playNext',
    'toggleVideoMode',
  ]),
};
</script>

<style lang="scss">
.intro {
  h1.display-3 {
    font-weight: 400;
  }
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
    margin-top: 0.5rem;
  }
}
</style>
