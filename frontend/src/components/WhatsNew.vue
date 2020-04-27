<template>
  <v-col class="whats-new">
    <h2> {{ $t('menu.whatsNew') }}</h2>

    <v-list
      v-if="whatsNew.length === 0"
      :class="activeClass"
    >
      <transition-group name="fade">
        <loading-item
          v-for="(song, index) in loaders"
          v-show="loading"
          :key="song.id"
          :song="song"
          :style="`transition-delay: ${loadingAnimationDelay(index)}ms;`"
        />
      </transition-group>
    </v-list>

    <v-list>
      <transition-group name="fade">
        <song-item
          v-for="(song, index) in whatsNew"
          :key="song.id"
          :song="song"
          :video-mode="videoMode"
          :style="`transition-delay: ${index * 300}ms`"
          @click="play(song)"
        />
      </transition-group>
    </v-list>

    <v-col class="text-center">
      <v-btn
        v-if="whatsNew.length > 0"
        color="secondary"
        :loading="loading"
        @click="loadMore"
      >
        {{ $t('ui.loadMore') }}
      </v-btn>
    </v-col>
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import bezierEasing from 'bezier-easing';
import LoadingItem from './list/LoadingItem';
import SongItem from './list/SongItem';

// Generating array of skeleton items with various width
const nbLoaders = 10,
      min = 75,
      max = 200,
      loaders = Array.from(Array(nbLoaders).keys()).map((val, index) => ({
        id: index,
        songWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
        albumWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
        artistWidth: `width: ${Math.max(372 * Math.random(), 122)}px;`,
        btnWidth: `width: ${Math.max(max * Math.random(), min)}px;`,
      }))

// Animations
const loadingEase = bezierEasing(0.55, 0, 1, 0.45),
      readyEase = bezierEasing(0.65, 0, 0.35, 1),
      loadingInterval = 1500,
      readyAnimationDuration = CONFIG.frontend.moodListLoading.readyAnimationDuration;

export default {
  name: 'WhatsNew',
  components: {
    LoadingItem,
    SongItem,
  },
  data: () => ({
    loading: false,
    activeClass: '',
    readyClass: '',
    loaders: loaders,
  }),
  computed: {
    ...mapState('music', [
      'whatsNew',
      'videoMode',
    ]),
  },
  watch: {
    whatsNew (newSongList, oldSongList) {
      this.loading = false

      if (newSongList.length > oldSongList.length) {
        this.$nextTick(function () {
          this.readyClass = "show"
        })
      }
    },
  },
  mounted () {
    if (this.whatsNew.length === 0) {
      this.$store.dispatch('music/getWhatsNew')
      this.loading = true
      // Strangely works instead of nextTick
      setTimeout(() => {
        this.activeClass = 'show'
      }, 1);
    } else {
      this.readyClass = 'show'
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
    loadingAnimationDelay (index) {
      return index * 1000
      // return loadingEase(index / nbLoaders ) * nbLoaders * loadingInterval;
    },
  },
};
</script>

<style lang="scss">
.whats-new {
  .v-list {
    background: transparent;

    .v-list-item {
      // opacity: 0;
      transition: opacity .4s;
    }

    &.show .v-list-item {
      // opacity: 1;
    }
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
</style>
