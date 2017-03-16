<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return {
      message: 'Yop',
      link: 'http://jaimeleschips.fr',
      success: true,
      moods: [],
      current: {},
      infos: {}
    }
  },
  methods: {
    playGenre: function (genreId) {
      console.log('Play')
    },
    resetSession: function () {
      console.log('Reset session')
    }
  },
  computed: {
    currentmood: function () {
      return this.current.genreId
    }
  },
  created: function () {
    console.log('Get the mood list')
    this.$http.get('/moods').then(response => {
      // get body data
      console.log(response.body)
      this.moods = response.body
    }, response => {
      console.log('Shit it the fan !')
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
