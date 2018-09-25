<template>
  <div id="suggestion-reply">
    <div class="back">
      <md-button class="md-raised md-primary" href="#/suggestions" >
        <i class="material-icons">keyboard_backspace</i> Revenir aux suggestions
      </md-button>
    </div>

    <div class="title">
      <span class="md-display-2">Suggestion {{ suggestion.title }}</span>

      <md-chip v-if="suggestion.status === 'waiting'">En attente</md-chip>
      <md-chip v-else-if="suggestion.status === 'discussion'" class="md-primary discussion">En discussion</md-chip>
      <md-chip v-else-if="suggestion.status === 'being-added'" class="md-accent accepted">En cours d'ajout</md-chip>
      <md-chip v-else-if="suggestion.status === 'accepted'" class="md-accent accepted">Ajouté</md-chip>
      <md-chip v-else-if="suggestion.status === 'refused'" class="md-accent declined">Recalé</md-chip>
    </div>

    <youtube
      v-if="videoId"
      :video-id="videoId"
      >
    </youtube>
    <audio controls="controls">
       <source :src="suggestion.file" type="audio/mpeg"/>
    </audio>

    <div v-for="(message, index) in suggestion.messages">
      <md-list>
        <suggestion-message :message="message"></suggestion-message>
      </md-list>

      <suggestion-form
        v-if="index === suggestion.messages.length - 1"
        state="response"
        :message="message"
        ></suggestion-form>
    </div>
  </div>
</template>

<script>
import SuggestionForm from './Form'
import SuggestionMessage from './Message'
import YoutubeUrl from 'youtube-url'

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
    suggestion: function () {
      return this.$store.state.suggestions[this.suggestionId]
    },
    videoId: function () {
      return YoutubeUrl.extractId(this.suggestion.url)
    }
  }
}
</script>

<style slot-scope>
audio {
  width: 100%;
}
#suggestion-reply .title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
</style>
