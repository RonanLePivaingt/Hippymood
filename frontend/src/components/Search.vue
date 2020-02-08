<template>
  <v-col class="search">
    <h2> Search </h2>

    <v-text-field
      ref="searchField"
      :loading="loading"
      label="Chanson, album ou artiste"
      clearable
      @input="debouncedSearch"
      @click:clear="searchResults = []"
    />

    <v-list>
      <v-list-item
        v-for="song in searchResults"
        :key="song.id"
        class="pa-0"
        :two-line="!song.album ? true : false"
        :three-line="song.album ? true : false"
        :disabled="videoMode && !song.youtube ? true : false"
        @click="play(song)"
      >
        <v-list-item-content class="pa-0">
          <v-row
            class="pr-1 ma-0"
            justify="space-between"
            align="center"
          >
            <v-col class="metadata flex-wrap pl-0">
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
            </v-col>

            <v-btn
              :disabled="videoMode && !song.youtube ? true : false"
            >
              <v-icon
                v-show="videoMode && song.youtube"
                left
              >
                mdi-youtube
              </v-icon>
              {{ song.mood }}
            </v-btn>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-col
      v-show="noResult"
      class="text-center"
    >
      <!-- eslint-disable -->
      <p class="emoji">(>_<)</p>
      <!-- eslint-enable -->

      <p> No search result for : {{ searchValue }} </p>
    </v-col>
  </v-col>
</template>

<script>
import _ from 'lodash'
import music from '../api/music'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Search',
  data: () => ({
    loading: false,
    searchResults: [],
    searchValue: '',
    noResult: false
  }),
  computed: mapState('music', [
    'videoMode',
  ]),
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
    ...mapActions('music', [ 'playNextSong' ]),
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
      this.playNextSong(song)
      this.$router.push('/')
    }
  }
};
</script>

<style lang="scss">
.search {
  .v-list {
    background: transparent;
  }

  .metadata {
    overflow: hidden;

    .v-list-item__subtitle {
      display: inherit;
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .emoji {
    font-size: 8rem;
    color: rgba(0, 0, 0, 0.54);

    .theme--dark & {
      color: rgba(255, 255, 255, 0.54);
    }
  }

  .v-btn > .v-btn__content .v-icon.theme--light {
    color: rgba(0, 0, 0, 0.54);
  }
}
</style>
