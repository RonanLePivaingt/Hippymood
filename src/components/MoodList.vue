<template>
  <a
    @click="play" 
    :id="mood.id" 
    class="md-button md-raised"
    :class="isActive"
    :disabled="videoMode && mood.nbVideo === 0"
    >
    {{ mood.name }}
  </a>
</template>

<script>
  export default {
    name: 'mood-list',
    props: ['mood'],
    methods: {
      play: function (el) {
        if (this.playerState !== 'playing') {
          this.$root.$store.dispatch('askPlayMood', el.target.id)
        }
        if (this.playerState === 'playing') {
          this.$root.$store.dispatch('askNextMood', el.target.id)
        }
      }
    },
    computed: {
      isActive () {
        // Return the CSS classes to apply to the current mood button
        return parseInt(this.$store.state.current.moodId) === parseInt(this.mood.id) ? 'md-raised md-primary md-theme-default' : ''
      },
      playerState () {
        return this.$store.state.playerState
      },
      next () {
        return this.$store.state.next
      },
      videoMode () {
        return this.$store.state.videoMode
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a.md-primary {
  text-shadow: 1px 0.1px 1px rgba(12,12,12,0.3);
}
i.material-icons{
  color: rgba(0, 0, 0, 0.54);
}
#app.video a.md-primary {
  background-color: rgba(63, 81, 181, 0.7);
}
</style>
