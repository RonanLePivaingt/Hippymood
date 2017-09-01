<template>
  <div id="admin">
    <p>
      <md-button class="md-raised" @click="resetSession()">Reset session</md-button>
    </p>
    <p>
      <md-button class="md-raised md-warn" @click="resetDatabase()">Reset database</md-button>
    </p>
    <p>
      <md-button class="md-raised" @click="scanMusic()"> Scan music </md-button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'admin',
  methods: {
    resetSession () {
      this.$http.get('/admin/resetSession').then(response => {
        console.log(response)
      }, response => {
        console.log('Shit it the fan !')
      })
    },
    resetDatabase () {
      this.$http.get('/admin/resetDatabase').then(response => {
        console.log(response)
      }, response => {
        console.log('Shit it the fan !')
      })
    },
    scanMusic () {
      this.$http.get('/admin/scanMusic').then(response => {
        console.log(response)
      }, response => {
        console.log('Shit it the fan !')
      })
    }
  }
}
</script>

<style>
</style>
