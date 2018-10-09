<template>
  <div id="app">
    <div class="page-container">
      <md-app>
        <md-app-toolbar class="md-medium md-transparent" md-elevation="0">
          <div class="invisible">
            <md-button class="md-icon-button md-xsmall-hide" @click="showNavigation = true">
              <md-icon>menu</md-icon>
            </md-button>
          </div>

          <span class="md-title md-display-3">Hippy Mood</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-xsmall-hide" @click="showNavigation = true">
              <md-icon>menu</md-icon>
            </md-button>
          </div>
        </md-app-toolbar>

        <md-app-drawer class="md-right" :md-active.sync="showNavigation">
          <md-toolbar class="md-transparent" md-elevation="1">
            Menu
          </md-toolbar>

          <md-list>
            <md-list-item to="/" @click="toggleVideoMode">
              <md-switch v-model="videoMode" @click="toggleVideoMode"></md-switch>
              <span class="md-list-item-text">Mode vidéo</span>
            </md-list-item>

            <md-list-item to="/search">
              <md-icon>search</md-icon>
              <span class="md-list-item-text">Rechercher</span>
            </md-list-item>

            <md-list-item to="/download">
              <md-icon>file_download</md-icon>
              <span class="md-list-item-text">Télécharger</span>
            </md-list-item>

            <md-list-item to="/whatsNew">
              <md-icon>fiber_new</md-icon>
              <span class="md-list-item-text">Quoi de neuf ?</span>
            </md-list-item>

            <md-list-item to="/Suggestions">
              <md-icon>wb_incandescent</md-icon>
              <span class="md-list-item-text">Suggestions</span>
            </md-list-item>

            <md-list-item to="/admin">
              <md-icon>build</md-icon>
              <span class="md-list-item-text">Administration</span>
            </md-list-item>

            <md-list-item to="/about">
              <md-icon>info_outline</md-icon>
              <span class="md-list-item-text">À propos</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>

        <md-app-content>
          <router-view></router-view>
          <audio-player v-if="!videoMode"></audio-player>
          <video-player v-if="videoMode" :class="videoClass"></video-player>

          <mood-list v-if="windowWidth > 600"></mood-list>
        </md-app-content>
      </md-app>

      <div class="smartphone-navigation phone-viewport">
        <md-bottom-bar md-sync-route>
          <md-bottom-bar-item to="/" md-label="Player" md-icon="play_arrow"></md-bottom-bar-item>
          <md-bottom-bar-item to="/Moods" md-label="Moods" md-icon="album"></md-bottom-bar-item>
          <md-bottom-bar-item md-label="Menu" md-icon="menu" @click="showNavigation = !showNavigation"></md-bottom-bar-item>
        </md-bottom-bar>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from './components/AudioPlayer'
import VideoPlayer from './components/VideoPlayer'
import MoodList from './components/MoodList'

export default {
  name: 'app',
  components: {
    MoodList,
    AudioPlayer,
    VideoPlayer
  },
  data: () => ({
    showNavigation: false,
    windowWidth: 0,
    videoClass: ''
  }),
  computed: {
    moods: function () { return this.$store.state.moods },
    current: function () { return this.$store.state.current },
    videoMode: function () { return this.$store.state.videoMode }
  },
  watch: {
    // call again the method if the route changes
    '$route': 'setVideoClass'
  },
  methods: {
    getWindowWidth (event) {
      this.windowWidth = window.innerWidth
    },
    toggleVideoMode (event) {
      this.$store.commit('toggleVideoMode')
      if (this.videoMode === true) {
        this.$material.theming.theme = 'default-dark'
      } else {
        this.$material.theming.theme = 'default-variant'
      }
    },
    setVideoClass () {
      // Video mode
      if (this.$route.path === '/') {
        this.videoClass = ''
      } else {
        this.videoClass = 'sticky'
      }

      // Extra : closing menu after route change
      this.showNavigation = false
    }
  },
  mounted: function () {
    this.$material.theming.theme = 'default-variant'
    // Getting inital size + checking changes
    this.getWindowWidth()
    window.addEventListener('resize', this.getWindowWidth)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("default-variant", (
  primary: md-get-palette-color(blue, 500), // The primary color of your application
  accent: md-get-palette-color(amber, 400) // The accent or secondary color
));

@include md-register-theme("default-dark", (
  primary: md-get-palette-color(indigo, A200), // The primary color of your application
  accent: md-get-palette-color(amber, 400), // The accent or secondary color
  theme: dark
));

@import "~vue-material/dist/theme/all"; // Apply the theme

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
// Header
.invisible {
  visibility: hidden;
}
.md-toolbar .md-title {
  display: flex;
  flex:1;
  justify-content: center;
}
.md-toolbar .md-toolbar-section-end {
  flex: 0;
}

.md-app {
  flex:3;
}
.mood-list {
  margin: 0 auto;
  text-align: center;
}
@media screen and (min-width: 600px) {
  // Hiding the bottom navigation menu on big screens
  .smartphone-navigation {
    display: none;
  }
  .mood-list {
    width: 40rem;
  }
  .smartphone-navigation {
    bottom: 0px;
  }
}
</style>
