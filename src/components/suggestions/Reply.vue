<template>
  <div id="suggestion-reply">
    <div class="back">
      <md-button class="md-raised md-accent" href="#/suggestions" >
        <i class="material-icons">keyboard_backspace</i> Revenir aux suggestion
      </md-button>
    </div>

    <span class="md-display-2">Suggestion {{ suggestion.title }}</span>

    <youtube
      v-if="videoId"
      :video-id="videoId"
      >
    </youtube>
    <audio controls="controls">
       <source :src="suggestion.file" type="audio/mpeg"/>
    </audio>

    <span class="md-display-1">Messages précédents</span>
    <div v-for="(message, index) in suggestion.messages">
      <md-list>
        <suggestion-message :message="message"></suggestion-message>
      </md-list>

      <suggestion-form
        v-if="index === suggestion.messages.length - 1"
        state="response"
        :message="message"
        ></suggestion-form></div>
  </div>
</template>

<script>
import SuggestionForm from './Form'
import SuggestionMessage from './Message'
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
  name: 'suggestion-reply',
  props: ['state'],
  components: {
    SuggestionForm,
    SuggestionMessage
  },
  data: function () {
    return {
      suggestionId: this.$route.params.id
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    suggestionId: function () {
      return this.$store.state.messages[this.messageId][0].id_suggestion
    },
    suggestion: function () {
      return this.$store.state.suggestions[this.suggestionId]
    },
    videoId: function () {
      if (this.suggestion.url) {
        return youtubeVideoId(this.suggestion.url)
      } else {
        return ''
      }
    }
  }
}
</script>

<style slot-scope>
audio {
  width: 100%;
}
</style>
