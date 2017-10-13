<template>
  <div>
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>
    <form 
      id="searchForm" 
      action="/#/Search"
      v-on:submit.prevent="onSubmit"
      >
      <md-input-container md-clearable>
        <label>Artiste, chanson ou album à rechercher</label>
        <md-input v-model="searchKeywords"></md-input>
      </md-input-container>
    </form>

    <div class="loading" v-show="loading">
      <md-spinner :md-size="150" md-indeterminate></md-spinner>
    </div>

    <div class="error" v-show="error">
      <p>
        (>_<)
      </p>
      Aucun résultat de recherche pour la recherche : <b> {{ previousSearchKeywords }} </b>
    </div>

    <md-list>
      <md-list-item 
        v-for="(item, index) in searchResults"
        :key="item.id"
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
          @click="playSearchResult(index)"
          > 
          {{ item.mood }} 
        </md-button>

      </md-list-item>
    </md-list>

  </div>
</template>

<script>
export default {
  name: 'search',
  data: function () {
    return {
      searchKeywords: '',
      previousSearchKeywords: '',
      searchResults: {},
      loading: false,
      error: false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      var searchInput = document.querySelectorAll('#searchForm input')[0]
      searchInput.focus()
    })
  },
  methods: {
    onSubmit () {
      this.searchResults = {}
      this.loading = true
      this.error = false
      this.$http.get(
        '/search/' + this.searchKeywords,
      ).then(
        response => {
          this.loading = false
          if (response.body.searchResults !== undefined) {
            this.searchResults = response.body.searchResults
          } else {
            this.previousSearchKeywords = this.searchKeywords
            this.error = true
          }
        }
      )
    },
    playSearchResult (index) {
      this.$root.$store.dispatch('askNextSong', this.searchResults[index])
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
  color: rgba(0,0,0,0.5);
  font-size: 1rem;
}
.error > p {
  font-size: 8rem;
}
.list-item {
  margin-bottom: 1rem;
}
i {
  color: rgba(0,0,0,0.5);
}
.song-name {
  font-size: 1.2rem;
}
</style>
