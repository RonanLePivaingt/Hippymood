<template>
  <audio
    autoplay
    v-on:ended="playNext()"
    :src="/music/ + currentSong.path">
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AudioPlayer',
  computed: mapState('music', [ 'currentSong' ]),
};
</script>

<style>
.mood-btn {
  margin: 0.5rem;
}
</style>
