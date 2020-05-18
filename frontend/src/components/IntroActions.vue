<template>
  <div class="actions d-flex justify-center align-center mb-3">
    <v-switch
      class="mr-2"
      :input-value="videoMode"
      color="secondary"
      :label="$t('menu.VideoMode')"
      @change="toggleVideoMode"
    />

    <v-btn
      to="/search"
      class="ma-2"
      fab
      small
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-btn
      class="ma-2"
      fab
      small
      @click="setDarkMode(!darkMode)"
    >
      <v-icon v-show="!darkMode">
        mdi-brightness-7
      </v-icon>
      <v-icon v-show="darkMode">
        mdi-brightness-4
      </v-icon>
    </v-btn>

    <LangMenu fab />

    <v-btn
      class="new ml-2"
      to="/whatsnew"
    >
      <v-icon left>
        mdi-new-box
      </v-icon>
      {{ $t('menu.WhatsNew') }}
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
const LangMenu = () => import('./LangMenu')

export default {
  name: 'IntroActions',
  components: {
    LangMenu,
  },
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
    ...mapActions([ 'setDarkMode' ]),
  }
};
</script>

<style lang="scss">
.intro {
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
}
</style>
