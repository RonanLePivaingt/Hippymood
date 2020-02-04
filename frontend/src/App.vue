<template>
  <v-app class="app">
    <v-navigation-drawer
      v-model="drawer"
      disable-resize-watcher
      app
    >
      <Menu />
    </v-navigation-drawer>

    <v-content :class="currentSong.id ? 'footer-visible' : ''">
      <v-col
        class="main-content pa-0"
        cols="12"
        md="7"
        align-self="center"
      >
        <h1 class="text-center">
          Hippy Mood
        </h1>

        <transition name="fade">
          <v-row
            v-show="$route.path !== '/'"
            class="px-6"
            justify="space-between"
            align="center"
          >
            <v-breadcrumbs
              class="breadcrumb mx-md-0"
              :items="breadcrumbItems"
              large
            />

            <v-menu
              bottom
              left
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  class="breadcrumb-menu ma-2"
                  icon
                  text
                  large
                  v-on="on"
                >
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>
              <Menu />
            </v-menu>
          </v-row>
        </transition>

        <transition name="fade">
          <router-view />
        </transition>

        <AudioPlayer />
      </v-col>
    </v-content>

    <Footer @show-menu="drawer = true" />

    <Octocat v-if="demoMode" />
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Menu from './components/Menu';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';
import Octocat from './components/demo/Octocat';

export default {
  name: 'App',
  components: {
    AudioPlayer,
    Footer,
    Menu,
    Octocat,
  },
  data: () => ({
    drawer: false,
    demoMode: CONFIG.global.demoMode,
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
  created () {
    this.$store.dispatch('music/getMoods')
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

/* Title font daclaration */
@font-face {
    font-family: 'Grenadier-NF';
    src:url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.woff2') format('woff2'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.woff') format('woff'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.svg#Grenadier-NF') format('svg'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.eot'),
        url('assets/fonts/GrenadierNF/Grenadier-NF.ttf.eot?#iefix') format('embedded-opentype');
    font-style: normal;
}

/* Fade animation */
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}
.fade-enter-active {
  transition-delay: .25s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>
