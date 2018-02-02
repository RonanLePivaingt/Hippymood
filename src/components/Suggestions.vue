<template>
  <div id="suggestions">
    <span class="md-display-2">Suggestions</span>

    <p> Aucune suggestion transmise avec la graine {{ user.name }}. </p>

    <p> Fait ta 1ère suggestion avec le formulaire ci-dessous : </p>

    <form enctype="multipart/form-data" novalidate v-on:submit.prevent="submit">
      <md-tabs md-fixed>
        <md-tab id="addSong" md-label="Ajouter une chanson">
          <md-input-container>
            <label>Fichier MP3</label>
            <md-file v-model="newSuggestion.file" accept="audio/mpeg"></md-file>
          </md-input-container>

          <input v-model="newSuggestion.url" placeholder="URL de la vidéo">
          <md-checkbox v-model="newSuggestion.video" v-show="newSuggestion.url" type="checkbox">
            Utiliser cette chanson en mode vidéo ?
          </md-checkbox>
        </md-tab>


        <md-tab id="move" md-label="Reclasser une chanson">
          <md-input-container>
            <label>Choisir une chanson</label>
            <md-autocomplete
              v-model="newSuggestion.selectedMoods.songPath"
              :list="song"
              :fetch="fetchSong"
              :min-chars="2"
              @selected="songCallback"
              :debounce="200"></md-autocomplete>
          </md-input-container>
        </md-tab>
      </md-tabs>

      <md-chips v-model="newSuggestion.selectedMoods" v-show="newSuggestion.selectedMoods.length !== 0" class="inline mood-chips">
        <template scope="chip" slot="chip">
          <span>{{ chip.value.name }}</span>
        </template>
      </md-chips>

      <md-input-container class="inline">
        <label>Choisir une ou plusieurs mood</label>
        <md-autocomplete v-model="mood"
                         :list="alphaSortedMoods"
                         print-attribute="name"
                         :filter-list="moodFilter"
                         :min-chars="0"
                         :max-height="0"
                         @selected="moodCallback"
                         :debounce="200">
        </md-autocomplete>
      </md-input-container>

      <md-input-container>
        <md-icon>speaker_notes</md-icon>
        <label>Message</label>
        <md-textarea v-model="newSuggestion.message"></md-textarea>
      </md-input-container>

      <md-button @click="submit" class="md-raised md-accent">Envoyer la suggestion</md-button>
    </form>
    <!--
      TO DO :
      - Add a basic file upload
      - Add a dynamic video retriever for youtube
      - Validator
      - Possibility to suggest a new mood
      - Add indicators to guide the user through is suggestion
      - Auto reset incompatible fields
    -->
  </div>
</template>

<script>
// On mount search suggestions
export default {
  name: 'suggestions',
  data: function () {
    return {
      newSuggestion: {
        file: '',
        url: '',
        video: '',
        songPath: '',
        selectedMoods: [],
        message: '',
        status: ''
      },
      mood: '',
      song: []
    }
  },
  beforeMount: function () {
    // Redirecting non-identified users to login page
    if (this.user.id === 0) {
      this.$router.push('/Login')
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    moods: function () {
      return this.$store.state.moods
    },
    alphaSortedMoods: function () {
      // The mood array is duplicated to avoid a side effect on the order of moods under the player
      var moods = this.$store.state.moods.slice()

      return moods.sort(function (a, b) {
        return a.name.localeCompare(b.name)
      })
    }
  },
  methods: {
    moodFilter (list, query) {
      var arr = []

      for (var i = 0; i < list.length; i++) {
        // Checking if query match with the item
        if (list[i].name.indexOf(query) !== -1) {
          // Checking if moods hasn't been already selected
          var selected = false
          for (var j = 0; j < this.newSuggestion.selectedMoods.length; j++) {
            if (list[i].name.indexOf(this.newSuggestion.selectedMoods[j].name) !== -1) {
              selected = true
            }
          }

          if (selected === false) {
            arr.push(list[i])
          }
        }
      }

      return arr
    },
    moodCallback (item) {
      this.newSuggestion.selectedMoods.push(item)
      this.$nextTick(function () {
        this.mood = ''
      })
      console.log(item)
    },
    songCallback (item) {
      console.log(item)
      this.newSuggestion.songPath = item
    },
    fetchSong (param) {
      console.log(param.q)
      this.$http.get(
        '/search/' + param.q,
      ).then(
        response => {
          console.log(response)
          var songs = response.body.searchResults

          this.song = []
          for (var o = 0; o < songs.length; o++) {
            this.song.push({name: songs[o].song + ' par ' + songs[o].artist})
          }
          console.log(this.song)
        }
      )
    },
    submit () {
      window.vm.$Progress.start()
      this.$http.post(
        '/suggestion/',
        { suggestion: this.newSuggestion }
      ).then(
        response => {
          console.log(response)
        }
      )
    }
  }
}
</script>

<style>
input {
  display: block;
}
.mood-chips.md-input-container {
  margin-bottom: 0px;
}
.mood-chips .md-input input {
  display: none;
}
.mood-chips .md-input {
  display: none !important;
}
.md-input-container.mood-chips::after {
  height: 0px;
}
</style>
