<template>
  <div id="app">
    <h1> Hippymood </h1>
    <router-view></router-view>
    <player-html5 :current="current"></player-html5>
    <button @click="testStore()">Increment counter</button>
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
      infos: {}
    }
  },
  methods: {
    playGenre: function (genreId) {
      console.log('Play')
    },
    resetSession: function () {
      console.log('Reset session')
    },
    testStore: function () {
      this.$store.commit('increment')
    }
  },
  computed: {
    current: function () {
      return this.$store.state.current
    }
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
