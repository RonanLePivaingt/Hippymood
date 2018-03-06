<template>
  <md-list-item class="list-message" v-bind:class="{ admin: this.message.id_user !== this.$store.state.user.id }">
    <div class="column">
      <p>
        <md-icon>message</md-icon> {{ message.content }}
      </p>
      <div>
        <div>
          <i class="material-icons meta">audiotrack</i>
          <span> {{ message.song_name }} </span>
        </div>
        <div v-show="message.album">
          <i class="material-icons meta">album</i>
          <span> {{ message.album }} </span>
          </br>
        </div>
        <div>
          <i class="material-icons">person</i>
          <span> {{ message.artist }} </span>
        </div>
      </div>
    </div>
      <md-button class="response" v-if="reply == 'true'" @click="response(suggestionId)">Répondre</md-button>
  </md-list-item>
</template>

<script>
// On mount search suggestions
export default {
  name: 'suggestion-message',
  props: ['message', 'reply'],
  data: function () {
    return {
      suggestionId: this.message.id_suggestion
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    suggestion: function () {
      return this.$store.state.suggestion[this.suggestionId]
    },
    suggestionMoods: function () {
      // HACK : This should be removed after testing and the received data should be JSON
      if (typeof this.message.suggestion_moods === 'string') {
        return JSON.parse(this.message.suggestion_moods)
      } else {
        return this.message.suggestion_moods
      }
    }
  },
  methods: {
    response (messageId) {
      // Redirecting to the response page
      this.$router.push('/Suggestions/' + messageId)
    }
  }
}
</script>

<style slot-scope>
.list-message .md-list-item-container {
  flex-flow: column nowrap !important;
}
.list-message .md-list-item-container:not(.admin) {
  width: 100%;
  align-items: start;
}
button.response {
  float: right;
}
</style>
