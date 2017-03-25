<template>
  <div class="player">
    <div class="mood-list">
      <mood-list  v-for="mood in moods" :mood="mood" :key="mood.id"></mood-list>
      <p>Pointless counter : {{ count }} </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'player',
  data: '',
  methods: {
    playGenre: function (genreId) {
      this.$http.get('/mood/' + genreId).then(response => {
        // get body data
        if (response.body.songs) {
          this.current = response.body.songs[0]
        }
        this.infos = response.body.infos
      }, response => {
      })
    },
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
    count: function () {
      return this.$store.state.count
    },
    moods: function () {
      return this.$store.state.moods
    }
  },
  created: function () {
    console.log('Get the mood list')
    this.$http.get('/moods').then(response => {
      // get body data
      console.log(response.body)
      this.$store.commit('setMoods', response.body)
    }, response => {
      console.log('Shit it the fan !')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../css/material-components-web.min.css"></style>
