<template>
  <div>
    <v-col
      class="mood-list pa-0 pt-4"
      :class="activeClass"
      align="center"
      sm="10"
      cols="12"
      @transitionend="addLoaders"
    >
      <transition-group
        name="fade"
        :duration="{ enter: 400, leave: 0 }"
        :appear="moods.length === 0"
      >
        <v-btn
          v-for="(mood, index) in moodLoaders"
          :key="mood.id"
          :data-index="index"
          class="mood-btn ma-2"
          :class="index < nbMoodsDisplayed ? 'force-display' : ''"
          :color="mood.id === currentMood.id ? 'secondary' : ''"
          :disabled="videoMode && mood.nbVideo === '0'"
          :style="loading ? `${mood.width} transition-delay: ${loadingAnimationDelay(index)}ms;` : `transition-delay: ${readyAnimationDelay(index)}ms;`"
          @click="!loading ? playNextMood(mood) : ''"
        >
          {{ mood.name }}

          <v-icon
            v-if="nextType === 'mood' && next.id === mood.id"
            right
          >
            mdi-update
          </v-icon>

          <v-progress-circular
            v-else-if="isLoading(mood.id)"
            class="ml-2 mr-n2"
            indeterminate
            color="secondary"
            width="3"
            size="20"
          />
        </v-btn>
      </transition-group>
    </v-col>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import bezierEasing from 'bezier-easing';

// Generating array of skeleton items with various width
const nbLoaders = 3,
      min = 75,
      max = 200,
      loaders = Array.from(Array(nbLoaders).keys()).map((val, index) => ({
        id: index,
        width: `width: ${Math.max(max * Math.random(), min)}px;`,
      }));

// Animations
const loadingEasing = bezierEasing(0.45, 0, 0.55, 1), // easeInCirc
      readyEasing = bezierEasing(0.55, 0, 1, 0.45),   // easeInQuad
      loadingInterval = CONFIG.frontend.moodListLoading.loadingInterval,
      readyAnimationDuration = CONFIG.frontend.moodListLoading.readyAnimationDuration;

export default {
  name: 'MoodList',
  data: () => ({
    activeClass: 'loading',
    demoMode: CONFIG.global.demoMode,
    loading: true,
    nbMoodsDisplayed: 0,
    startTime: 0,
    loaders: loaders,
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
        console.log("loaders")
        return this.loaders;
      } else {
        console.log("moods")
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
        window.setTimeout( () => {
          this.activeClass = 'show';
        }, 0);
      }
    }
  },
  mounted () {
    if (this.moods.length > 0) {
      this.loading = false;
      this.activeClass = 'show';
    } else {
      // Forcing vue to add class after DOM is ready, (doesn't work in production settings with nextTick)
      window.setTimeout( () => {
        this.activeClass = 'loading show';
        this.startTime = new Date().getTime();
      }, 0)

      /*
      console.log("initial", this.loadingAnimationDelay(this.loaders.length + 1), this.loaders.length)
      window.setTimeout( () => {
        this.addLoaders()
      }, this.loadingAnimationDelay(nbLoaders + 1))
      */
    }
  },
  methods: {
    ...mapActions('music', [
      'playNextMood',
    ]),
    loadingAnimationDelay (index) {
      return loadingEasing(index / this.loaders.length ) * this.loaders.length * loadingInterval
    },
    readyAnimationDelay (index) {
      if (index < this.nbMoodsDisplayed) {
        return 0;
      } else {
        const time = readyAnimationDuration / ( this.moods.length - this.nbMoodsDisplayed );

        return ( readyEasing( ( index ) / this.moods.length ) * this.moods.length ) * time;
      }
    },
    isLoading (moodId) {
      if (this.nextType === 'loadingMood' && this.next.id === moodId) {
        return true;
      } else {
        return false;
      }
    },
    addLoaders (e) {
      if (this.loaders.length > 40) {
        return false
      }
      if (this.moods.length === 0 && e.target.dataset.index >= this.loaders.length - 1) {
        console.log(e.target.dataset.index, "Adding 3 loaders")
        // Ajouter un loader
        this.loaders.push({
          id: this.loaders.length,
          width: `width: ${Math.max(max * Math.random(), min)}px;`,
        })
        this.loaders.push({
          id: this.loaders.length,
          width: `width: ${Math.max(max * Math.random(), min)}px;`,
        })
        this.loaders.push({
          id: this.loaders.length,
          width: `width: ${Math.max(max * Math.random(), min)}px;`,
        })
      }
    }
  },
};
</script>

<style lang="scss">
.mood-list {

  // Avoid stutter when loaders are added on desktop
  @media screen and (min-width: 1100px) {
    &.loading {
      text-align: left;
    }
  }

  .mood-btn {
    display: inline-flex;
    flex-grow: 1;

    > .v-btn__content .v-icon.theme--light {
      color: rgba(0, 0, 0, 0.54) !important;
    }
  }

  &.loading .mood-btn {
    overflow: hidden;
  }
  &.loading .mood-btn::after {
    -webkit-animation: loading 1.5s infinite;
    animation: loading 1.5s infinite;
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: translateX(-100%);
    z-index: 1;
    box-shadow: unset;
    webkit-box-shadow: unset;
  }
  .theme--light &.loading .mood-btn::after {
    background: linear-gradient(90deg,transparent,hsla(0,0%,100%,.5),transparent);
  }
  .theme--dark &.loading .mood-btn::after {
    background: linear-gradient(90deg,transparent,hsla(0,0%,100%,.05),transparent);
  }

  .v-skeleton-loader__bone {
    width: 100%;
  }
}
// Animation
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
