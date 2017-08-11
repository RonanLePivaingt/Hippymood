<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons"> 
    <h1> Hippy Mood </h1>
    <div v-if="unlocked === -1">
      <p>Loading</p>
    </div>
    <chipslock v-if="unlocked === 0"></chipslock>
    <router-view v-if="unlocked === 1"></router-view>
    <player-html5 :current="current"></player-html5>
  </div>
</template>

<script>
import Keypress from './js/keypress-2.1.4.min.js'
var listener = new Keypress.Listener()
var myCombos
import chipslock from './components/ChipsLock'
export default {
  name: 'app',
  components: {
    chipslock
  },
  computed: {
    current: function () {
      return this.$store.state.current
    },
    unlocked: function () {
      return this.$store.state.unlocked
    }
  },
  mounted: function () {
    var myScope = document
    myCombos = listener.register_many([
      {
        'keys': 'meta space',
        'on_keydown': function () {
          window.vm.togglePlayPause()
        },
        'this': myScope
      },
      {
        'keys': 'meta left',
        'on_keydown': function () {
          window.vm.playPreviousSong()
        },
        'this': myScope
      },
      {
        'keys': 'meta right',
        'on_keydown': function () {
          window.vm.playNextSong()
        },
        'this': myScope
      },
      {
        'keys': 'meta s',
        'on_keydown': function () {
          window.vm.displayDownload()
        },
        'this': myScope
      },
      {
        'keys': 'meta f',
        'on_keydown': function () {
          window.vm.displaySearch()
        },
        'this': myScope
      },
      {
        'keys': 'meta i',
        'on_keydown': function () {
          window.vm.displayAbout()
        },
        'this': myScope
      },
      {
        'keys': 'meta h',
        'on_keydown': function () {
          window.vm.displayPlayer()
        },
        'this': myScope
      }
    ])
  },
  destroyed: function () {
    // Removing listeners when the component is removed
    listener.unregister_many(myCombos)
  },
  methods: {
    play () {
      window.vm.play()
    },
    pause () {
      window.vm.pause()
    },
    nextSong () {
      window.vm.playNextSong()
    },
    search () {
      this.$router.push('search')
    }
  }
}
</script>

<style src="../node_modules/vue-material/dist/vue-material.css"></style>
<style>
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
<style>
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
