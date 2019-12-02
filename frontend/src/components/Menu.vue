<template>
  <v-list dense>
    <v-list-item link to="/">
      <v-list-item-action>
        <v-icon>mdi-play-circle-outline</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Player</v-list-item-title>
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

    <v-list-item @click="darkModeToggle()">
      <v-list-item-action>
        <v-switch v-model="darkMode" readonly class="ma-2"></v-switch>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Dark mode</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item @click="toggleVideoMode">
      <v-list-item-action>
        <v-switch v-model="videoMode" readonly class="ma-2"></v-switch>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Video mode</v-list-item-title>
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

    <v-list-item link to="/admin">
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
.mood-btn {
  margin: 0.5rem;
}
</style>
