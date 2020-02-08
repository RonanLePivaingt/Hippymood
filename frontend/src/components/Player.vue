<template>
  <v-col
    align="center"
    class="pa-0"
  >
    <Intro />

    <PlayerCard v-if="!videoMode" />
    <PlayerVideo v-if="videoMode" />

    <MoodList />

    <v-snackbar
      :value="moodSongsAlreadyPlayed.id ? true : false"
      :timeout="10000"
      @input="resetMoodSongsAlreadyPlayed"
    >
      Les chansons de la mood {{ moodSongsAlreadyPlayed.name }} ont déjà été lues, les
      <v-btn
        class="ml-0"
        color="secondary"
        text
        @click="resetSessionBeforePlay(moodSongsAlreadyPlayed)"
      >
        les réécouter ?
      </v-btn>
    </v-snackbar>
  </v-col>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import MoodList from './MoodList';
import PlayerCard from './PlayerCard'
import PlayerVideo from './PlayerVideo'
import Intro from './Intro'

export default {
  name: 'WhatsNew',
  components: {
    MoodList,
    PlayerCard,
    PlayerVideo,
    Intro,
  },
  data: () => ({
    snackbar: false,
  }),
  computed: mapState('music', [
    'currentSong',
    'videoMode',
    'moodSongsAlreadyPlayed',
  ]),
  methods: {
    ...mapActions('music', [
      'resetSessionBeforePlay',
      'resetMoodSongsAlreadyPlayed',
    ]),
  },
};
</script>

