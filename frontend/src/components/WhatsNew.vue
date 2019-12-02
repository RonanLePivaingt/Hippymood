<template>
  <div>
    <h2> What's New </h2>

    <p class="text-justify">
      To be implemented...
    </p>
  </div>
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
