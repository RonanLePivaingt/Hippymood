<template>
  <v-snackbar
    v-model="demoMessage"
    class="demo-snackbar"
    :class="currentSong.album ? 'three-line-footer' : ''"
    :timeout="10000000"
    vertical
  >
    En mode démo, seule la lecture vidéo est activée.

    <v-row
      class="px-1"
      justify="space-between"
    >
      <v-btn
        class="mt-2"
        small
        text
        @click="toggleVideoMode"
      >
        Activer le mode video
      </v-btn>
      <v-btn
        class="mr-1 mt-2"
        text
        small
        @click="demoMessage = false"
      >
        Fermer
      </v-btn>
    </v-row>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'DemoSnackbar',
  data: () => ({
    demoMessage: false,
  }),
  computed: mapState('music', [ 'currentSong' ]),
  mounted () {
    this.demoMessage = true
  },
  methods: mapActions('music', [ 'toggleVideoMode' ]),
}
</script>

<style lang="scss">
/* Adjust snackbar bottom margin depending on footer size */
.demo-snackbar {
  margin-bottom: 4rem;

  &.three-line-footer {
    margin-bottom: 5rem;

    @media screen and (min-width: 600px) {
      margin-bottom: 0;
    }
  }

  @media screen and (min-width: 600px) {
    margin-bottom: 0;
  }
}
</style>
