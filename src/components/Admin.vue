<template>
  <div id="admin">
    <p>
      <md-button class="md-raised" @click="resetSession()">Reset session</md-button>
    </p>
    <p>
      <md-button class="md-raised md-warn" @click="resetDatabase()">Reset database</md-button>
    </p>
    <div>
      <md-button class="md-raised" @click="scanMusic()"> Scan music </md-button>
      <div v-show="scanProgress > -1">
        {{ scanProgress }} %
        <md-progress 
          class="md-accent"
          :md-progress="scanProgress"></md-progress>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'admin',
  data () {
    return {
      scanProgress: -1
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connection')
    },
    scan: function (val) {
      if (val === 'Done') {
        this.scanProgress = -1
      } else {
        this.scanProgress = val
      }
    }
  },
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
      this.$socket.scan = (data) => {
        console.log(data)
      }

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
