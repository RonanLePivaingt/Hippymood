<template>
  <v-app class="app">
    <v-navigation-drawer
      v-model="drawer"
      disable-resize-watcher
      app
    >
      <Menu v-if="currentSong.path" />
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

        <Breadcrumb v-if="!intro" />

        <Intro v-if="intro" />

        <transition
          name="fade"
          mode="out-in"
        >
          <router-view v-if="!intro" />
        </transition>

        <MoodList v-if="intro" />

        <AudioPlayer v-if="currentSong.path" />
      </v-col>
    </v-content>

    <Footer
      v-if="!intro && currentSong.path"
      @show-menu="drawer = true"
    />

    <Octocat v-if="demoMode" />
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Intro from './components/Intro'
import MoodList from './components/MoodList'
const AudioPlayer = () => import('./components/AudioPlayer')
const Breadcrumb = () => import('./components/Breadcrumb')
const Footer = () => import('./components/Footer')
const Menu = () => import('./components/Menu')
const Octocat = () => import('./components/demo/Octocat')

export default {
  name: 'App',
  components: {
    AudioPlayer,
    Breadcrumb,
    Intro,
    Footer,
    Menu,
    MoodList,
    Octocat,
  },
  data: () => ({
    drawer: false,
    demoMode: CONFIG.global.demoMode,
  }),
  computed: {
    ...mapState('music', [ 'currentSong' ]),
    intro () {
      return this.currentSong.path ? false : true
    },
  },
  beforeCreate () {
    window.hideLoader()
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
    font-family: 'Grenadier-NF', sans-serif;
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
