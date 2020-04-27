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
            :key="song.id"
            :song="song"
            :video-mode="videoMode"
            :style="`transition-delay: ${resultAnimationDelay(index)}ms;`"
            @click="play(song)"
          />
        </transition-group>
      </v-list>

      <transition name="search">
      <v-col
        v-show="noResult"
        class="text-center"
        :style="`transition-delay: ${resultAnimationDelay(2)}ms;`"
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
import bezierEasing from 'bezier-easing';
import LoadingItem from './list/LoadingItem';
import SongItem from './list/SongItem';

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

// Animations
const loadingEase = bezierEasing(0.55, 0, 1, 0.45),
  readyEase = bezierEasing(0.65, 0, 0.35, 1),
  loadingInterval = 3000,
  animationDuration = 300,
  readyAnimationDuration = CONFIG.frontend.moodListLoading.readyAnimationDuration;

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
    loaders: [],
    loadingClass: '',
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
        this.noResult = false

        this.loaders = []
        this.$nextTick(() => {
          this.loaders = loaders
        })

        setTimeout(() => {
          this.loadingClass = 'show'
        }, 100);

        music.search(val).then(res => {
          this.loadingClass = '';
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
    clear () {
      this.searchResults = []
      this.loading = false
    },
    loadersAnimationDelay (index) {
      if (this.loading) {
        console.log("load1", index, this.resultAnimationDelay(0) + (300 * (index + 1)))
        return this.resultAnimationDelay(0) + (300 * (index + 1))
      } else {
        // return (nbLoaders * animationDuration) - (animationDuration * index)
        console.log("load2", index, (nbLoaders - index - 1) * animationDuration)
        return (nbLoaders - index - 1) * animationDuration
      }
    },
    resultAnimationDelay (index) {
      if (!this.loading) {
        console.log("result1", index, this.loadersAnimationDelay(0) + (animationDuration * index))
        return this.loadersAnimationDelay(0) + (animationDuration * index)
      } else {
        console.log("result2", index, (this.searchResults.length - index) * animationDuration)
        return (this.searchResults.length - index) * animationDuration
        // return (this.searchResults.length * animationDuration) - (300 * (index + 1))
      }
    },
    loadingAnimationDelay (index) {
      return loadingEase(index / nbLoaders ) * nbLoaders * loadingInterval;
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
</style>
