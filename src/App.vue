<template>
  <div id="app">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
    <link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons"> 
    <h1> Hippymood </h1>
    <div v-if="unlocked === -1">
      <p>Loading</p>
    </div>
    <chipslock v-if="unlocked === 0"></chipslock>
    <router-view v-if="unlocked === 1"></router-view>
    <player-html5 :current="current"></player-html5>
  </div>
</template>

<script>
import chipslock from './components/ChipsLock'
export default {
  name: 'app',
  components: {
    chipslock
  },
  computed: {
    current: function () {
      return this.$store.state.current
    },
    unlocked: function () {
      return this.$store.state.unlocked
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
