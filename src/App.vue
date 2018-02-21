<template>
  <transition name="leave-intro" appear>
    <div
      id="app"
      v-bind:class="{video: videoMode}"
      v-show="leaveIntro"
      >

      <vue-progress-bar></vue-progress-bar>

      <div id="mask"></div>

      <h1> Hippy Mood </h1>

      <div v-if="unlocked === -1">
        <p>Loading</p>
      </div>

      <div class="intro" v-show="intro && unlocked > 0 && currentRouterComponent !== 'Admin'">
        <p> Un site pour écouter de la musique selon ta "mood" </p>
        <p>
          C'est comme une boite de chocolat, tant que t'as pas essayé tu ne sais pas!
          Des fois tu reviens, des fois pas...
        </p>
        <div class="actions">
          <md-switch
              v-model="videoMode"
              v-on:change="toggleVideoMode"
              class="md-primary video-switch"
              >Mode vidéo</md-switch>

            <md-button href="#/search" class="md-icon-button md-raised">
              <md-icon>search</md-icon>
            </md-button>

            <md-button
              id="intro-whats-new"
              class="md-button md-raised"
              href="#/whatsNew"
              >
              <md-icon>fiber_new</md-icon> Quoi de neuf ?
            </md-button>
        </div>

        <div class="actions">
            <md-button
              class="md-button md-raised"
              href="#/Suggestions"
              >
              <md-icon class="idea-icon">wb_incandescent</md-icon> Faire une suggestion
            </md-button>
        </div>
      </div>

      <div id="main-container">
        <chips-lock
          v-if="unlocked === 0"
          ref="chipslock"
          ></chips-lock>

        <transition name="fastfade" mode="out-in">
          <router-view v-if="unlocked === 1" :key="$route.fullPath"></router-view>
        </transition>

        <html5-player
                     v-if="videoMode === false || hasYoutubeLink === false"
                     :current="current"
                     ></html5-player>

        <video-player
                     v-if="!intro && videoMode"
          ></video-player>
      </div>

      <div class="mood-list">
        <mood-list  v-for="mood in moods" :mood="mood" :key="mood.id"></mood-list>
      </div>

      <md-snackbar md-position="bottom center" ref="snackbar" md-duration="10000">
        <span>Les vidéos sont en test avec le bouton à gauche de la recherche. Enjoy ;)</span>
        <md-button class="md-accent" @click="$refs.snackbar.close()">Fermer</md-button>
      </md-snackbar>
    </div>
  </transition>
</template>

<script>
  import Keypress from './js/keypress-2.1.4.min.js'
  var listener = new Keypress.Listener()
  var myCombos
  import ChipsLock from './components/ChipsLock'
  import MoodList from './components/MoodList'
  import Html5Player from './components/HTML5Player'
  import VideoPlayer from './components/VideoPlayer'
  function removeFirstIntro () {
    var firstIntro = document.getElementById('first-intro')
    document.body.removeChild(firstIntro)
  }
  export default {
    name: 'app',
    components: {
      ChipsLock,
      MoodList,
      Html5Player,
      VideoPlayer
    },
    data () {
      return {
        leaveIntro: false
      }
    },
    computed: {
      current: function () {
        return this.$store.state.current
      },
      moods: function () {
        return this.$store.state.moods
      },
      unlocked: function () {
        return this.$store.state.unlocked
      },
      videoMode: function () {
        return this.$store.state.videoMode
      },
      intro: function () {
        return this.$store.state.intro
      },
      betaMode: function () {
        return this.$store.state.betaMode
      },
      hasYoutubeLink: function () {
        if (this.$store.state.current.youtube) {
          return true
        } else {
          return false
        }
      },
      currentRouterComponent: function () {
        return this.$root.$route.name
      }
    },
    methods: {
      toggleVideoMode () {
        this.$store.commit('toggleVideoMode')
      }
    },
    mounted: function keyboardShortcuts () {
      // Removing intro before Vue loading
      window.setTimeout(removeFirstIntro, 500)

      var myScope = document
      myCombos = listener.register_many([
        {
          'keys': 'meta space',
          'on_keydown': function () {
            window.vm.extTogglePlayPause()
          },
          'this': myScope,
          'prevent_default': true
        },
        {
          'keys': 'meta left',
          'on_keydown': function () {
            window.vm.extPlayPreviousSong()
          },
          'this': myScope
        },
        {
          'keys': 'meta right',
          'on_keydown': function () {
            window.vm.extPlayNextSong()
          },
          'this': myScope
        },
        {
          'keys': 'meta s',
          'on_keydown': function () {
            window.vm.extDisplayDownload()
          },
          'this': myScope
        },
        {
          'keys': 'meta f',
          'on_keydown': function () {
            window.vm.extDisplaySearch()
          },
          'this': myScope
        },
        {
          'keys': 'meta i',
          'on_keydown': function () {
            window.vm.extDisplayAbout()
          },
          'this': myScope
        },
        {
          'keys': 'meta h',
          'on_keydown': function () {
            window.vm.extDisplayPlayer()
          },
          'this': myScope
        },
        {
          'keys': 'meta b',
          'on_keydown': function () {
            window.vm.extActivateBetaFeatures()
          },
          'this': myScope
        },
        {
          'keys': 'meta v',
          'on_keydown': function () {
            window.vm.extToggleVideoMode()
          },
          'this': myScope
        }
      ])
    },
    updated: function () {
      // Not placed in mounted hook, otherwise its
      this.leaveIntro = true
    },
    destroyed: function () {
      // Removing listeners when the component is removed
      listener.unregister_many(myCombos)
    }
  }
