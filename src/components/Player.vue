<template>
  <div class="player">
    <md-card id="playerCard" class="md-primary">
      <md-menu id="playerMenu" md-direction="bottom left" md-size="4">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item>
            <span>Find on map</span>
            <md-icon>near_me</md-icon>
          </md-menu-item>

          <md-menu-item>
            <span>Call</span>
            <md-icon>phone</md-icon>
          </md-menu-item>
        </md-menu-content>
      </md-menu>

      <md-card-header>
        <div class="md-title">{{ current.song }}</div>
        <div class="md-subhead">
          <span v-show="current.album">{{ current.album }} </br></span>
          {{ current.artist }}
        </div>
      </md-card-header>

      <md-card-actions id="playerControls">
        <md-button @click.native="play" v-show="paused" class="md-raised"> 
            Play 
        </md-button>
        <md-button @click.native="pause" v-show="!paused" class="md-raised"> 
            Pause 
        </md-button>
        <md-button @click.native="next" class="md-raised"> 
            Next 
        </md-button>
      </md-card-actions>
    </md-card>
    <div class="mood-list">
      <mood-list  v-for="mood in moods" :mood="mood" :key="mood.id"></mood-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'player',
  methods: {
    play () {
      var playerHTML5 = document.getElementById('playerHTML5')
      playerHTML5.play()
      this.$store.commit('setPlaying')
    },
    pause () {
      var playerHTML5 = document.getElementById('playerHTML5')
      playerHTML5.pause()
      this.$store.commit('setPaused')
    },
    next () {
      this.$root.$store.dispatch('nextSong')
    }
  },
  computed: {
    currentmood: function () {
      return this.current.genreId
    },
    moods: function () {
      return this.$store.state.moods
    },
    current: function () {
      return this.$store.state.current
    },
    paused: function () {
      return this.$store.state.playerState === 'paused'
    }

  },
  created: function () {
    console.log('Get the mood list')
    this.$http.get('/moods').then(response => {
      this.$store.commit('setMoods', response.body)
    }, response => {
      console.log('Shit it the fan !')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#playerCard {
  margin: 0 auto;
  width: 30em;
}
#playerMenu {
  position: absolute;
  right: 0px;
}
#playerControls {
  margin: 0 auto;
}
</style>
