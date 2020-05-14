<template>
  <div>
    <v-col
      class="mood-list pa-0 pt-4"
      align="center"
      cols="12"
      sm="10"
      offset-sm="1"
    >
      <div
        v-if="moods.length === 0"
        class="loaders"
        @transitionend="addLoaders"
      >
        <transition-group
          name="fade"
          appear
        >
          <v-btn
            v-for="(loader, index) in loaders"
            :key="loader.id"
            :data-index="index"
            class="mood-btn ma-2"
            :style="`${loader.moodWidth} transition-delay: ${loadingAnimationDelay(index)}ms;`"
          />
        </transition-group>
      </div>

      <transition-group name="fade">
        <v-btn
          v-for="(mood, index) in moods"
          :key="mood.id"
          class="mood-btn ma-2"
          :color="mood.id === currentMood.id ? 'secondary' : ''"
          :disabled="videoMode && mood.nbVideo === '0'"
          :style="`transition-delay: ${readyAnimationDelay(index)}ms;`"
          @click="playNextMood(mood)"
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
import { mapState, mapActions } from 'vuex'
import bezierEasing from 'bezier-easing'
import { createLoaders } from '../utils/animation'

// Animations
const loadingEasing = bezierEasing(0.45, 0, 0.55, 1), // easeInCirc
      readyEasing = bezierEasing(0.55, 0, 1, 0.45),   // easeInQuad
      loadingInterval = 1000,
      readyAnimationDuration = 500

export default {
  name: 'MoodList',
  data: () => ({
    demoMode: CONFIG.global.demoMode,
    loaders: createLoaders(3),
  }),
  computed: mapState('music', [
    'currentMood',
    'moods',
    'next',
    'nextType',
    'videoMode',
  ]),
  methods: {
    ...mapActions('music', [
      'playNextMood',
    ]),
    loadingAnimationDelay (index) {
      return loadingEasing(index / this.loaders.length) * this.loaders.length * loadingInterval
    },
    readyAnimationDelay (index) {
      const time = readyAnimationDuration / this.moods.length;

      return readyEasing(index / this.moods.length) * this.moods.length * time;
    },
    isLoading (moodId) {
      if (this.nextType === 'loadingMood' && this.next.id === moodId) {
        return true;
      } else {
        return false;
      }
    },
    addLoaders (e) {
      if (this.moods.length === 0 && e.target.dataset.index >= this.loaders.length - 1) {
        this.loaders = [
          ...this.loaders,
          ...createLoaders(3, this.loaders.length)
        ]
      }
    }
  },
};
</script>

<style lang="scss">
.mood-list {
  .mood-btn {
    > .v-btn__content .v-icon.theme--light {
      color: rgba(0, 0, 0, 0.54) !important;
    }
  }

  .loaders {
    /* Avoid stutter when loaders are added on desktop */
    @media screen and (min-width: 1100px) {
      text-align: left;
    }

    .mood-btn {
      overflow: hidden;

      &::after {
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

      .theme--light &::after {
        background: linear-gradient(90deg,transparent,hsla(0,0%,100%,.5),transparent);
      }
      .theme--dark &::after {
        background: linear-gradient(90deg,transparent,hsla(0,0%,100%,.05),transparent);
      }
    }
  }
}

/* Animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
