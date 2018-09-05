<template>
  <audio
    id="playerHTML5"
    autoplay="autoplay"
    :src="current.path"
    v-on:ended="next()"
    ></audio>
</template>

<script>
  export default {
    name: 'html5-player',
    props: ['current'],
    methods: {
      next () {
        this.$root.$store.dispatch('askFindAndPlayNextSong')
      }
    }
  }
</script>

<style slot-scope>
#playerHTML5 {
  display: none;
}
</style>
