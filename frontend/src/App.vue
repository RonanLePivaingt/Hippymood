<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app clipped>
      <Menu />
    </v-navigation-drawer>

    <v-app-bar
      color="primary"
      :value="Object.keys(currentSong).length !== 0"
      app clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title href="/">
        <router-link to="/" class="toolbar-title">
          Hippy Mood
        </router-link>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-col
        class="main-content pa-0"
        cols="12"
        md="7"
        align-self="center"
        >
        <router-view></router-view>

        <AudioPlayer/>
      </v-col>

    </v-content>

    <Footer/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Menu from './components/Menu';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    AudioPlayer,
    Footer,
    Menu,
  },
  created () {
    this.$store.dispatch('music/getMoods')
    // this.$vuetify.theme.dark = true
  },
  data: () => ({
    drawer: false,
  }),
  computed: mapState('music', [ 'currentSong' ]),
};
</script>

<style>
.v-application a.toolbar-title {
  color: #fff;
  text-decoration: inherit;
}

.main-content {
  margin: 0 auto;
}
</style>
