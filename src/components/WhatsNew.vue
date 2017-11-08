<template>
  <div>
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <span class="md-display-2">Dernières chansons</span>

    <md-list class="list">
      <md-list-item
        v-for="(item, index) in whatsNew"
        :key="item.id"
        class="list-item"
        @click="play(index)"
        >

        <div class="md-list-text-container">
          <span class="song-name">
            <i class="material-icons meta">audiotrack</i> {{ item.song }}
          </span>
          <span>
            <i class="material-icons meta">person</i> {{ item.artist }}
          </span>
          <p v-show="item.album">
            <i class="material-icons meta">album</i> {{ item.album }}
          </p>
        </div>

        <a
          class="md-button md-raised"
          @click="play(index)"
          >
          {{ item.mood }}
        </a>

      </md-list-item>
    </md-list>

    <transition name="fade">
      <div class="loading" v-show="!error && loading">
        <md-spinner :md-size="150" md-indeterminate></md-spinner>
      </div>
    </transition>

    <div class="error" v-show="error">
      <p>
        (>_<)
      </p>
    </div>

    <transition name="fade">
      <div class="more" v-show="!loading">
        <md-button class="md-raised md-accent" @click="loadMore">
          <i class="material-icons">add_circle_outline</i> Plus de chansons
        </md-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'whats-new',
  data: function () {
    return {
      loading: true,
      error: false
    }
  },
  beforeMount: function () {
    this.$root.$store.dispatch('askWhatsNew')
  },
  computed: {
    whatsNew: function () {
      if (this.$store.state.whatsNew.length === 0) {
        return false
      } else {
        this.loading = false
        return this.$store.state.whatsNew
      }
    }
  },
  methods: {
    play (index) {
      this.$root.$store.dispatch('askNextSong', this.whatsNew[index])
      this.$router.push('/')
    },
    loadMore () {
      this.loading = true
      this.$root.$store.dispatch('askWhatsNew')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading, .error, .more {
  text-align: center;
}
.error {
  font-size: 1rem;
}
.list-item {
    margin-bottom: 0.5rem;
}
.list-item i {
  color: rgba(0,0,0,0.5);
}
span.song-name {
  font-size: 1.2rem;
}
.list-item p {
  color: rgba(0,0,0,0.87);
}
</style>

