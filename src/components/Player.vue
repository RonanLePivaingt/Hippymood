<template>
  <div
    class="player"
    v-bind:class="{ video: videoMode }"
    v-show="intro === 0"
    >
    <md-card id="playerCard" v-intro="intro1" v-intro-position="'right'" v-intro-autostart="true" v-intro-step="4" v-if="intro == 0">
      <div>
        <md-menu id="player-menu" md-direction="bottom left" md-size="4" @close="menuClose">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon class="bright-background">menu</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item href="#/download">
              <span>Télécharger</span>
              <md-icon>file_download</md-icon>
            </md-menu-item>

            <md-menu-item @click="changeVideoMode">
              <span>Mode vidéo</span>
              <md-switch v-model="videoMode" @change="changeVideoMode"></md-switch>
            </md-menu-item>

            <md-menu-item href="#/whatsNew">
              <span>Quoi de neuf ?</span>
              <md-icon>fiber_new</md-icon>
            </md-menu-item>

            <md-menu-item href="#/suggestions">
              <span>Suggestions</span>
              <md-icon class="idea-icon">wb_incandescent</md-icon>
            </md-menu-item>

            <md-menu-item href="#/admin" v-if="user.masterUser">
              <span>Administration</span>
              <md-icon>build</md-icon>
            </md-menu-item>

            <md-menu-item href="#/about">
              <span>À propos</span>
              <md-icon>info_outline</md-icon>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>

      <md-card-header class="player-header">
        <md-button class="md-icon-button searchButton" @click="search">
          <md-icon id="player-search" class="bright-background">search</md-icon>
          <md-tooltip md-direction="bottom">Rechercher par chanson, album ou artiste</md-tooltip>
        </md-button>
        <div class="md-title">
          <i class="material-icons meta">audiotrack</i>
          <span> {{ current.song }} </span>
        </div>
      </md-card-header>

      <md-card-content class="player-infos">
        <transition name="fade">
          <div v-show="current.album">
            <i class="material-icons meta">album</i>
            <span> {{ current.album }} </span>
            </br>
          </div>
        </transition>
        <div>
          <i class="material-icons">person</i>
          <span> {{ current.artist }} </span>
        </div>
      </md-card-content>

      <player-controls
           v-on:playVideo="play"
           v-on:pauseVideo="pause"
           v-show="videoMode === false"
           roundStyle="1"
           ></player-controls>
    </md-card>
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
  var myCombos
  import PlayerControls from './PlayerControls'
  export default {
    name: 'player',
    components: {
      PlayerControls
    },
    data () {
      return {
        intro1: '<p>Le streaming de mp3 est désactivé dans la démo pour des raisons légales.</p> <p> Clique sur le menu puis sur Mode Vidéo pour activer la lecture de musique avec Youtube.</p>'
      }
    },
    methods: {
      play () {
        window.vm.extPlay()
      },
      pause () {
        window.vm.extPause()
      },
      nextSong () {
        window.vm.extPlayNextSong()
      },
      changeVideoMode () {
        this.$store.commit('toggleVideoMode')
      },
      search () {
        this.$router.push('search')
      },
      menuClose () {
        console.log('Menu is closing')
        this.$intro().exit() // start the guide
      }
    },
    computed: {
      user: function () {
        return this.$store.state.user
      },
      intro: function () {
        return this.$store.state.intro
      },
      current: function () {
        return this.$store.state.current
      },
      nbSongsLeft: function () {
        if (this.$store.state.currentSongsLeft) {
          return this.$store.state.currentSongsLeft
        } else {
          return '0'
        }
      },
      next: function () {
        return this.$store.state.next
      },
      nbSongsLeftChip: function () {
        if (this.nbSongsLeft !== '0') {
          return 'Plus que ' + this.nbSongsLeft + ' chansons restantes'
        } else {
          return 'Plus aucune chanson restante'
        }
      },
      nextChip: function () {
        if (this.next.type === 'mood') {
          return this.nextMood
        }
        if (this.next.type === 'song') {
          return 'Chanson : ' + this.$store.state.next.song.song
        }
        return false
      },
      betaMode: function () {
        return this.$store.state.betaMode
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
      myCombos = window.listener.register_many([
        {
          'keys': 'meta space',
          'on_keydown': function () {
            window.vm.extTogglePlayPause()
          },
          'this': myScope,
          'prevent_default': true
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
      window.listener.unregister_many(myCombos)
    }
  }
</script>

<style>
/* Displaying the menu in front of introJs helper layer */
.md-menu-content.md-active {
  z-index: 10000000;
}
span.md-tooltip {
  transform: translateX(-5rem) scale(1.5) !important;
}
.intro {
  width: 50rem;
}
.intro p {
  font-size: 1.5rem;
  line-height: 1.5rem;
}
#app #playerCard {
  margin: 0 auto;
  width: 30rem;
}
#player-menu {
  position: absolute;
  right: 0px;
  color: white;
}
.player-header {
  display: flex;
  height: 176px;
  background: rgb(0,188,212);
  color: white;
}
.player-header .md-title i {
  font-size: 2rem;
}
.player-infos {
  font-size: 1rem;
  text-align: left;
  color: rgba(0, 0, 0, 0.87);
  line-height: 2rem;
}
.player-header .md-title, .player-infos div {
  display:flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
}
.player-header i#player-search {
  color: white;
}
.player-header .md-title i, .player-infos i {
  padding-right: 0.3rem;
}
.player-infos i {
  font-size: 2rem;
  color: rgba(0, 0, 0, 0.5);
}
.player-infos span {
  font-size: 1rem;
  line-height: 2rem;
}
/*
 * Video mode
 */
#app.video #playerCard {
  margin: 0 auto;
  width: 640px;
}
#app.video .player-header,
#app.video .player-header div.md-title,
#app.video .player-header div.md-title i.md-icon,
#app.video .player-header i.md-icon,
#app.video #player-menu i.md-icon,
#app.video .player-infos,
#app.video .player-infos i
{
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
#app.video .player-header,
#app.video .player-infos
{
  color: rgba(255, 255, 255, 0.6);
}
#app.video .player-header i,
#app.video #player-menu i.md-icon,
#app.video .player-infos i
{
  color: rgba(255, 255, 255, 0.4);
}
/*
#app.video:hover .player-infos
*/
#app.video:hover .player-header div.md-title,
#app.video:hover #player-menu i.md-icon,
#app.video:hover .player-header i,
#app.video:hover .player-header i#player-search,
#app.video:hover .player-infos i
{
  color: rgba(255, 255, 255, 0.6);
}
#app.video:hover .player-header div.md-title,
#app.video:hover .player-header i#player-search,
#app.video:hover #player-menu i.md-icon,
#app.video:hover .player-infos
{
  color: rgba(255, 255, 255, 1);
}
#app.video .player-header {
  background: rgba(0,188,212,0.5);
}
#app.video {
  color: rgba(255, 255, 255, 0.6);
}
#app.video .list {
  background-color: rgba(0, 0, 0, 0);
}
.player-header .md-title {
  align-self: flex-end;
  text-shadow: 1px 0.1px 1px rgba(12,12,12,0.3);
}
#player-menu i.material-icons, .player-header .md-title i.material-icons.meta {
  color: rgba(255, 255, 255, 0.87);
}
div.video .player-infos {
  color: white;
}
.videoModeToggle {
  position: absolute;
  top: 0;
  right: 76px;
}
.md-button-toggle .md-button {
  border-radius: 50% !important;
}
button.md-button.searchButton {
  position: absolute;
  top: 0;
  right: 36px;
}
.searchButton > i.md-icon {
  color: white;
}
.mood-songs-left {
  background-color: #e91e63;;
  display: inline-block;
  flex-direction: wrap;
  width: 1rem;
  height: 1rem;
  text-align: center;
  border-radius: 50%;
  color: white;
  font-weight: bold;
}
#app.video .mood-songs-left {
  background-color: rgba(233, 30, 99, 0.6);
}
.mood-list {
  max-width: 35rem;
  text-align: center;
  margin: 0 auto;
}
.video iframe:not(.md-image) {
  height: 360px;
}
.video #playerCard.md-card {
  width: 64Opx;
}
.video .player-header {
  height: 100%;
}
.function-tooltip {
  width: 15rem;
}
i.idea-icon {
  transform: rotate(180deg);
}
</style>
