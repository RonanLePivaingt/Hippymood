<template>
  <div>
    <form v-on:submit.prevent="submit">
      <md-tabs md-fixed v-if="state === 'creation'">
        <md-tab id="addSong" md-label="Ajouter une chanson">
          <md-input-container>
            <label>Tu peux donner un nom à ta suggestion</label>
            <md-input v-model="suggestion.title"></md-input>
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
            <md-input v-model="suggestion.url"></md-input>
          </md-input-container>

          <md-checkbox v-model="suggestion.video" v-show="suggestion.url" type="checkbox">
            Utiliser cette chanson en mode vidéo ?
          </md-checkbox>

          <youtube
            v-if="suggestion.url"
            :video-id="videoId"
            >
          </youtube>
        </md-tab>

        <md-tab id="move" md-label="Reclasser une chanson">
          <md-input-container>
            <label>Choisir une chanson</label>
            <md-autocomplete
              v-model="suggestion.selectedMoods.songPath"
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
        <md-input v-model="suggestion.songName"></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon>person</md-icon>
        <label>Artiste</label>
        <md-input v-model="suggestion.artist"></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon>album</md-icon>
        <label>Album (optionnel)</label>
        <md-input v-model="suggestion.album"></md-input>
      </md-input-container>

      <md-chips v-model="suggestion.selectedMoods" v-show="suggestion.selectedMoods.length !== 0" class="mood-chips" md-input-placeholder="Tu peux aussi taper le nom d'une nouvelle mood (Il faut au moins 5 chansons pour créer une nouvelle mood)">
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
        <md-textarea v-model="suggestion.message"></md-textarea>
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
  name: 'suggestion-form',
  props: ['state', 'message'],
  data: function () {
    return {
      suggestion: {
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
      id: this.$route.params.id,
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
    if (this.message) {
      // Populate with the current data
      this.suggestion.songName = this.message.song_name
      this.suggestion.artist = this.message.artist
      this.suggestion.album = this.message.album
      this.suggestion.selectedMoods = JSON.parse(this.message.suggestion_moods)
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    videoId: function () {
      return youtubeVideoId(this.suggestion.url)
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
          for (var j = 0; j < this.suggestion.selectedMoods.length; j++) {
            if (list[i].name.indexOf(this.suggestion.selectedMoods[j].name) !== -1) {
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
      this.suggestion.selectedMoods.push(item)
      this.$nextTick(function () {
        this.mood = ''
      })
    },
    songCallback (item) {
      this.suggestion.songPath = item
    },
    fetchSong (param) {
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

      var url = '/suggestion/'

      // Adding suggestion ID to request to tell
      if (this.state !== 'creation') {
        this.suggestion.id = this.message.id_suggestion
        url = '/suggestion/' + this.id
      }

      this.$http.post(
        url,
        { suggestion: this.suggestion }
      ).then(
        response => {
          this.$root.$store.dispatch('askSuggestions')
        }
      )
    },
    addedFile (file) {
      this.suggestion.file = file
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
    },
    response (messageId) {
      // Redirecting to the response page
      this.$router.push('/Suggestions/' + messageId)
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
iframe {
  width: 100%;
}
</style>

