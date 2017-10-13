<template>
  <div>
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <div class="loading" v-show="loading">
      <md-spinner :md-size="150" md-indeterminate></md-spinner>
    </div>

    <div class="error" v-show="error">
      <p>
        (>_<)
      </p>
    </div>

    <span class="md-display-2">Dernières chansons</span>

    <md-list>
      <md-list-item 
        v-for="(item, index) in whatsNew"
        :key="item.id"
        class="list-item"
        >

        <span></span>

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

        <md-button 
          class="md-raised"
          @click="play(index)"
          > 
          {{ item.mood }} 
        </md-button>

      </md-list-item>
    </md-list>

  </div>
</template>

<script>
export default {
  name: 'whats-new',
  data: function () {
    return {
      loading: false,
      error: false
    }
  },
  beforeMount: function () {
    this.$root.$store.dispatch('askWhatsNew')
  },
  computed: {
    whatsNew: function () {
      return this.$store.state.whatsNew
    }
  },
  methods: {
    play (index) {
      this.$root.$store.dispatch('askNextSong', this.whatsNew[index])
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loading, .error {
  text-align: center;
}
.error {
  font-size: 1rem;
}
.list-item {
    margin-bottom: 0.5rem;
}
i {
  color: rgba(0,0,0,0.5);
}
span.song-name {
  font-size: 1.2rem;
}
</style>

