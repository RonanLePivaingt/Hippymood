<template>
  <div 
    id="app"
    v-bind:class="{video: videoMode}"
    >

    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons"> 
    <div id="mask"></div>

    <h1> Hippy Mood </h1>
    <div v-if="unlocked === -1">
      <p>Loading</p>
    </div>

    <chipslock v-if="unlocked === 0"></chipslock>

    <router-view v-if="unlocked === 1"></router-view>

    <player-html5 
                 v-if="videoMode === false"
                 :current="current"
                 ></player-html5>

    <youtube
                 v-if="youtubeId && videoMode"
                 class="video"
                 @ended="nextSong"
                 :video-id="youtubeId"
                 :player-vars="{ autoplay: 1 }"
                 ></youtube>

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
  function youtubeVideoId (url) {
    var videoId = url.split('v=')[1]
    var ampersandPosition = videoId.indexOf('&')
    if (ampersandPosition !== -1) {
      videoId = videoId.substring(0, ampersandPosition)
    }
    return videoId
  }
  import Keypress from './js/keypress-2.1.4.min.js'
  var listener = new Keypress.Listener()
  var myCombos
  import chipslock from './components/ChipsLock'
  import moodList from './components/MoodList'
  import playerHTML5 from './components/PlayerHtml5'
  export default {
    name: 'app',
    components: {
      chipslock,
      'mood-list': moodList,
      'player-html5': playerHTML5
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
      youtubeId: function () {
        if (this.$store.state.current.youtube) {
          return youtubeVideoId(this.$store.state.current.youtube)
        } else {
          return false
        }
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
</style>
