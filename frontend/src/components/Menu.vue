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

        <v-divider class="d-flex d-sm-none"></v-divider>

        <v-list-item link to="/">
          <v-list-item-action>
            <v-icon>mdi-play-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Player</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/whatsnew">
          <v-list-item-action>
            <v-icon>mdi-new-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Whats new</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="toggleVideoMode">
          <v-list-item-action>
            <v-switch v-model="videoMode" color="secondary" readonly class="ma-2"></v-switch>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Video mode</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/download">
          <v-list-item-action>
            <v-icon>mdi-download</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/admin" class="d-none">
          <v-list-item-action>
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Administration</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/about">
          <v-list-item-action>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>À propos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <v-spacer></v-spacer>

    <v-col class="pa-0 flex-grow-0">
      <v-list class="pa-0">
        <v-divider></v-divider>

        <v-list-item class="pa-0">
          <v-spacer></v-spacer>
          <v-btn
            @click="darkModeToggle()"
            class="ma-2"
            text icon>
            <v-icon v-show="!darkMode">mdi-brightness-7</v-icon>
            <v-icon v-show="darkMode">mdi-brightness-4</v-icon>
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
  data: () => ({
    darkMode: false,
  }),
  computed: mapState('music', [ 'videoMode' ]),
  methods: {
    ...mapActions('music', [ 'toggleVideoMode' ]),
    darkModeToggle() {
      this.darkMode = !this.darkMode
      this.$vuetify.theme.dark = this.darkMode
    }
  }
};
</script>

<style>
.menu-container {
  height: 100%;
}
</style>
