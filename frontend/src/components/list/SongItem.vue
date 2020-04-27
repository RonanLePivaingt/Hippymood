<template>
  <v-list-item
    class="pa-0"
    :two-line="!song.album ? true : false"
    :three-line="song.album ? true : false"
    :disabled="videoMode && !song.youtube ? true : false"
    @click="$emit('click')"
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
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    song: Object,
    videoMode: Boolean,
  },
};
</script>

<style lang="scss">
.v-skeleton-loader {
  display: inline-flex;
  max-width: 100%;

  > div {
    flex-grow: 1;
  }

  &.line {
    display: flex;
    overflow: hidden;

    opacity: 0;
    transition: opacity .4s;
  }

  .show &.line {
    opacity: 1;
  }

  // Text
  .metadata > div {
    &,
    &.v-list-item__subtitle {
      text-overflow: clip;
    }
  }

  .metadata > div & {
    display: inline-flex;
    margin-left: 4px;
    vertical-align: middle;

    .v-skeleton-loader__text {
      margin-bottom: 0;
    }
  }
}
</style>
