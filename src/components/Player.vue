<template>
  <div class="player">
    <p>{{ current.song }}</p>
    <p>{{ current.album }}</p> 
    <p>{{ current.artist }}</p> 
    <div class="mood-list">
      <mood-list  v-for="mood in moods" :mood="mood" :key="mood.id"></mood-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'player',
  methods: {
    resetSession: function () {
      this.$http.get('/admin/resetSession').then(response => {
        console.log('Session successfully reseted')
      }, response => {
        console.log('Shit it the fan !')
      })
    }
  },
  computed: {
    currentmood: function () {
      return this.current.genreId
    },
    moods: function () {
      return this.$store.state.moods
    },
    current: function () {
      return this.$store.state.current
    }
  },
  created: function () {
    console.log('Get the mood list')
    this.$http.get('/moods').then(response => {
      this.$store.commit('setMoods', response.body)
    }, response => {
      console.log('Shit it the fan !')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../css/material-components-web.min.css"></style>
