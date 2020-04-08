<template>
  <div>
    <!--
    <v-col
      class="mood-list pa-0 pt-4"
      align="center"
      sm="10"
      cols="12"
    >
      <transition-group name="fade" appear>
        <v-btn
          v-for="(mood, index) in skeletonMoods"
          :key="mood.id"
          class="mood-btn ma-2"
          :color="mood.id === currentMood.id ? 'secondary' : ''"
          :disabled="videoMode && mood.nbVideo === '0' ? true : false"
          :style="`transition-delay: ${100 * index}ms;`"
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
      </transition-group>
    </v-col>

          :style="`mood.width ? width: ${mood.width}px; transition-delay: ${300 * index}ms; : ''`"

          :style="`mood.width ? ${mood.width} transition-delay: ${300 * index}ms;`"
    -->

    <v-col
      class="mood-list pa-0 pt-4"
      :class="activeClass"
      align="center"
      sm="10"
      cols="12"
      >
        <v-skeleton-loader
          v-for="(mood, index) in skeletonMoods"
          :key="index"
          class="mood-skeleton ma-2"
          :class="index < nbMoodsDisplayed ? 'display' : ''"
          type="button"
          :style="mood.width ? `${mood.width} ${mood.style}` : `transition-delay: ${Math.max( (index - nbMoodsDisplayed) * 100, 0)}ms;`"
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

// Generating array of skeleton items with various width
const nb = 45,
      min = 75,
      max = 200,
      loadersSizes = Array.from(Array(nb).keys()).map((val, index) => ({
        id: index,
        style: `transition-delay: ${index * 300}ms;'`,
        width: `width: ${Math.max(max * Math.random(), min)}px; `,
      }));

// style: `'width: ${Math.max(max * Math.random(), min)}px; transition-delay: ${index * 300}ms;'`,

export default {
  name: 'MoodList',
  data: () => ({
    activeClass: '',
    demoMode: CONFIG.global.demoMode,
    timeStart: 0,
    nbMoodsDisplayed: 0,
  }),
  computed: {
    ...mapState('music', [
      'moods',
      'currentMood',
      'videoMode',
      'next',
      'nextType',
    ]),
    skeletonMoods () {
      if (this.moods.length === 0) {
        return loadersSizes;
      } else {
        return this.moods;
      }

    },
  },
  watch: {
    moods (moods, newVal) {
      if (moods.length > 0) {
        const delay = new Date().getTime() - this.timeStart;
        this.nbMoodsDisplayed = Math.floor(delay / 300);
        console.log(this.nbMoodsDisplayed);
        this.activeClass = '';
        this.$nextTick(function () {
          this.activeClass = 'show';
        });
      }
    }
  },
  mounted () {
    this.activeClass = 'show';
    this.timeStart = new Date().getTime();
    console.log('mounted');
  },
  methods: mapActions('music', [
    'playNextMood',
  ]),
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
    transition: opacity .5s;

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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
