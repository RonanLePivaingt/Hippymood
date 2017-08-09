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

    <md-list>
      <md-list-item 
        v-for="(item, index) in searchResults"
        :key="item.id"
        >

        <span></span>

        <div class="md-list-text-container">
          <span> 
            <i class="material-icons meta">audiotrack</i> {{ item.song }} 
          </span>
          <span> 
            <i class="material-icons meta">person</i> {{ item.artist }} 
          </span>
          <p v-show="item.album"> 
            <i class="material-icons meta">album</i> {{ item.album }} 
          </p>
          <md-divider class="md-inset"></md-divider>
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
      searchResults: {}
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
      this.$http.get(
        '/search/' + this.searchKeywords,
      ).then(
        response => {
          this.searchResults = response.body.searchResults
        }
      )
    },
    playSearchResult (index) {
      this.$root.$store.dispatch('setNextSong', this.searchResults[index])
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
