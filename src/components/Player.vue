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
            <md-tooltip md-direction="bottom">Rechercher par chanson, album ou artiste</md-tooltip>
          </md-button>
          <div class="md-title">
            <i class="material-icons meta">audiotrack</i> {{ current.song }}
          </div>
        </md-card-header>

        <md-card-content class="player-infos">
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
          <md-button @click.native="nextSong" v-show="!displayResetMood" class="md-fab md-raised"> 
            <md-icon>skip_next</md-icon>
          </md-button>
          <md-button @click.native="resetMood" v-show="displayResetMood" class="md-fab md-raised"> 
            <md-icon>replay</md-icon>
            <md-tooltip md-direction="bottom">Réécouter les chansons de la mood</md-tooltip>
          </md-button>
        </md-card-actions>

        <md-card-content class="player-mood">
          <md-chip disabled>
            {{ currentmood }}
            <span class="mood-songs-left" v-show="displayNbSongsLeft">{{ nbSongsLeft }}</span>
            <md-tooltip md-direction="bottom" v-show="displayNbSongsLeft">{{ nbSongsLeftChip }}</md-tooltip>
          </md-chip>
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
      window.vm.play()
    },
    pause () {
      window.vm.pause()
    },
    nextSong () {
      window.vm.playNextSong()
    },
    search () {
      this.$router.push('search')
    },
    deleteNext () {
      this.$store.commit('deleteNext')
    },
    resetMood () {
      this.$http.get('/resetMood/' + this.current.moodId).then(response => {
        this.nextSong()
      })
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
    nbSongsLeft: function () {
      if (this.$store.state.currentSongsLeft) {
        return this.$store.state.currentSongsLeft
      } else {
        return '0'
      }
    },
    next: function () {
      return this.$store.state.next
    },
    displayNbSongsLeft: function () {
      if (this.$store.state.currentSongsLeft >= 5) {
        return false
      } else {
        return true
      }
    },
    displayResetMood: function () {
      if (this.$store.state.currentSongsLeft === 0 && this.$store.state.next.type === undefined) {
        return true
      } else {
        return false
      }
    },
    nbSongsLeftChip: function () {
      if (this.nbSongsLeft !== '0') {
        return 'Plus que ' + this.nbSongsLeft + ' chansons restantes'
      } else {
        return 'Plus aucune chanson restante'
      }
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
span.md-tooltip {
  transform: translateX(-5rem) scale(1.5) !important;
}
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
.player-infos {
  color: rgba(0, 0, 0, 0.54);
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
/* Setting bigger player controls + set play button above the next song button */
#playerControls button {
  transform: scale(1.5);
}
#playerControls button:nth-child(1) {
  z-index: 42;
}
#playerControls i {
  transform: scale(1.5);
}
#playerControls button:not(.md-accent) i {
  color: rgba(0, 0, 0, 0.54);
}
.mood-songs-left {
  background-color: #e91e63;;
  display: inline-block;
  flex-direction: wrap;
  width: 1rem;
  height: 1rem;
  text-align: center;
  border-radius: 50%;
  color: white;
  font-weight: bold;
}
.mood-list {
  max-width: 35rem;
  text-align: center;
  margin: 0 auto;
}
</style>
