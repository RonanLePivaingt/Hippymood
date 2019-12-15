<template>
  <v-col>
    <h2> Search </h2>

    <v-text-field
      label="Song, artist or album name"
      @input="debouncedSearch"
      @click:clear="searchResults = []"
      :loading="loading"
      ref="searchField"
      clearable></v-text-field>

    <v-list-item
      v-for="song in searchResults"
      :key="song.id"
      @click="play(song)"
      three-line>
      <v-list-item-content>
        <v-list-item-title>
          <v-icon>mdi-music-note</v-icon>
          {{ song.song }}
        </v-list-item-title>
        <v-list-item-subtitle v-show="song.album">
          <v-icon>mdi-album</v-icon>
          {{ song.album }}
        </v-list-item-subtitle>
        <v-list-item-subtitle>
          <v-icon>mdi-account</v-icon>
          {{ song.artist }}
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-content>

        <v-btn
          class="mood-btn"
          >
          {{ song.mood }}
        </v-btn>

      </v-list-item-content>
    </v-list-item>

    <v-col v-show="noResult">
      <!-- eslint-disable -->
      <p class="emoji ma-4">(>_<)</p>
      <!-- eslint-enable -->

      <p> No search result for : {{ searchValue }} </p>
    </v-col>
  </v-col>
</template>

<script>
import _ from 'lodash'
import music from '../api/music'
import { mapActions } from 'vuex'

export default {
  name: 'Search',
  data: () => ({
    loading: false,
    searchResults: [],
    searchValue: '',
    noResult: false
  }),
  created () {
    this.debouncedSearch = _.debounce(this.search, 300);
  },
  mounted () {
    // Focus on the search field after the component is rendered
    this.$nextTick(() => {
      this.$refs.searchField.focus()
    })
  },
  methods: {
    ...mapActions('music', [ 'playSearchSong' ]),
    search(val) {
      if (val) {
        this.loading = true
        this.searchValue = val

        music.search(val).then(res => {
          this.loading = false

          if (Array.isArray(res.data)) {
            this.searchResults = res.data
            this.noResult = false
          } else {
            this.searchResults = []
            this.noResult = true
          }
        })
      }
    },
    play(song) {
      this.playSearchSong(song)
      this.$router.push('/')
    }
  }
};
</script>
