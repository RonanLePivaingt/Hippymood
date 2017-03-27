<template>
  <div id="admin">
    <p>
      <button class="mdc-button" @click="resetSession()" > Reset session </button>
    </p>
    <p>
      <button class="mdc-button" @click="resetDatabase()" > Reset database </button>
    </p>
    <p>
      <button class="mdc-button" @click="scanMusic()" > Scan music </button>
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
