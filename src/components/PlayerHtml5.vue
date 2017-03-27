<template>
  <audio id="playerHTML5" autoplay="autoplay" :src="current.path"></audio>
</template>

<script>
  export default {
    name: 'player-html5',
    props: ['current']
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #playerHTML5 {
    display: none;
  }
</style>
