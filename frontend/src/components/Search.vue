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

    <div class="no-overflow">
      <v-list
        class="loaders-container"
        :class="loadingClass"
        >
        <transition-group
          name="custom2"
          appear
          @after-leave="afterLeave"
          >
          <v-skeleton-loader
            v-for="(song, index) in loaders"
            :key="song.id"
            class="line"
            type="list-item-three-line"
            :style="`transition-delay: ${loadersAnimationDelay(index)}ms;`"
            v-show="loading"
            >
            <v-row
              class="pr-1 ma-0"
              justify="space-between"
              align="center"
              >
              <v-col class="metadata flex-wrap pl-0">
                <v-list-item-title>
                  <v-icon>mdi-music-note</v-icon>
                  <v-skeleton-loader
                    type="text"
                    :style="song.songWidth"
                  />
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon>mdi-album</v-icon>
                  <v-skeleton-loader
                    type="text"
                    :style="song.albumWidth"
                  />
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <v-icon>mdi-account</v-icon>
                  <v-skeleton-loader
                    type="text"
                    :style="song.artistWidth"
                  />
                </v-list-item-subtitle>
              </v-col>

              <v-skeleton-loader
                type="button"
                :style="song.btnWidth"
              />
            </v-row>
          </v-skeleton-loader>
        </transition-group>
      </v-list>

      <v-list v-if="searchResults">
        <transition-group
          name="custom2"
          appear
        >
          <v-list-item
            v-for="(song, index) in searchResults"
            :key="song.id"
            class="pa-0"
            :two-line="!song.album ? true : false"
            :three-line="song.album ? true : false"
            :disabled="videoMode && !song.youtube ? true : false"
            v-show="!loading"
            :style="`transition-delay: ${resultAnimationDelay(index)}ms;`"
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
        </transition-group>
      </v-list>

      <transition name="custom2" appear>
      <v-col
        v-show="noResult"
        class="text-center"
        :style="`transition-delay: ${resultAnimationDelay(1)}ms;`"
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
  data: () => ({
    loading: false,
    searchResults: [],
    searchValue: '',
    noResult: false,
    loaders: loaders,
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
    afterLeave () {
      console.log("Animation finished")
    },
    loadersAnimationDelay (index) {
      if (this.loading) {
        if (this.searchResults.length) {
          return ((this.searchResults.length + 1) * animationDuration) + animationDuration * index
        } else {
          return 300 * index
        }
      } else {
        return (animationDuration * (nbLoaders)) - (300 * index)
      }
    },
    resultAnimationDelay (index) {
      if (this.loading) {
        if (this.searchResults.length) {
          return (animationDuration * this.searchResults.length) - (300 * index)
        } else {
          return 300 * index
        }
      } else {
        return (animationDuration * (nbLoaders + 1)) + (animationDuration * index)
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

  .no-overflow {
    overflow: hidden;
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
.mood-skeleton {
  display: inline-flex;

  > button {
    flex-grow: 1;
  }
}

/*
// Skeleton
.v-skeleton-loader {
opacity: 0;

.show & {
opacity: 1;
}
}
 */

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.slide-out-top-enter-active {
  animation: slide-out-top 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
.slide-out-top-leave-active {
  animation: slide-out-top 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
.slide-out-top-enter, .slide-out-top-leave-to {
  opacity: 0;
}
.custom-enter-active {
  animation: slide-out-bottom 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
.custom-leave-active {
  animation: slide-out-top 0.3s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
.custom-enter, .custom-leave-to {
  opacity: 0;
  transform: translateY(-1000px);
}

.custom2-enter-active, .custom2-leave-active {
  transition: all .3s;
}
.custom2-enter, .custom2-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  z-index: -1;
  transform: translateY(-100%);
}
/* ----------------------------------------------
 * Generated by Animista on 2020-4-21 12:37:36
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-out-top
 * ----------------------------------------
 */
@keyframes slide-out-top {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  100% {
    transform: translateY(-100%);
    opacity: 1;
  }
}
@keyframes slide-out-bottom {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

</style>
