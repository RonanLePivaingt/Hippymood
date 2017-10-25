<template>
  <div
    id="playerControls"
    >
    <md-card-actions
    class="player-controls-buttons"
    >
    <md-button
    @click.native="play"
    v-show="paused"
    class="md-accent md-raised"
    v-bind:class="{ 'md-fab': roundStyle }"
    >
        <md-icon class="bright-background">play_arrow</md-icon>
    </md-button>

      <md-button
    @click.native="pause"
    v-show="!paused"
    class="md-accent md-raised"
    v-bind:class="{ 'md-fab': roundStyle }"
    >
    <md-icon class="bright-background">pause</md-icon>
      </md-button>

    <md-button
    @click.native="nextSong"
    v-show="!displayResetMood"
    class="md-raised"
    v-bind:class="{ 'md-fab': roundStyle }"
    >
    <md-icon>skip_next</md-icon>
    </md-button>

    <md-button
    @click.native="resetMood"
    v-show="displayResetMood"
    class="md-raised"
    v-bind:class="{ 'md-fab': roundStyle }"
    >
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
      <md-chip md-deletable v-show="nextChip" @delete="deleteNext()"> {{ nextChip }}</md-chip>
    </md-card-content>
  </div>
</template>

<script>
export default {
  name: 'player-controls',
  props: ['roundStyle', 'pauseVideo'],
  methods: {
    play () {
      this.$emit('playVideo')
      window.vm.extPlay()
    },
    pause () {
      this.$emit('pauseVideo')
      window.vm.extPause()
    },
    nextSong () {
      window.vm.extPlayNextSong()
    },
    resetMood () {
      this.$http.get('/resetMood/' + this.current.moodId).then(response => {
        this.nextSong()
      })
    },
    deleteNext () {
      this.$store.commit('deleteNext')
    }
  },
  computed: {
    current: function () {
      return this.$store.state.current
    },
    currentmood: function () {
      for (var i = 0; i < this.$store.state.moods.length; i++) {
        if (parseInt(this.$store.state.moods[i].id) === parseInt(this.current.moodId)) {
          return this.$store.state.moods[i].name
        }
      }
    },
    next: function () {
      return this.$store.state.next
    },
    nbSongsLeft: function () {
      if (this.$store.state.currentSongsLeft) {
        return this.$store.state.currentSongsLeft
      } else {
        return '0'
      }
    },
    displayNbSongsLeft: function () {
      if (this.$store.state.currentSongsLeft >= 5) {
        return false
      } else {
        return true
      }
    },
    nbSongsLeftChip: function () {
      if (this.nbSongsLeft !== '0') {
        return 'Plus que ' + this.nbSongsLeft + ' chansons restantes'
      } else {
        return 'Plus aucune chanson restante'
      }
    },
    nextMood: function () {
      for (var i = 0; i < this.$store.state.moods.length; i++) {
        if (parseInt(this.$store.state.moods[i].id) === parseInt(this.$store.state.next.moodId)) {
          return this.$store.state.moods[i].name
        }
      }
    },
    nextChip: function () {
      if (this.$store.state.next.type === 'mood') {
        return this.nextMood
      }
      if (this.$store.state.next.type === 'song') {
        return 'Chanson : ' + this.$store.state.next.song.song
      }
      return false
    },
    paused: function () {
      return this.$store.state.playerState === 'paused'
    },
    displayResetMood: function () {
      if (this.$store.state.currentSongsLeft === 0 && this.$store.state.next.type === undefined) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#app.video div.md-card.md-theme-default {
  overflow: hidden;
  background-color: rgba(0,0,0,0.0) !important;
}
#playerControls {
  margin: 0 auto;
}
#playerControls button:nth-child(1) {
  z-index: 42;
}
#app:not(.video) #playerControls i:not(.md-icon-delete),
#app:not(.video) #playerControls button:not(.md-delete) {
  transform: scale(1.5);
}
#playerControls button:not(.md-accent) i {
  color: rgba(0, 0, 0, 0.54);
}
.player-controls-buttons {
  justify-content: center !important;
}
.player-mood {
  text-align: center;
}
#app:not(.video) .player-mood {
  padding: 1rem 0px 0.5rem 0px !important;
}
#app.video .player-mood {
  padding: 0px 0px 0.5rem 0px !important;
}
#app.video button.md-accent {
  background-color: rgba(233, 30, 99, 0.6);
}
#app.video button.md-raised:not(.md-accent) {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