</script>

<style src="../node_modules/vue-material/dist/vue-material.css"></style>
<style>
/* Disabling icon selection */
i.material-icons {
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;          /* Likely future */
}
i.bright-background {
  text-shadow: 1px 0.1px 1px rgba(12,12,12,0.3);
}
.deep-background p, .deep-background i {
  text-shadow: 1px 0.1px 1px rgba(12,12,12,0.3);
}
#app:not(.video) #main-container {
  width: 30rem;
}
#app.video #main-container {
  width: 640px;
}
#main-container {
  margin: 0 auto;
}
.video #mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: -1;
}
#app {
  max-width: 50rem;
  margin: 0 auto;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  margin-bottom: 2rem;
}
#app > h1 {
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  margin: 0;
  padding: 4rem;
}
#app.video #playerCard, #app.video #video-controls {
  box-shadow: none;
}
#app.video .actions a.md-raised {
  color: rgba(0, 0, 0, 0.87);
  background-color: rgba(255,255,255,0.8);
}
#app.video #main-container {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
}
#app.video a.md-accent {
  background-color: rgba(233, 30, 99, 0.6);
}
@font-face {
  font-family: 'Roboto';
  src: url('./fonts/Roboto-Regular.ttf') format('woff');
}
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url('./fonts/MaterialIcons-Regular.ttf') format('woff');
}
i.material-icons{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
.intro .actions {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.video-switch {
  font-size: 1rem;
}
.mood-list {
  margin-top: 1rem;
}
#app.video .mood-list a.md-raised:not([disabled]) {
  color: rgba(0, 0, 0, 0.87);
  background-color: rgba(255, 255, 255, 0.8);
}
#app.video .mood-list a.md-raised:not([disabled]):hover {
  color: rgba(255, 255,255, 0.87);
  background-color: rgba(63, 81, 181, 0.4);
}
#app.video h1 {
  color: rgba(255, 255, 255, 0.9);
}
/*
 * Transition animations
 */
/* Leave intro */
#first-intro {
  opacity: 0;
  transform: translateY(-100%);
  transition: all .5s;
}
.leave-intro-enter-active, .leave-intro-leave-active {
  transition: all .5s;
}
.leave-intro-enter, .leave-intro-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(+20%);
}
/* Fade */
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
.fastfade-enter-active, .fastfade-leave-active {
  transition: opacity .25s
}
.fastfade-enter, .fastfade-leave-to /* .fastfade-leave-active below version 2.1.8 */ {
  opacity: 0
}
</style>
