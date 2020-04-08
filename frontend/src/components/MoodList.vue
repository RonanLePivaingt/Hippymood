<template>
  <div>
    <v-col
      class="mood-list pa-0 pt-4"
      :class="activeClass"
      align="center"
      sm="10"
      cols="12"
    >
      <v-skeleton-loader
        v-for="(mood, index) in moodLoaders"
        :key="index"
        class="mood-skeleton ma-2"
        :class="index < nbMoodsDisplayed ? 'display' : ''"
        type="button"
        :style="loading ? `${mood.width} transition-delay: ${loadingAnimationDelay(index)}ms;` : `transition-delay: ${readyAnimationDelay(index)}ms;`"
      >
        <v-btn
          :key="mood.id"
          class="mood-btn"
          :color="mood.id === currentMood.id ? 'secondary' : ''"
          :disabled="videoMode && mood.nbVideo === '0' ? true : false"
          @click="playNextMood(mood)"
        >
          {{ mood.name }}
          <v-icon
            v-if="nextType === 'mood' && next.id === mood.id"
            right
          >
            mdi-update
          </v-icon>
        </v-btn>
      </v-skeleton-loader>
    </v-col>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import bezierEasing from 'bezier-easing';

// Generating array of skeleton items with various width
const nbLoaders = CONFIG.frontend.moodListLoading.nbLoaders,
      min = 75,
      max = 200,
      loaders = Array.from(Array(nbLoaders).keys()).map((val, index) => ({
        id: index,
        width: `width: ${Math.max(max * Math.random(), min)}px;`,
      }));

// Animations
const loadingEase = bezierEasing(0.55, 0, 1, 0.45),
      readyEase = bezierEasing(0.65, 0, 0.35, 1),
      loadingInterval = CONFIG.frontend.moodListLoading.loadingInterval,
      readyAnimationDuration = CONFIG.frontend.moodListLoading.readyAnimationDuration;

export default {
  name: 'MoodList',
  data: () => ({
    activeClass: '',
    demoMode: CONFIG.global.demoMode,
    loading: true,
    nbMoodsDisplayed: 0,
    startTime: 0,
  }),
  computed: {
    ...mapState('music', [
      'moods',
      'currentMood',
      'videoMode',
      'next',
      'nextType',
    ]),
    moodLoaders () {
      if (this.moods.length === 0) {
        return loaders;
      } else {
        return this.moods;
      }
    },
  },
  watch: {
    moods (newMoods) {
      if (newMoods.length > 0) {
        const elapsedTime = new Date().getTime() - this.startTime;

        //  Determining how many loaders was shown during elasped loading time
        for (let i = 1; i <= nbLoaders; i++) {
          if (this.loadingAnimationDelay(i) > elapsedTime) {
            this.nbMoodsDisplayed = i;
            break;
          }
        }

        // Force Vue to apply class after it was removed from DOM
        this.activeClass = '';
        this.loading = false;
        this.$nextTick(function () {
          this.activeClass = 'show';
        });
      }
    }
  },
  mounted () {
    // Wrapped inside nextTick to avoid issue when using another language than default one
    this.$nextTick(function () {
      this.activeClass = 'show';
      this.startTime = new Date().getTime();
    });
  },
  methods: {
    ...mapActions('music', [
      'playNextMood',
    ]),
    loadingAnimationDelay (index) {
      return loadingEase(index / nbLoaders ) * nbLoaders * loadingInterval;
    },
    readyAnimationDelay (index) {
      if (index < this.nbMoodsDisplayed) {
        return 0;
      } else {
        const time = readyAnimationDuration / ( this.moods.length - this.nbMoodsDisplayed );

        return ( loadingEase( ( index ) / this.moods.length ) * this.moods.length ) * time;
      }
    }
  },
};
</script>

<style lang="scss">
.mood-list {
  &.show .mood-skeleton {
    opacity: 1;
  }

  .mood-skeleton {
    display: inline-flex;
    opacity: 0;
    transition: opacity .4s;

    // Used to force visibility on already loaded mood blocks skeletons
    &.display {
      opacity: 1;
    }

    .mood-btn {
      flex-grow: 1;

      > .v-btn__content .v-icon.theme--light {
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
  }
}
</style>
