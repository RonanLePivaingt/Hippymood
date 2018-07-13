<template>
  <md-list-item class="list-message" v-bind:class="{ admin: this.message.id_user !== this.$store.state.user.id }">
    <div class="message-row">
      <md-avatar class="md-large">
        <trianglify :seed="message.id_user" :width="100" :height="100" :cellSize="10" class="avatar" />
      </md-avatar>
      <div class="column">
        <div>
          <div v-show="message.song_name">
            <i class="material-icons meta">audiotrack</i>
            <span> {{ message.song_name }} </span>
          </div>
          <div v-show="message.album">
            <i class="material-icons meta">album</i>
            <span> {{ message.album }} </span>
            </br>
          </div>
          <div v-show="message.artist">
            <i class="material-icons">person</i>
            <span> {{ message.artist }} </span>
          </div>
        </div>

        <md-chips md-static v-model="suggestionMoods" v-show="suggestionMoods.length !== 0" class="mood-chips">
          <template scope="chip" slot="chip">
            <span v-if="chip.value.name">{{ chip.value.name }}</span>
            <span v-if="!chip.value.name">{{ chip.value }} (N'existe pas encore)</span>
          </template>
        </md-chips>

        <p v-show="message.content">
          <md-icon>message</md-icon> {{ message.content }}
        </p>
        <div class="actions">
          <md-button class="md-warn" v-if="reply == 'true'" @click="$emit('open-delete-suggestion', suggestionId)">Supprimer</md-button>
          <md-button v-if="reply == 'true'" @click="response(suggestionId)">Répondre</md-button>
        </div>
      </div>
    </div>

  </md-list-item>
</template>

<script>
import {Trianglify} from 'vue-trianglify'
export default {
  name: 'suggestion-message',
  props: ['message', 'reply'],
  components: {
    Trianglify
  },
  data: function () {
    return {
      suggestionId: this.message.id_suggestion,
      deleteSuggestionId: 0
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
.list-message .message-row, .list-message .column {
  width: 100%;
}
.list-message .md-list-item-container:not(.admin) {
  width: 100%;
  align-items: start;
}
div.actions {
  float: right;
}
.avatar {
}
.message-row {
  display: flex;
}
</style>
