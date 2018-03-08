<template>
  <div>
    <form class="suggestion-form" v-on:submit.prevent="submit">
      <md-tabs md-fixed v-if="state == 'creation'">
        <md-tab id="add-song" md-label="Ajouter une chanson">

          <md-input-container>
            <label>Nom de la suggestion</label>
            <md-input v-model="suggestion.title"></md-input>
          </md-input-container>

          <p class="source-separator" :class="{ 'md-input-invalid': errors.song }">
            <md-icon>info_outline</md-icon>
             Il faut reseigner au moins un fichier de musique ou une vidéo
          </p>

          <vue-clip
            ref="vc"
            :options="upload"
            :on-total-progress="totalProgress"
            :on-complete="complete"
            :class="{ 'md-input-invalid': errors.song }"
            >
            <template slot="clip-uploader-action">
              <div v-show="upload.progress === 0">
                <div class="dz-message">
                  <div class="file-upload">
                    <md-button class="md-fab" @click="restartProgress" :class="{ 'md-primary': upload.done }">
        <md-icon v-if="!upload.done">cloud_upload</md-icon>
        <md-icon v-if="upload.done">done</md-icon>
      </md-button>

      <md-spinner :md-size="74" :md-stroke="2.2" :md-progress="upload.progress" v-if="upload.transition && upload.progress < 115"></md-spinner>
                  </div>
                  <p>
                    Clique ou dépose un fichier MP3 ici
                  </p>
                </div>
              </div>
            </template>

            <template slot="clip-uploader-body" scope="props">
              <md-list class="downloaded-files" v-for="file in props.files" :key="file.name">
                <div class="file-upload">
                  <md-button class="md-fab md-secondary">
                    <md-icon v-if="!upload.done">cloud_upload</md-icon>
                    <md-icon v-if="upload.done">done</md-icon>
                  </md-button>

                  <md-spinner :md-size="74" :md-stroke="2.2" :md-progress="upload.progress" v-if="upload.transition && upload.progress < 115"></md-spinner>
                </div>
                <audio controls="controls">
                   <source v-if="suggestion.file" :src="'/' + suggestion.file.customAttributes.path" type="audio/mpeg"/>
                </audio>
                <md-button class="md-fab md-clean" title="Supprimer le fichier" @click="removeFile(file)">
                  <md-icon>delete</md-icon>
                </md-button>
              </md-list>
            </template>
          </vue-clip>

          <md-input-container :class="{ 'md-input-invalid': errors.song === true}">
            <label>URL d'une vidéo youtube</label>
            <md-input v-model="suggestion.url" @blur="checkError('song')"></md-input>
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

        <!--
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
        -->
      </md-tabs>

      <md-input-container :class="{ 'md-input-invalid': errors.songName }">
        <md-icon>audiotrack</md-icon>
        <label>Nom de la chanson</label>
        <md-input required v-model="suggestion.songName" @blur="checkError('songName')"></md-input>
      </md-input-container>

      <md-input-container :class="{ 'md-input-invalid': errors.artist }">
        <md-icon>person</md-icon>
        <label>Artiste</label>
        <md-input required v-model="suggestion.artist" @blur="checkError('artist')"></md-input>
      </md-input-container>

      <md-input-container>
        <md-icon>album</md-icon>
        <label>Album</label>
        <md-input v-model="suggestion.album"></md-input>
      </md-input-container>

      <md-chips v-model="suggestion.selectedMoods" v-show="suggestion.selectedMoods.length !== 0" class="mood-chips" md-input-placeholder="Tu peux aussi taper le nom d'une nouvelle mood (Il faut au moins 5 chansons pour créer une nouvelle mood)">
        <template scope="chip" slot="chip">
          <span v-if="chip.value.name">{{ chip.value.name }}</span>
          <span v-if="!chip.value.name">{{ chip.value }} (N'existe pas encore)</span>
        </template>
      </md-chips>

      <md-input-container :class="{ 'md-input-invalid': errors.selectedMoods }">
        <label>Choisir parmi les moods existantes</label>
        <md-autocomplete v-model="mood"
                         :list="alphaSortedMoods"
                         print-attribute="name"
                         :filter-list="moodFilter"
                         :min-chars="0"
                         :max-height="0"
                         @selected="moodCallback"
                         @change="checkError('moods')"
                         :debounce="200"
                         :required="errors.selectedMoods === true">
        </md-autocomplete>
      </md-input-container>

      <md-input-container>
        <md-icon>speaker_notes</md-icon>
        <label>Message</label>
        <md-textarea v-model="suggestion.message"></md-textarea>
      </md-input-container>

      <div class="submit">
        <md-button @click="submit" class="md-raised md-accent" :disabled="errorNumber > 0">
          <span v-if="state === 'creation'">Envoyer la suggestion</span>
          <span v-if="state === 'response'">Répondre</span>
        </md-button>
      </div>
    </form>

    <!--
      TO DO :
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
      upload: {
        url: '/suggestion',
        paramName: 'file',
        maxFiles: 42,
        progress: 0,
        done: false,
        transition: true,
        progressInterval: 0
      },
      errors: {
        song: false,
        songName: false,
        artist: false,
        selectedMoods: false
      }
    }
  },
  beforeMount: function () {
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
    },
    errorNumber: function () {
      var errorArray = Object.values(this.errors)
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      return errorArray.reduce(reducer)
    }
  },
  methods: {
    totalProgress (progress, totalBytes, bytesSent) {
      this.upload.progress = progress

      if (this.upload.progress === 100) {
        this.upload.done = true
      }
    },
    restartProgress () {
      this.upload.transition = false
      this.upload.done = false

      window.clearInterval(this.upload.progressInterval)
      window.setTimeout(() => {
        this.upload.transition = true
      }, 600)
    },
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
    checkErrors () {
      this.checkError('song')
      this.checkError('songName')
      this.checkError('artist')
      this.checkError('moods')
    },
    checkError (type) {
      var data = this.suggestion

      if (this.state === 'creation') {
        switch (type) {
          case 'song':
            if (data.url === '' && data.file.customAttributes === undefined) {
              this.errors.song = true
            } else {
              this.errors.song = false
            }
            break
          case 'songName':
            if (data.songName === '') {
              this.errors.songName = true
            } else {
              this.errors.songName = false
            }
            break
          case 'artist':
            if (data.artist === '') {
              this.errors.artist = true
            } else {
              this.errors.artist = false
            }
            break
          case 'moods':
            if (Object.keys(data.selectedMoods).length === 0) {
              this.errors.selectedMoods = true
            } else {
              this.errors.selectedMoods = false
            }
            break
        }
      }
    },
    submit (e) {
      // Form validation
      this.checkErrors()

      if (this.errorNumber) {
        window.vm.$Progress.start()

        var url = '/suggestion/'

        // Adding suggestion ID to request to tell
        if (this.state !== 'creation') {
          this.suggestion.id = this.message.id_suggestion
          url = '/suggestion/message/' + this.id
        }

        this.$http.post(
          url,
          { suggestion: this.suggestion }
        ).then(
          response => {
            this.$root.$store.dispatch('askSuggestions')
          }
        )
      }
    },
    complete (file, status, xhr) {
      var response = JSON.parse(xhr.response.replace(/\\\//g, '/'))

      file.addAttribute('filename', response.file.filename)
      file.addAttribute('path', response.file.path)
      file.addAttribute('originalname', response.file.originalname)

      this.suggestion.file = file

      this.checkError('song')
    },
    removeFile (file) {
      if (this.$refs) {
        this.$refs.vc.files.pop()
      }

      this.$http.post(
        '/suggestion/deleteFile',
        { filename: file.customAttributes.filename }
      ).then(
        response => {
          this.suggestion.file = ''
          this.upload.progress = 0
          this.upload.done = false
          this.errors.song = true
        }
      )
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
div:not(.md-tabs) .md-input-container,
div:not(.md-tabs) .md-checkbox-container,
div:not(.md-tabs) .source-separator
{
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
.file-upload {
  width: 56px;
  height: 56px;
  position: relative;
}

.file-upload  .md-fab {
  margin: 0;
}

.file-upload .md-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dz-message {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}
.dz-message > p {
  display: inline-block;
  margin-left: 0.5rem;
}

ul.downloaded-files {
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}
ul.downloaded-files audio {
  margin-left: 2rem;
  width: 80%;
}
.source-separator:not(i) {
  color: rgba(0, 0, 0, 0.7);
}
.md-input-invalid,
.source-separator .md-input-invalid,
.source-separator.md-input-invalid i.material-icons
{
  color: #ff5722 !important;
}
.submit {
  display: block;
  width: 100%;
  text-align: right;
}
</style>
