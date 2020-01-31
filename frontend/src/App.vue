<template>
  <v-app class="app">
    <v-navigation-drawer
      v-model="drawer"
      disable-resize-watcher app>
      <Menu />
    </v-navigation-drawer>

    <v-content :class="currentSong.id ? 'footer-visible' : ''">
      <v-col
        class="main-content pa-0"
        cols="12"
        md="7"
        align-self="center"
        >
        <h1 class="ma-4 text-center"> Hippy Mood </h1>

        <v-breadcrumbs
          class="breadcrumb mx-3 mx-md-0"
          v-show="$route.path !== '/'"
          :items="breadcrumbItems"
          large></v-breadcrumbs>

        <router-view></router-view>

        <AudioPlayer/>
      </v-col>
    </v-content>

    <Footer v-on:show-menu="drawer = true" />
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
  computed: {
    ...mapState('music', [ 'currentSong' ]),
    breadcrumbItems () {
      return [
        {
          text: 'Hippy Mood',
          disabled: false,
          to: '/',
        },
        {
          text: this.$route.name,
          disabled: false,
        },
      ]
    },
  },
};
</script>

<style lang="scss">
.app {
  h1 {
    font-family: 'Monoton', cursive !important;
    font-size: 3rem;
    font-weight: 400;

    @media screen and (min-width: 600px) {
      font-size: 4rem;
    }
    @media screen and (min-width: 1000px) {
      font-size: 5rem;
    }
  }
  .breadcrumb {
    padding-left: 0;
  }
  .main-content {
    margin: 0 auto;
  }
  main {
    margin-bottom: 2rem;

    &.footer-visible {
      margin-bottom: 6rem;
    }
  }
}
</style>
