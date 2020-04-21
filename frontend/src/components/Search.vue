<template>
  <v-col class="search">
    <h2> {{ $t('menu.search') }} </h2>

    <v-text-field
      ref="searchField"
      :loading="loading"
      :label="$t('search.placeholder')"
      clearable
      @input="debouncedSearch"
      @click:clear="searchResults = []"
    />

    <v-list>
      <transition-group name="fade">
        <v-list-item
          v-for="song in searchResults"
          :key="song.id"
          class="pa-0"
          :two-line="!song.album ? true : false"
          :three-line="song.album ? true : false"
          :disabled="videoMode && !song.youtube ? true : false"
          @click="!song.isLoader ? play(song) : ''"
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
                  <v-skeleton-loader
                    v-show="song.songWidth"
                    type="text"
                    :style="song.songWidth"
                  />
                </v-list-item-title>
                <v-list-item-subtitle v-show="song.album">
                  <v-icon>mdi-album</v-icon>
                  {{ song.album }}
                  <v-skeleton-loader
                    v-show="song.albumWidth"
                    type="text"
                    :style="song.albumWidth"
                  />
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-icon>mdi-account</v-icon>
                  {{ song.artist }}
                  <v-skeleton-loader
                    v-show="song.artistWidth"
                    type="text"
                    :style="song.artistWidth"
                  />
                </v-list-item-subtitle>
              </v-col>

              <v-skeleton-loader
                class="mood-skeleton"
                type="button"
                :style="song.btnWidth"
              >
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
              </v-skeleton-loader>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </transition-group>
    </v-list>

    <v-col
      v-show="noResult"
      class="text-center"
    >
      <!-- eslint-disable -->
      <p class="emoji">(>_<)</p>
      <!-- eslint-enable -->

      <p>
        {{ $t('search.notFound') }} : <strong>{{ searchValue }}</strong>
      </p>
    </v-col>
  </v-col>
</template>

<script>
import _ from 'lodash'
import music from '../api/music'
import { mapState, mapActions } from 'vuex'

// Generating array of skeleton items with various width
const nbLoaders = 3,
      min = 75,
      max = 200,
      loaders = Array.from(Array(nbLoaders).keys()).map((val, index) => ({
        id: index,
        songWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
        albumWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
        artistWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
        btnWidth: `width: ${Math.max(max * Math.random(), min)}px;`,
        isLoader: true,
      }));

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
        this.searchResults = loaders
        this.noResult = false

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
.mood-skeleton {
  display: inline-flex;

  > button {
    flex-grow: 1;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
