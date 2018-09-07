<template>
  <transition name="leave-intro" appear>
    <div
      id="app"
      ref="app"
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

        <div v-if="unlocked == 1 && intro == 1" v-intro="intro1" v-intro-step="2" v-intro-position="'right'">
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
      </div>

      <div id="main-container">
        <chips-lock
          v-if="unlocked === 0"
          ref="chipslock"
          :introJsOptions="introJsOptions"
          ></chips-lock>

        <transition name="fastfade" mode="out-in">
          <router-view v-if="unlocked === 1" :key="$route.fullPath"></router-view>
        </transition>

        <html5-player
                     v-if="(videoMode === false || hasYoutubeLink === false) && demoMode === 0"
                     :current="current"
                     ></html5-player>

        <video-player
                     v-if="!intro && videoMode"
          ></video-player>
      </div>

      <div v-if="unlocked == 1" v-intro="intro2" v-intro-step="3" v-intro-position="'right'" class="mood-list">
        <v-popover
           trigger="manual"
           :open="!intro && !videoMode && demoMode === 1"
           offset="350"
           :auto-hide="false"
           placement="right"
           delay="1000"
           >
           <div id="no-sound-tooltip"></div>
           <template slot="popover">
             <div class="tooltip-volume">
               <md-icon>volume_off</md-icon>
               <p> La lecture directe de musique est désactivée pour des raisons légales.</p>
               <p>
                 Clique sur <a @click="toggleVideoMode">activer le mode vidéo</a> pour écouter de la musique avec la démo.
               </p>
             </div>
           </template>
        </v-popover>

        <mood-list  v-for="mood in moods" :mood="mood" :key="mood.id"></mood-list>
      </div>

      <md-snackbar md-position="bottom center" ref="snackbar" md-duration="10000">
        <span>Les vidéos sont en test avec le bouton à gauche de la recherche. Enjoy ;)</span>
        <md-button class="md-accent" @click="$refs.snackbar.close()">Fermer</md-button>
      </md-snackbar>

      <a v-if="demoMode" href="https://github.com/3615Yeye/Hippymood/" target="_blank" class="github-corner" aria-label="Voir le code sur Github" title="Voir le code sur Github"><svg width="140" height="140" viewBox="0 0 250 250" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
    </div>
  </transition>
</template>

<script>
  import Keypress from './js/keypress-2.1.4.min.js'
  window.listener = new Keypress.Listener()
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
    props: ['introJsOptions'],
    data () {
      return {
        leaveIntro: false,
        intro1: '<p>Voici les fonctionnalités principales autour de la lecture de musique.</p> <p>Tu peux activer dès maintenant le mode vidéo puisque le streaming de mp3 est désactivé dans la démo pour des raisons légales.</p>',
        intro2: "<p>Clique sur une mood pour l'écouter.</p> <p> Lorsque tu voudras écouter une autre mood : <ul><li> clique une première fois dessus pour faire la transition à la fin de la chanson en cours</li> <li>clique une seconde fois dessus si tu souhaites l'écouter directement.</li></ul></p>"
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
      demoMode: function () {
        return this.$store.state.demoMode
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
      },
      setTogglePlayPauseKeyboardShortcut () {
        window.listener.register_many([
          {
            'keys': 'meta space',
            'on_keydown': function () {
              window.vm.extTogglePlayPause()
            },
            'this': document,
            'prevent_default': true
          }
        ])
      },
      removeTogglePlayPauseKeyboardShortcut () {
        window.listener.unregister_combo('meta space')
      }
    },
    mounted: function keyboardShortcuts () {
      // Removing intro before Vue loading
      // start the guide
      // window.setTimeout(this.$intro().start(), 500)
      window.setTimeout(removeFirstIntro, 500)

      var myScope = document
      myCombos = window.listener.register_many([
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
        }
      ])
    },
    updated: function () {
      // Not placed in mounted hook, otherwise its
      this.leaveIntro = true
    },
    destroyed: function () {
      // Removing listeners when the component is removed
      window.listener.unregister_many(myCombos)
    },
    watch: {
      '$route' (to, from) {
        // Set because of troubles with the ctrl+space keyboard shortcut between the player and search input (doesn't take spaces anymore)
        if (to.name === 'Search') {
          this.removeTogglePlayPauseKeyboardShortcut()
        } else if (from.name === 'Search') {
          this.setTogglePlayPauseKeyboardShortcut()
        }
      }
    }
  }
</script>

<style src="../node_modules/vue-material/dist/vue-material.css"></style>
<style>
div.back {
  text-align: left;
}
div.back i.material-icons {
  color: rgba(255, 255, 255, 0.8);
}
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
} .fastfade-enter, .fastfade-leave-to /* .fastfade-leave-active below version 2.1.8 */ {
  opacity: 0
}
.tooltip .popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip .popover .popover-arrow {
  background: #f9f9f9;
}
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, .1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .30s, visibility .30s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .30s;
}
.tooltip a {
  font-weight: bold;
}
div.v-popover  {
  height: 1px;
}
.tooltip-volume {
  color: rgba(0, 0, 0, 0.7);
}
.tooltip-volume {
  width: 20rem;
}
.tooltip-volume a {
  cursor: pointer;
}
.tooltip-volume i.md-icon {
  font-size: 4rem;
  width: 100%;
  margin: 0.5rem;
}
/* Light icons */
#whats-new .more .material-icons {
  color: rgba(255, 255, 255, 0.8);
}

/* Side effect of vuematerial with introjs */
.introjs-tooltip a {
  color:#fff !important;
}
.introjs-bullets ul:not(.md-list) > li + li {
  margin-top: 0px;
}

/* Octocat corner style */
.github-corner {
  fill:#151513;
  color:#fff !important;
  position: absolute;
  top: 0;
  border: 0;
  right: 0;
  animation: fadein 1s;
}
.github-corner:hover .octo-arm {
  animation:octocat-wave 560ms ease-in-out
}
@keyframes octocat-wave {
  0%,
  100% {
    transform:rotate(0)
  }
  20%,
  60% {
    transform:rotate(-25deg)
  }
  40%,
  80% {
    transform:rotate(10deg)
  }
}
@media (max-width:500px) {
  .github-corner:hover .octo-arm {
    animation:none
  }
  .github-corner .octo-arm {
    animation:octocat-wave 560ms ease-in-out
  }
}
@keyframes fadein {
  0%, 60% { opacity: 0; },
  100% { opacity: 1; }
}

</style>
