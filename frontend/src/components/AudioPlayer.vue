<template>
  <audio
    autoplay
    controls
    v-on:ended="playNext()"
    :src="/music/ + currentSong.path">
    Your browser does not support the
    <code>audio</code> element.
  </audio>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AudioPlayer',
  computed: mapState('music', [ 'currentSong' ]),
  methods: mapActions('music', [ 'playNext' ]),
};
</script>

<style>
.mood-btn {
  margin: 0.5rem;
}
</style>
