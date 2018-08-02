<template>
  <div id="suggestions">
    <div class="back">
      <md-button class="md-raised md-primary dark-background" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <span class="md-display-2">Suggestions</span>

    <transition name="fade">
      <div class="loading" v-show="!error && loading">
        <md-spinner :md-size="150" md-indeterminate></md-spinner>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="suggestions.length === 0 && loading == false">
        <p> Tu n'as pas de suggestion avec la graine <b>{{ user.name }}</b>.</p>
      </div>
    </transition>

    <transition name="fade">
      <md-list v-if="suggestions && loading == false">
        <md-list-item v-for="(suggestion, suggestionId) in suggestions" :key="suggestion.id">
          <div class="suggestion-resume">
            <div>
              <span v-if="suggestion.title">{{ suggestion.title }}</span>
              <span v-if="!suggestion.title">{{ suggestion.file }}</span>

              <span v-if="user.masterUser"> par {{ suggestion.messages[0].name }}</span>
            </div>

            <md-chip v-if="suggestion.status === 'waiting'">En attente</md-chip>
            <md-chip v-else-if="suggestion.status === 'discussion'" class="md-primary discussion" >En discussion</md-chip>
            <md-chip v-else-if="suggestion.status === 'being-added'" class="md-accent accepted">En cours d'ajout</md-chip>
            <md-chip v-else-if="suggestion.status === 'accepted'" class="md-accent accepted" >Ajouté</md-chip>
            <md-chip v-else-if="suggestion.status === 'refused'" class="md-accent declined">Recalé</md-chip>
          </div>

          <md-list-expand md-list-expand-multiple>
            <md-list>
              <youtube
                v-if="suggestion.url"
                :video-id="videoId(suggestion.url)"
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
    </transition>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="5000">
      <span>Est-tu sûr de vouloir supprimer la suggestion ?</span>
      <md-button class="md-accent" @click="deleteSuggestion()">Supprimer</md-button>
    </md-snackbar>

    <div class="show-form">
      <md-button class="md-raised md-accent" @click="showForm = !showForm">
        <md-icon v-show="!showForm">keyboard_arrow_down</md-icon>
        <md-icon v-show="showForm">keyboard_arrow_up</md-icon>
        Faire une nouvelle suggestion
      </md-button>
    </div>

    <transition name="fade">
      <div v-show="showForm">
        <md-toolbar>
          <h2 class="md-title" style="flex: 1">Ajouter une chanson </h2>
        </md-toolbar>
        <suggestion-form state="creation" v-on:close-me="showForm = false"></suggestion-form>
      </div>
    </transition>

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
    loading: function () {
      return this.$store.state.loadingSuggestions
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
.md-primary.discussion {
  background-color: #2196f3 !important;
}
.md-accent.accepted {
  color: rgba(0, 0, 0, 0.7) !important;
  background-color: #62c643e6 !important;
}
.md-accent.declined {
  background-color: #cf3131 !important;
}
.suggestion-resume {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.holiday-message {
  display: flex;
}
.holiday-message i {
  margin-right: 1rem;
}
</style>
