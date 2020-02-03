<template>
  <v-col>
    <h2> Quoi de neuf ? </h2>

    <p class="text-justify">
      To be implemented...
    </p>
  </v-col>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'WhatsNew',
  computed: mapState('music', [
    'currentSong',
  ]),
};
</script>
