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
          <md-toolbar class="md-transparent" md-elevation="0">
            Hippymood
          </md-toolbar>

          <md-list>
            <md-list-item>
              <md-icon>move_to_inbox</md-icon>
              <span class="md-list-item-text">Inbox</span>
            </md-list-item>

            <md-list-item>
              <md-icon>send</md-icon>
              <span class="md-list-item-text">Sent Mail</span>
            </md-list-item>

            <md-list-item>
              <md-icon>delete</md-icon>
              <span class="md-list-item-text">Trash</span>
            </md-list-item>

            <md-list-item>
              <md-icon>error</md-icon>
              <span class="md-list-item-text">Spam</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>

        <md-app-content>
          <router-view></router-view>
          <audio-player></audio-player>

          <mood-list v-if="windowWidth > 600"></mood-list>
        </md-app-content>
      </md-app>

      <div class="smartphone-navigation phone-viewport">
        <md-bottom-bar md-sync-route>
          <md-bottom-bar-item to="/" md-label="Player" md-icon="play_arrow"></md-bottom-bar-item>
          <md-bottom-bar-item to="/Moods" md-label="Moods" md-icon="album"></md-bottom-bar-item>
          <md-bottom-bar-item md-label="Moar" md-icon="menu" @click="showNavigation = !showNavigation"></md-bottom-bar-item>
        </md-bottom-bar>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from './components/AudioPlayer'
import MoodList from './components/MoodList'

export default {
  name: 'app',
  components: {
    MoodList,
    AudioPlayer
  },
  data: () => ({
    showNavigation: false,
    windowWidth: 0
  }),
  computed: {
    moods: function () {
      return this.$store.state.moods
    },
    current: function () {
      return this.$store.state.current
    }
  },
  methods: {
    getWindowWidth (event) {
      this.windowWidth = window.innerWidth
    }
  },
  mounted: function () {
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

@include md-register-theme("default", (
  primary: md-get-palette-color(indigo, A200), // The primary color of your application
  accent: md-get-palette-color(brown, 500) // The accent or secondary color
));

@import "~vue-material/dist/theme/all"; // Apply the theme

.page-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}
/* Header */
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
  /* Hiding the bottom navigation menu on big screens */
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
