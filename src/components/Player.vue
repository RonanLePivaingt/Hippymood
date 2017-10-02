<template>
  <div 
    class="player" 
    v-bind:class="{ video: videoMode }"
    v-show="intro === 0"
    >
    <md-card id="playerCard">
      <md-menu id="playerMenu" md-direction="bottom left" md-size="4">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item href="#/download">
            <span>Télécharger</span>
            <md-icon>file_download</md-icon>
          </md-menu-item>

          <md-menu-item href="#/whatsNew">
            <span>Quoi de neuf ?</span>
            <md-icon>fiber_new</md-icon>
          </md-menu-item>

          <md-menu-item href="#/about">
            <span>À propos</span>
            <md-icon>info_outline</md-icon>
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <md-card-header class="player-header">
        <transition name="fade">
        <md-button-toggle 
                    v-if="betaMode"
                    @click.native="changeVideoMode" 
                    class="videoModeToggle"
                    >
                    <md-button 
                    v-bind:class="{ 'md-toggle': videoMode }"
                    class="md-icon-button"
                    >
                    <md-icon>ondemand_video</md-icon>
                      <md-tooltip
                    v-show="videoMode"
                    md-direction="bottom"
                    >Activer le mode vidéo</md-tooltip>
                        <md-tooltip
                    v-show="videoMode"
                    md-direction="bottom"
                    >Désactiver le mode vidéo</md-tooltip>
                    </md-button>
        </md-button-toggle>
        </transition>

        <md-button class="md-icon-button searchButton" @click="search">
          <md-icon>search</md-icon>
          <md-tooltip md-direction="bottom">Rechercher par chanson, album ou artiste</md-tooltip>
        </md-button>
        <div class="md-title">
          <i class="material-icons meta">audiotrack</i> {{ current.song }}
        </div>
      </md-card-header>

      <md-card-content class="player-infos">
        <transition name="fade">
        <span v-show="current.album">
          <i class="material-icons meta">album</i> {{ current.album }} </br>
        </span>
        </transition>
        <i class="material-icons">person</i> {{ current.artist }}
      </md-card-content>

      <player-controls 
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
  import PlayerControls from './PlayerControls'
  export default {
    name: 'player',
    components: {
      PlayerControls
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
      }
    },
    computed: {
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
#playerCard {
  margin: 0 auto;
  width: 100%;
}
#playerMenu {
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
#app.video .player-header,
#app.video:not(:hover) .player-header i.md-icon,
#app.video:not(:hover) #playerMenu i.md-icon,
#app.video .player-infos
{
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}
#app.video:not(:hover) .player-header,
#app.video:not(:hover) .player-header i.md-icon,
#app.video:not(:hover) #playerMenu i.md-icon,
#app.video:not(:hover) .player-infos
{
  color: rgba(255, 255, 255, 0.6) !important;
}
#app.video .player-header {
  background: rgba(0,188,212,0.5);
}
.player-header .md-title {
  align-self: flex-end;
}
div.video .player-infos {
  color: white;
}
.player-infos {
  color: rgba(0, 0, 0, 0.54);
  text-align: left;
}
.videoModeToggle {
  position: absolute;
  top: 0;
  right: 76px;
  border-radius: 50% !important;
}
.videoModeToggle .md-icon {
  color: white !important;
}
button.md-button.searchButton {
  position: absolute;
  top: 0;
  right: 36px;
}
.searchButton > i.md-icon {
  color: white !important;
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
#app.video {
  color: rgba(255, 255, 255, 0.6);
}
</style>
