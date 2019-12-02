<template>
  <div>
    <PlayerCard v-if="!videoMode" />
    <PlayerVideo v-if="videoMode" />

    <MoodList/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MoodList from './MoodList';
import PlayerCard from './PlayerCard'
import PlayerVideo from './PlayerVideo'

export default {
  name: 'WhatsNew',
  components: {
    MoodList,
    PlayerCard,
    PlayerVideo,
  },
  computed: mapState('music', [
    'currentSong',
    'videoMode',
  ]),
  methods: {
    ...mapActions('music', [ 'playNext' ]),
    play() {
      this.$root.$emit('play');
    },
  },
};
</script>

