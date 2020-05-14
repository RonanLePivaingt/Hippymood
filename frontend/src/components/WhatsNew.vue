<template>
  <v-col class="whats-new">
    <h2> {{ $t('menu.WhatsNew') }}</h2>

    <v-list v-if="displayLoaders">
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
      <transition-group
        name="search"
        @after-enter="hideLoaders"
      >
        <song-item
          v-for="(song, index) in whatsNew"
          :key="song.id"
          :song="song"
          :video-mode="videoMode"
          :style="`transition-delay: ${resultsAnimationDelay(index)}ms;`"
          @click="play(song)"
        />
      </transition-group>
    </v-list>

    <v-col class="text-center">
      <transition name="fade">
        <v-btn
          v-show="showLoadMore"
          color="secondary"
          :loading="loading"
          @click="loadMore"
        >
          {{ $t('ui.loadMore') }}
        </v-btn>
      </transition>
    </v-col>
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import bezierEasing from 'bezier-easing';
import LoadingItem from './list/LoadingItem';
import SongItem from './list/SongItem';
import { createLoaders } from '../utils/animation'

// Generating array of skeleton items with various width
const nbLoaders = 10,
      loaders = createLoaders(nbLoaders)

// Animations
const loadingEase = bezierEasing(0.55, 0, 1, 0.45),
      readyEase = bezierEasing(0.65, 0, 0.35, 1),
      loadingInterval = 1500,
      readyAnimationDuration = 1000,
      loadersAnimationTime = 3000,
      loadersInAnimationDuration = loadersAnimationTime / nbLoaders,
      loadersOutAnimationDuration = 400 / nbLoaders,
      resultsAnimationTime = 400

export default {
  name: 'WhatsNew',
  components: {
    LoadingItem,
    SongItem,
  },
  data: () => ({
    loading: false,
    loaders: [],
    displayLoaders: true,
    indexNewResults: 0,
    showLoadMore: false,
  }),
  computed: {
    ...mapState('music', [
      'whatsNew',
      'videoMode',
    ]),
    resultsAnimationDuration () {
      return this.whatsNew.length > 0 ? resultsAnimationTime / this.whatsNew.length : 0
    },
  },
  watch: {
    whatsNew (newSongList, oldSongList) {
      this.loading = false

      if (newSongList.length > oldSongList.length) {
        this.indexNewResults = oldSongList.length
      }
    },
  },
  mounted () {
    if (this.whatsNew.length === 0) {
      this.$store.dispatch('music/getWhatsNew')
      this.loading = true
      this.loaders = loaders
    } else {
      this.showLoadMore = true
    }
  },
  methods: {
    ...mapActions('music', [
      'getWhatsNew',
      'playNextSong'
    ]),
    loadMore() {
      this.loading = true
      this.getWhatsNew()
    },
    play(song) {
      this.playNextSong(song)
      this.$router.push('/')
    },
    hideLoaders () {
      if (this.whatsNew.length > 0) {
        this.displayLoaders = false
      }
      if (!this.loading) {
        this.showLoadMore = true
      }
    },
    loadersAnimationDelay (index) {
      if (this.loading) {
        return loadingEase(index / nbLoaders ) * nbLoaders * loadingInterval;
      } else {
        return (nbLoaders - index) * loadersOutAnimationDuration
      }
    },
    resultsAnimationDelay (index) {
      if (!this.loading) {
        if (index >= this.indexNewResults) {
          // Hack
          return this.loadersAnimationDelay(0) + (this.resultsAnimationDuration * (index - this.indexNewResults))
        } else {
          return 0
        }
      } else {
        return (this.whatsNew.length - index) * this.resultsAnimationDuration
      }
    },
  },
};
</script>

<style lang="scss">
.whats-new {
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

  .v-btn > .v-btn__content .v-icon.theme--light {
    color: rgba(0, 0, 0, 0.54);
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
</style>
