<template>
  <v-container class="menu-container d-flex flex-column flex-grow-1 pa-0">
    <v-col class="pa-0">
      <v-list dense>
        <v-list-item class="d-flex d-sm-none">
          <v-list-item-content>
            <v-list-item-title class="title pa-2 ma-2">
              Hippy Mood
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="d-flex d-sm-none" />

        <v-list-item
          to="/"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-play-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Lecteur</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          class="d-flex d-sm-none"
          to="/search"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Recherche</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/whatsnew"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-new-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Quoi de neuf ?</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="toggleVideoMode">
          <v-list-item-action class="mr-0">
            <v-switch
              v-model="videoMode"
              class="mr-4"
              color="secondary"
              readonly
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Mode vidéo</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/download"
          link
          class="d-none"
        >
          <v-list-item-action>
            <v-icon>mdi-download</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Télécharger</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin"
          link
          class="d-none"
        >
          <v-list-item-action>
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Administration</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/about"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>À propos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <v-spacer />

    <v-col class="pa-0 flex-grow-0">
      <v-list class="pa-0">
        <v-divider />

        <v-list-item class="pa-0">
          <v-spacer />
          <v-btn
            class="ma-2"
            text
            icon
            @click="toggleDarkMode()"
          >
            <v-icon v-show="!darkMode">
              mdi-brightness-7
            </v-icon>
            <v-icon v-show="darkMode">
              mdi-brightness-4
            </v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-col>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Menu',
  computed: {
    ...mapState('music', [ 'videoMode' ]),
    ...mapState([ 'darkMode' ]),
  },
  methods: {
    ...mapActions('music', [ 'toggleVideoMode' ]),
    ...mapActions([ 'toggleDarkMode' ]),
  }
};
</script>

<style>
.menu-container {
  height: 100%;
}
</style>
