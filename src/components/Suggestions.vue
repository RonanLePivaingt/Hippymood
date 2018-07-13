<template>
  <div id="suggestions">
    <div class="back">
      <md-button class="md-raised md-accent dark-background" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <span class="md-display-2">Suggestions</span>

    <div v-if="suggestions.length === 0">
      <p> Tu n'as pas de suggestion avec la graine <b>{{ user.name }}</b>.</p>
    </div>

    <md-list v-if="suggestions">
      <md-list-item v-for="(suggestion, suggestionId) in suggestions" :key="suggestion.id">
        <span v-if="suggestion.title">{{ suggestion.title }}</span>
        <span v-if="!suggestion.title">{{ suggestion.file }}</span>
        <span> par {{ suggestion.messages[0].name }}</span>

        <md-list-expand md-list-expand-multiple>
          <md-list>
            <youtube
              v-if="suggestion.url"
              :video-id="videoId(suggestion.url)"
              :height="390"
              >
            </youtube>
            <audio v-if="suggestion.file" controls="controls">
               <source :src="suggestion.file" type="audio/mpeg"/>
            </audio>
          </md-list>
          <md-list v-for="(message, index) in suggestion.messages" :key="message.id">
            <suggestion-message :message="message" v-if="index < suggestion.messages.length - 1"></suggestion-message>
            <suggestion-message
              :message="message"
              reply="true"
              v-on:open-delete-suggestion="openDeleteSnack($event)"
              v-else></suggestion-message>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="5000">
      <span>Est-tu sûr de vouloir supprimer la suggestion ?</span>
      <md-button class="md-accent" @click="deleteSuggestion()">Supprimer</md-button>
    </md-snackbar>

    <suggestion-form state="creation" v-show="showForm"></suggestion-form>

    <div class="show-form">
      <md-button class="md-raised md-accent" @click="showForm = !showForm">
        + Faire une nouvelle suggestion
      </md-button>
    </div>

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
  if (videoId === undefined) {
    videoId = ''
  }
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
      mood: '',
      song: [],
      uploadOptions: {
        url: '/suggestion',
        paramName: 'file',
        maxFiles: 1
      },
      showForm: false,
      deleteSuggestionId: 0,
      position: 'bottom center',
      duration: '5000'
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
    videoId (url) {
      return youtubeVideoId(url)
    },
    openDeleteSnack (id) {
      this.deleteSuggestionId = id
      this.$refs.snackbar.open()
    },
    deleteSuggestion () {
      this.$refs.snackbar.close()

      var url = '/suggestion/deleteSuggestion/' + this.deleteSuggestionId

      this.$http.post(
        url
      ).then(
        response => {
          this.$root.$store.dispatch('askSuggestions')
        }
      )
    }
  }
}
</script>

<style slot-scope>
div.show-form {
  display: inline-block;
  width: 100%;
  height: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}
div.show-form > button {
  float: right;
}
</style>
