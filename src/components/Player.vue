<template>
  <div>
    <div class="intro" v-show="intro">
      <p> Un site pour écouter de la musique selon ta "mood" </p>
      <p> 
        C'est comme une boite de chocolat, tant que t'as pas essayé tu ne sais pas!
        Des fois tu reviens, des fois pas...
      </p>
    </div>
    <div class="player" v-show="intro === 0">
      <md-card id="playerCard">
        <md-menu id="playerMenu" md-direction="bottom left" md-size="4">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item href="#/download">
              <span>Télécharger</span>
              <md-icon>file_download</md-icon>
            </md-menu-item>

            <md-menu-item href="#/about">
              <span>À propos</span>
              <md-icon>info_outline</md-icon>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

        <md-card-header class="player-header">
          <md-button class="md-icon-button searchButton" @click="search">
            <md-icon>search</md-icon>
          </md-button>
          <div class="md-title">
            <i class="material-icons meta">audiotrack</i> {{ current.song }}
          </div>
        </md-card-header>

        <md-card-content>
            <span v-show="current.album">
              <i class="material-icons meta">album</i> {{ current.album }} </br>
            </span>
            <i class="material-icons">person</i> {{ current.artist }}
        </md-card-content>

        <md-card-actions id="playerControls">
          <md-button @click.native="play" v-show="paused" class="md-accent md-fab md-raised"> 
            <md-icon>play_arrow</md-icon>
          </md-button>
          <md-button @click.native="pause" v-show="!paused" class="md-accent md-fab md-raised"> 
            <md-icon>pause</md-icon>
          </md-button>
          <md-button @click.native="nextSong" class="md-fab md-raised"> 
            <md-icon>skip_next</md-icon>
          </md-button>
        </md-card-actions>

        <md-card-content class="player-mood">
          <md-chip disabled>{{ currentmood }}</md-chip>
          <md-chip md-deletable v-show="nextChip" @click.native="deleteNext()"> {{ nextChip }}</md-chip>
        </md-card-content>
      </md-card>
    </div>

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
    nextSong () {
      this.$root.$store.dispatch('nextSong')
    },
    search () {
      this.$router.push('search')
    },
    deleteNext () {
      this.$store.commit('deleteNext')
    }
  },
  computed: {
    currentmood: function () {
      for (var i = 0; i < this.$store.state.moods.length; i++) {
        if (parseInt(this.$store.state.moods[i].id) === parseInt(this.current.moodId)) {
          return this.$store.state.moods[i].name
        }
      }
    },
    nextMood: function () {
      for (var i = 0; i < this.$store.state.moods.length; i++) {
        if (parseInt(this.$store.state.moods[i].id) === parseInt(this.next.moodId)) {
          return this.$store.state.moods[i].name
        }
      }
    },
    intro: function () {
      return this.$store.state.intro
    },
    moods: function () {
      return this.$store.state.moods
    },
    current: function () {
      return this.$store.state.current
    },
    next: function () {
      return this.$store.state.next
    },
    nextChip: function () {
      if (this.next.type === 'mood') {
        return this.nextMood
      }
      if (this.next.type === 'song') {
        return 'Chanson : ' + this.$store.state.next.song.song
      }
      return false
    },
    paused: function () {
      return this.$store.state.playerState === 'paused'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.intro p {
  font-size: 1.5rem;
  line-height: 1.5rem;
}
#playerCard {
  margin: 0 auto;
  width: 30em;
}
#playerMenu {
  position: absolute;
  right: 0px;
  color: white;
}
.player-header {
  display: flex;
  height: 176px;
  background: rgb(0,188,212);
  color: white;
}
.player-header .md-title {
  align-self: flex-end;
}
button.md-button.searchButton {
  position: absolute;
  top: 0;
  right: 36px;
}
.searchButton > i.md-icon {
  color: white !important;
}
.player-mood {
  margin: 0 auto;
}
#playerControls {
  margin: 0 auto;
}
.mood-list {
  max-width: 35rem;
  text-align: center;
  margin: 0 auto;
}
</style>
