<template>
  <md-button 
    @click.native="play" 
    :id="mood.id" 
    :class="isActive"
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
        this.$root.$store.dispatch('playMood', el.target.id)
      }
    },
    computed: {
      isActive () {
        // Return the CSS classes to apply to the current mood button
        return parseInt(this.$store.state.currentMood) === parseInt(this.mood.id) ? 'md-raised md-accent' : ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
