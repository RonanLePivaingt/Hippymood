<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>

    <button class="mdc-button">Mood X</button>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'player',
  data () {
    return {
      msg: 'Hippymood',
      link: 'http://jaimeleschips.fr',
      success: true,
      moods: [],
      current: {},
      infos: {}
    }
  },
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
    }
  },
  created: function () {
    console.log('The vue is created')
    this.$http.get('/moods').then(response => {
      // get body data
      this.moods = response.body
    }, response => {
      console.log('Shit it the fan !')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../css/material-components-web.min.css"></style>
