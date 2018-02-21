<template>
  <div id="suggestions">
    <span class="md-display-2">Suggestions</span>

    <div v-if="suggestions.length === 0">
      <p> Tu n'as pas de suggestion avec la graine <b>{{ user.name }}</b>.</p>

      <p> Fait ta 1ère suggestion avec le formulaire ci-dessous : </p>
    </div>

    <md-list v-if="suggestions">
      <md-list-item v-for="(suggestion, suggestionId) in suggestions">
        <span v-if="suggestion.title">{{ suggestion.title }}</span>
        <span v-if="!suggestion.title">{{ suggestion.file }}</span>
        <span> par user {{ suggestion.id_user }}</span>

        <md-list-expand md-list-expand-multiple>
          <md-list v-for="(message, index) in suggestion.messages">
            <suggestion-message :message="message"></suggestion-message>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>

    <suggestion-form state="creation"></suggestion-form>

    <!--
      TO DO :
      - Validator
      - Possibility to suggest a new mood
      - Add indicators to guide the user through is suggestion
      - Auto reset incompatible fields
    -->
  </div>
</template>

<script>
import SuggestionForm from './suggestions/Form'
import SuggestionMessage from './suggestions/Message'
function youtubeVideoId (url) {
  var videoId = url.split('v=')[1]
  var ampersandPosition = videoId.indexOf('&')
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition)
  }
  return videoId
}
// On mount search suggestions
export default {
  name: 'suggestions',
  components: {
    SuggestionForm,
    SuggestionMessage
  },
  data: function () {
    return {
      newSuggestion: {
        title: '',
        file: '',
        url: '',
        video: false,
        songPath: '',
        selectedMoods: [],
        songName: '',
        artist: '',
        album: '',
        message: '',
        status: ''
      },
      mood: '',
      song: [],
      uploadOptions: {
        url: '/suggestion',
        paramName: 'file',
        maxFiles: 1
      }
    }
  },
  beforeMount: function () {
    if (this.$store.state.user.id === undefined) {
      // Redirecting non-identified users to login page
      this.$router.push('/Login')
    } else {
      // Getting the list of suggestions made
      this.$root.$store.dispatch('askSuggestions')
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    suggestions: function () {
      return this.$store.state.suggestions
    },
    messages: function () {
      return this.$store.state.messages
    },
    videoId: function () {
      return youtubeVideoId(this.newSuggestion.url)
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
    }
  }
}
</script>

<style slot-scope>
</style>
