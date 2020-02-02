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
        <h1 class="text-center"> Hippy Mood </h1>

        <v-row justify="space-between" align="center" class="px-6">
          <v-breadcrumbs
            class="breadcrumb mx-md-0"
            v-show="$route.path !== '/'"
            :items="breadcrumbItems"
            large></v-breadcrumbs>

          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                class="breadcrumb-menu ma-2"
                v-show="$route.path !== '/'"
                icon text large>
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <Menu />
          </v-menu>
        </v-row>

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
    font-family: 'Grenadier-NF';
    font-size: 4.5rem;
    font-weight: 400;
    line-height: 1.4em;

    @media screen and (min-width: 600px) {
      font-size: 7rem;
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
      margin-bottom: 5rem;

      @media screen and (min-width: 600px) {
        margin-bottom: 2rem;
      }
    }
  }
  .breadcrumb-menu {
    float: right;
    display: none;

    @media screen and (min-width: 600px) {
      display: inline;
    }
  }
}

@font-face {
    font-family: 'Grenadier-NF';
    src:url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.woff2') format('woff2'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.woff') format('woff'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.svg#Grenadier-NF') format('svg'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.eot'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.eot?#iefix') format('embedded-opentype');
    font-style: normal;
}
</style>
