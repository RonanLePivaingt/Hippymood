<template>
  <div class="mood-list" >
    <md-button
      v-for="mood in moods"
      :key="mood.id"
      @click.native="play"
      :id="mood.id"
      class="md-raised"
      v-bind:class="[mood.id == currentMood ? 'md-accent' : '']"
      >
      {{ mood.name }}
    </md-button>
  </div>
</template>

<script>
export default {
  name: 'mood-list',
  methods: {
    play: function (el) {
      this.$root.$store.dispatch('askPlayMood', el.target.id)
    }
  },
  computed: {
    currentMood () {
      if (this.$store.state.current.moodId) {
        return this.$store.state.current.moodId
      } else {
        return false
      }
    },
    moods () {
      return this.$store.state.moods
    }
  }
}
</script>
