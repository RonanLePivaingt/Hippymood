<template>
  <v-col class="search">
    <h2> {{ $t('menu.search') }} </h2>

    <v-text-field
      ref="searchField"
      :loading="loading"
      :label="$t('search.placeholder')"
      clearable
      @input="debouncedSearch"
      @click:clear="clear"
    />

    <div class="loaders-no-overflow">
      <v-list class="loaders-container">
        <transition-group name="search">
          <loading-item
            v-for="(song, index) in loaders"
            v-show="loading"
            :key="song.id"
            :song="song"
            :style="`transition-delay: ${loadersAnimationDelay(index)}ms;`"
          />
        </transition-group>
      </v-list>

      <v-list>
        <transition-group name="search">
          <song-item
            v-for="(song, index) in searchResults"
            v-show="!loading"
            :key="index"
            :song="song"
            :video-mode="videoMode"
            :style="`transition-delay: ${resultsAnimationDelay(index)}ms;`"
            @click="play(song)"
          />
        </transition-group>
      </v-list>

      <transition name="no-results">
        <v-col
          v-show="noResult"
          class="text-center"
          :style="`transition-delay: ${resultsAnimationDelay(0)}ms;`"
        >
          <!-- eslint-disable -->
          <p class="emoji">(>_<)</p>
          <!-- eslint-enable -->

          <p>
            {{ $t('search.notFound') }} : <strong>{{ searchValue }}</strong>
          </p>
        </v-col>
      </transition>
    </div>
  </v-col>
</template>

<script>
import _ from 'lodash'
import music from '../api/music'
import { mapState, mapActions } from 'vuex'
import bezierEasing from 'bezier-easing'
import LoadingItem from './list/LoadingItem'
import SongItem from './list/SongItem'
import axios from 'axios'

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
  }))

// Animations
const loadersAnimationTime = 400,
      loadersAnimationDuration = loadersAnimationTime / nbLoaders,
      resultsAnimationTime = 400

export default {
  name: 'Search',
  components: {
    LoadingItem,
    SongItem,
  },
  data: () => ({
    loading: false,
    searchResults: [],
    searchValue: '',
    noResult: false,
    loaders: loaders,
    cancelRequest: false
  }),
  computed: {
    ...mapState('music', [
      'videoMode',
    ]),
    resultsAnimationDuration () {
      return this.searchResults.length > 0 ? resultsAnimationTime / this.searchResults.length : 0
    },
  },
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
        // Force loaders animation
        if (this.loading === false) {
          this.loaders = []
          this.$nextTick(() => {
            this.loaders = loaders
          })
        }

        if (this.cancelRequest) {
          this.cancelRequest.cancel("Searching another term")
        }
        this.cancelRequest = axios.CancelToken.source()

        this.searchValue = val
        this.noResult = false
        this.loading = true

        music.search(val, this.cancelRequest.token).then(res => {
          this.loading = false
          this.cancelRequest = false

          if (Array.isArray(res.data)) {
            this.searchResults = res.data
            this.noResult = false
          } else {
            this.searchResults = []
            this.noResult = true
          }
        }).catch(err => {
          // Catching cancellation error
        })
      }
    },
    play (song) {
      this.playNextSong(song)
      this.$router.push('/')
    },
    clear () {
      this.searchResults = []
      this.loading = false
    },
    loadersAnimationDelay (index) {
      if (this.loading) {
        return this.resultsAnimationDelay(0) + (loadersAnimationDuration * (index + 1))
      } else {
        return (nbLoaders - index) * loadersAnimationDuration
      }
    },
    resultsAnimationDelay (index) {
      if (!this.loading) {
        return this.loadersAnimationDelay(0) + (this.resultsAnimationDuration * index)
      } else {
        return (this.searchResults.length - index) * this.resultsAnimationDuration
      }
    },
  }
}
</script>

<style lang="scss">
.search {
  position: relative;

  .loaders-no-overflow {
    position: relative;
  }

  .loaders-container {
    position: absolute;
    width: 100%;
  }

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

/* Animations */
.search-enter-active, .search-leave-active {
  transition-timing-function: ease-out;
}
.search-enter-active {
  transition: all .3s;
}
.search-leave-active {
  transition: all .1s;
}
.search-enter, .search-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
.no-results-enter-active, .no-results-leave-active {
  transition: all .3s;
}
.no-results-enter, .no-results-leave-to {
  opacity: 0;
  transform: translateY(20%);
}
.no-results-enter-active, .no-results-leave-active {
  transition-timing-function: ease-out;
}

</style>
