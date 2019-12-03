<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app clipped>
      <Menu />
    </v-navigation-drawer>

    <v-app-bar
      color="primary"
      app clipped-left dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title href="/">
        <router-link to="/" class="toolbar-title">
          Hippy Mood
        </router-link>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <div class="d-flex pa-0">
        <router-view></router-view>

        <AudioPlayer/>
      </div>

    </v-content>

    <Footer/>
  </v-app>
</template>

<script>
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
  },
  data: () => ({
    drawer: false,
  }),
};
</script>

<style>
.v-application a.toolbar-title {
  color: #fff;
  text-decoration: inherit;
}
</style>
