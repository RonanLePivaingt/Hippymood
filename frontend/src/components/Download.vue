<template>
  <div>
    <h2> Download </h2>

    <p class="text-justify">
      To be implemented...
    </p>
  </div>
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
