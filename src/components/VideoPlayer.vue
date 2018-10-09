<template>
  <div class="video-container">
    <youtube
      :video-id="youtubeId"
      ref="youtube-player"
      ></youtube>
  </div>
</template>

<script>
// eslint-disable-next-line
import getIdFromURL from 'vue-youtube-embed'

export default {
  name: 'video-player',
  computed: {
    current () { return this.$store.state.current },
    youtubeId () {
      this.$nextTick(function () {
        // eslint-disable-next-line
        console.log(this.$refs['youtube-player'].player.playVideo())
        // console.log(this.$el.textContent) // => 'updated'
        this.$root.player.startVideo()
      })
      if (this.$store.state.current.youtube) {
        return this.$youtube.getIdFromURL(this.$store.state.current.youtube)
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss">
// Default display
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px;
  overflow: hidden;
  margin-left: -16px;
  margin-right: -16px;
}

.video-container iframe,
.video-container object,
.video-container embed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
@media screen and (min-width: 1281px) {
  .video-container iframe,
  .video-container object,
  .video-container embed {
    height: 60% !important;
  }
}
@media screen and (min-width: 601px) and (max-width: 1280px) {
  .video-container iframe,
  .video-container object,
  .video-container embed {
    height: 80% !important;
  }
}
@media screen and (max-width: 600px) {
  .video-container iframe,
  .video-container object,
  .video-container embed {
    height: 100% !important;
  }
}
// Sticky display
.video-container {
  position: sticky;
  bottom: -75px;
  z-index: 100;
}
.video-container.sticky iframe,
.video-container.sticky object,
.video-container.sticky embed {
  left: 5%;
  width: 90%;
  height: 20vh !important;
}
</style>
