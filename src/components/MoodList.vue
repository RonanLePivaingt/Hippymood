<template>
  <div class="mood-list">
    <h2> Hello mood list </h2>
    <button 
      @click="play" 
      :id="mood.id" 
      class="mdc-button" 
      :class="isActive"
    >
      {{ mood.name }}
    </button>
  </div>
</template>

<script>
  export default {
    name: 'mood-list',
    props: ['mood', 'currentmood'],
    methods: {
      play: function (el) {
        // vm.playGenre(el.target.id);
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
