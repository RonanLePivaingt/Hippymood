<template>
  <v-skeleton-loader
    class="song-loader"
    type="list-item-three-line"
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
        :style="song.moodWidth"
      />
    </v-row>
  </v-skeleton-loader>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    song: {
      type: Object,
      default: () => {
        return {
          songWidth: 'width: 200px;',
          albumWidth: 'width: 160px;',
          artistWidth: 'width: 240px;',
          moodWidth: 'width: 100px;',
        }
      }
    },
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

  &.song-loader {
    display: flex;
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
