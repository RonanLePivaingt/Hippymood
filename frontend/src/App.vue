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

        <Breadcrumb />

        <transition name="fade" mode="out-in">
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
import { mapState, mapActions } from 'vuex'
import AudioPlayer from './components/AudioPlayer';
import Breadcrumb from './components/Breadcrumb';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Octocat from './components/demo/Octocat';

export default {
  name: 'App',
  components: {
    AudioPlayer,
    Breadcrumb,
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
  },
  created () {
    this.getMoods()

    const lang = localStorage.lang
    if (lang) {
      this.$root.$i18n.locale = lang
      this.setLang(lang)
    }
    const darkMode = localStorage.darkMode
    if (darkMode === 'true') {
      this.setDarkMode(true)
    }
  },
  methods: {
    ...mapActions('music', ['getMoods']),
    ...mapActions([
      'setLang',
      'setDarkMode',
    ])
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
.fade-enter, .fade-leave-active {
  opacity: 0;
}
</style>
