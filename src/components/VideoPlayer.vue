<template>
  <div v-show="intro !== true">
    <transition name="fade">
    <youtube
                v-if="youtubeId && videoMode"
                class="video"
                @ready="ready"
                @paused="pause"
                @playing="play"
                @ended="nextSong"
                :video-id="youtubeId"
                :player-vars="{ autoplay: 1 }"
                ></youtube>
    </transition>

    <md-card-content
      v-show="!youtubeId"
      class="player-video-error">
      <div>
        <div class="icon">
          <p>(>_<)</p>
        </div>
        <div class="message">
          <p>Il y a un problème de vidéo pour cette chanson</p>
          <p>Pour continuer en mode vidéo avant la fin de la chanson, cliquer sur suivant ou 2 fois sur une autre mood</p>
        </div>
      </div>
    </md-card-content>

    <md-card id="video-controls" v-show="videoMode">
      <Player-Controls
                                 v-on:playVideo="play"
                                 v-on:pauseVideo="pause"
                                 ></Player-Controls>
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
    name: 'video-player',
    components: {
      PlayerControls
    },
    methods: {
      resetMood () {
        this.$http.get('/resetMood/' + this.current.moodId).then(response => {
          this.nextSong()
        })
      },
      ready (player) {
        this.player = player
      },
      pause () {
        this.player.pauseVideo()
        // Setting global player state as paused
        window.vm.extPause()
      },
      play () {
        this.player.playVideo()
        // Setting global player state as play
        window.vm.extPlay()
      },
      nextSong () {
        window.vm.extPlayNextSong()
      }
    },
    computed: {
      intro: function () {
        return this.$store.state.intro
      },
      displayResetMood: function () {
        if (this.$store.state.currentSongsLeft === 0 && this.$store.state.next.type === undefined) {
          return true
        } else {
          return false
        }
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
<style scoped>
#app.video div.md-card.md-theme-default {
  overflow: hidden;
  width: 640px;
  background-color: rgba(0,0,0,0.0) !important;
}
.player-video-error {
  padding-left: 0px;
  font-size: 1rem;
}
#app.video:hover .player-video-error {
  color: rgba(255, 255, 255, 0.8);
}
.player-video-error > div {
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: stretch;
  align-items: stretch;
}
.player-video-error .icon, .player-video-error .message {
  display: inline-block;
}
.player-video-error .icon {
  width: 25%;
  font-size: 3rem;
  text-align: center;
}
.player-video-error .message {
  width: 74%;
}
</style>
