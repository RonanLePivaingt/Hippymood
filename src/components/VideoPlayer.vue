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

    <md-card id="video-controls" v-show="youtubeId && videoMode">
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
        // window.vm.extPlay()
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
</style>
