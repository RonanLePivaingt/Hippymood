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
