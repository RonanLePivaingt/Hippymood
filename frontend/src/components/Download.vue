<template>
  <v-col>
    <h2> {{ $t('menu.Download') }}</h2>

    <p class="text-justify">
      To be implemented...
    </p>
  </v-col>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Download',
  computed: mapState('music', [
    'currentSong',
  ]),
};
</script>
