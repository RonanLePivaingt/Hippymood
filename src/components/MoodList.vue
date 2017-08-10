<template>
  <md-button 
    @click.native="play" 
    :id="mood.id" 
    :class="isActive"
    class="md-raised"
  >
    {{ mood.name }}
  </md-button>
</template>

<script>
  export default {
    name: 'mood-list',
    props: ['mood'],
    methods: {
      play: function (el) {
        if (this.playerState !== 'playing') {
          this.$root.$store.dispatch('playMood', el.target.id)
        }
        if (this.playerState === 'playing') {
          this.$root.$store.dispatch('setNextMood', el.target.id)
        }
      }
    },
    computed: {
      isActive () {
        // Return the CSS classes to apply to the current mood button
        return parseInt(this.$store.state.current.moodId) === parseInt(this.mood.id) ? 'md-raised md-primary' : ''
      },
      playerState () {
        return this.$store.state.playerState
      },
      next () {
        return this.$store.state.next
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
