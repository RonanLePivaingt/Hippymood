<template>
  <md-list-item class="md-inset">
    <md-icon>message</md-icon>
    <span>{{ message.content }}</span>
    <md-chip v-for="mood in suggestionMoods">{{mood.name}}</md-chip>

    <md-button v-if="user.masterUser" @click="response(message.id)">Répondre</md-button>
  </md-list-item>
</template>

<script>
// On mount search suggestions
export default {
  name: 'suggestion-message',
  props: ['message'],
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
</style>
