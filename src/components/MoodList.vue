<template>
  <button 
    @click="play" 
    :id="mood.id" 
    class="mdc-button" 
    :class="isActive"
  >
    {{ mood.name }}
  </button>
</template>

<script>
  export default {
    name: 'mood-list',
    props: ['mood'],
    methods: {
      play: function (el) {
        window.vm.$emit('mood-selected', el.target.id)
        // window.vm.playGenre(el.target.id)
      }
    },
    computed: {
      isActive: function () {
        // Return the CSS classes to apply to the current mood button
        return this.currentmood === this.mood.id ? 'mdc-button--accent mdc-button--raised' : ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
