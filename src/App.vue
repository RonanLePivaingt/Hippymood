<template>
  <div 
    id="app"
    v-bind:class="{video: videoMode}"
    >

    <div id="mask"></div>

    <h1> Hippy Mood </h1>

    <div v-if="unlocked === -1">
      <p>Loading</p>
    </div>

    <div class="intro" v-show="intro && unlocked !== -1">
      <p> Un site pour écouter de la musique selon ta "mood" </p>
      <p> 
        C'est comme une boite de chocolat, tant que t'as pas essayé tu ne sais pas!
        Des fois tu reviens, des fois pas...
      </p>
      <div class="actions">
        <md-switch
            v-show="betaMode"
            v-model="videoMode"
            v-on:change="toggleVideoMode"
            class="md-primary"
            >Mode vidéo</md-switch>

          <md-button class="md-icon-button md-raised">
            <md-icon>search</md-icon>
          </md-button>
      </div>
    </div>

    <div id="main-container">
      <chipslock v-if="unlocked === 0"></chipslock>

      <router-view v-if="unlocked === 1"></router-view>

      <html5-player
                   v-if="videoMode === false"
                   :current="current"
                   ></html5-player>

      <video-player></video-player>
    </div>

    <div class="mood-list">
      <mood-list  v-for="mood in moods" :mood="mood" :key="mood.id"></mood-list>
    </div>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="10000">
      <span>Les vidéos sont en test avec le bouton à gauche de la recherche. Enjoy ;)</span>
      <md-button class="md-accent" @click="$refs.snackbar.close()">Fermer</md-button>
    </md-snackbar>
  </div>
</template>

<script>
  import Keypress from './js/keypress-2.1.4.min.js'
  var listener = new Keypress.Listener()
  var myCombos
  import ChipsLock from './components/ChipsLock'
  import MoodList from './components/MoodList'
  import Html5Player from './components/HTML5Player'
  import VideoPlayer from './components/VideoPlayer'
  export default {
    name: 'app',
    components: {
      ChipsLock,
      MoodList,
      Html5Player,
      VideoPlayer
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
      }
    },
    methods: {
      toggleVideoMode () {
        console.log('go go go')
        this.$store.commit('toggleVideoMode')
      }
    },
    mounted: function keyboardShortcuts () {
      var myScope = document
      myCombos = listener.register_many([
        {
          'keys': 'meta space',
          'on_keydown': function () {
            window.vm.extTogglePlayPause()
          },
          'this': myScope
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
    destroyed: function () {
      // Removing listeners when the component is removed
      listener.unregister_many(myCombos)
    }
  }
</script>

<style src="../node_modules/vue-material/dist/vue-material.css"></style>
<style>

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
}
#app > h1 {
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
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
}
.mood-list {
  margin-top: 1rem;
}
#app.video .mood-list button.md-raised {
  background-color: rgba(255, 255, 255, 0.2);
}
#app.video .mood-list:hover button.md-raised:not(.md-primary) {
  background-color: rgba(255, 255, 255, 0.6);
}
#app.video h1 {
  color: rgba(255, 255, 255, 0.9);
}
</style>
