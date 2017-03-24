<template>
  <div>
    <audio id="playerHTML5" autoplay="autoplay" :src="current.path"></audio>
    <p>{{ current.path }}</p>
  </div>
</template>

<script>
  export default {
    name: 'player-html5',
    props: ['current'],
    methods: {
      play: function (el) {
        // window.vm.playGenre(el.target.id)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #playerHTML5 {
    display: none;
  }
</style>
