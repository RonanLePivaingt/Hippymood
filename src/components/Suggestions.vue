<template>
  <div id="suggestions">
    <span class="md-display-2">Suggestions</span>

    <div v-if="suggestions.length === 0">
      <p> Tu n'as pas de suggestion avec la graine <b>{{ user.name }}</b>.</p>

      <p> Fait ta 1ère suggestion avec le formulaire ci-dessous : </p>
    </div>

    <md-list v-if="suggestions.length > 0">
      <md-list-item v-for="suggestion in suggestions">
        <span>{{ suggestion.file }}</span>

        <md-list-expand md-list-expand-multiple>
          <md-list>
              <md-list-item class="md-inset" v-for="message in messages[suggestion.id]">
                <md-icon>message</md-icon>
                <span>{{ message.content }}</span>
                <md-chip v-for="mood in JSON.parse(message.suggestion_moods)">{{mood.name}}</md-chip>
              </md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>

    <form v-on:submit.prevent="submit">
      <md-tabs md-fixed>
        <md-tab id="addSong" md-label="Ajouter une chanson">
          <md-input-container>
            <label>Tu peux donner un nom à ta suggestion</label>
            <md-input v-model="newSuggestion.title"></md-input>
          </md-input-container>

          <vue-clip
            ref="vc"
            :options="uploadOptions"
            :on-added-file="addedFile"
            :on-removed-file="removeFile"
            :on-complete="complete"
            >
            <template slot="clip-uploader-action">
              <div>
                <div class="dz-message">
                  <p>
                    <md-icon>file_upload</md-icon>
                    Cliquer ou déposer un fichier MP3 ici
                  </p>
                </div>
              </div>
            </template>

            <template slot="clip-uploader-body" scope="props">
              <md-list v-for="file in props.files">
                <md-list-item>
                  {{ file.name }} {{ file.status }} {{ file.errorMessage }}
                  <md-icon @click="removeFile(file)">delete_forever</md-icon>
                </md-list-item>
              </md-list>
            </template>
          </vue-clip>


          <md-input-container>
            <label>URL d'une vidéo youtube</label>
            <md-input v-model="newSuggestion.url"></md-input>
          </md-input-container>

          <md-checkbox v-model="newSuggestion.video" v-show="newSuggestion.url" type="checkbox">
            Utiliser cette chanson en mode vidéo ?
          </md-checkbox>

          <youtube
            v-if="newSuggestion.url"
            :video-id="videoId"
            >
          </youtube>
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

      <md-input-container>
        <md-icon>audiotrack</md-icon>
        <label>Nom de la chanson</label>
        <md-input v-model="newSuggestion.songName"></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon>person</md-icon>
        <label>Artiste</label>
        <md-input v-model="newSuggestion.artist"></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon>album</md-icon>
        <label>Album (optionnel)</label>
        <md-input v-model="newSuggestion.album"></md-input>
      </md-input-container>

      <md-chips v-model="newSuggestion.selectedMoods" v-show="newSuggestion.selectedMoods.length !== 0" class="mood-chips" md-input-placeholder="Tu peux aussi taper le nom d'une nouvelle mood (Il faut au moins 5 chansons pour créer une nouvelle mood)">
        <template scope="chip" slot="chip">
          <span v-if="chip.value.name">{{ chip.value.name }}</span>
          <span v-if="!chip.value.name">{{ chip.value }} (N'existe pas encore)</span>
        </template>
      </md-chips>

      <md-input-container>
        <label>Choisir parmi les moods existantes</label>
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
      - Validator
      - Possibility to suggest a new mood
      - Add indicators to guide the user through is suggestion
      - Auto reset incompatible fields
    -->
  </div>
</template>

<script>
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
          this.$root.$store.dispatch('askSuggestions')
        }
      )
    },
    addedFile (file) {
      this.newSuggestion.file = file
    },
    removeFile (file) {
      console.log(file)
      this.$refs.vc.removeFile(file)
      // Should remove file on server as well
    },
    complete (file, status, xhr) {
      // Adding server id to be used for deleting
      // the file.
      // var serverResponse = JSON.parse(xhr.response.file)
      var response = JSON.parse(xhr.response.replace(/\\\//g, '/'))
      console.log(response.file)
      file.addAttribute('serverpath', response.file.path)
      file.addAttribute('originalname', response.file.originalname)
      console.log(file)
    }
  }
}
</script>

<style slot-scope>
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
  /* display: none !important; */
}
.md-input-container.mood-chips::after {
  height: 0px;
}
div:not(.md-tabs) .md-input-container {
  margin-left: 16px;
  margin-right: 16px;
}
.dz-clickable {
  cursor: pointer;
  border: 2px dashed #0087F7;
  border-radius: 5px;
  margin: auto 0;
  margin-bottom: 1rem;
}
.dz-clickable i {
  color: rgba(0, 0, 0, 0.5);
}
.dz-clickable p {
  text-align: center;
}
</style>
