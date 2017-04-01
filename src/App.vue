<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons"> 
    <h1> Hippymood </h1>
    <router-view></router-view>
    <player-html5 :current="current"></player-html5>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    current: function () {
      return this.$store.state.current
    }
  }
}
</script>

<style src="../node_modules/vue-material/dist/vue-material.css"></style>
<style>
#app > h1 {
  text-align: center;
}
</style>
