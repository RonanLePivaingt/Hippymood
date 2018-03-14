<template>
  <div id="admin" ref="admin">
    <div v-if="user.masterUser">
      <span class="md-display-2">Administration</span>
      <md-list>
        <md-list-item md-expand-multiple>
          <md-icon>trending_up</md-icon>
          <span>Répartition des chansons par mood</span>

          <md-list-expand>
            <chartjs-horizontal-bar
              :height="chartHeight"
              :width="chartWidth"
              :labels="sortedMoods.label"
              :datasets="sortedMoods.chart">
            </chartjs-horizontal-bar>
          </md-list-expand>
        </md-list-item>
        <md-list-item>
          <md-icon>build</md-icon>
          <span>Actions d'administration</span>

          <md-list-expand>
            <p>
            <a class="md-button md-raised" @click="resetSession()">Reset session</a>
            </p>
            <p>
            <md-button class="md-raised md-warn" @click="resetDatabase()">Reset music database</md-button>
            </p>
            <div>
              <a class="md-button md-raised" @click="scanMusic()"> Scan music </a>
              <div v-show="scanProgress > -1">
                {{ scanProgress }} %
                <md-progress
                   class="md-accent"
                   :md-progress="scanProgress"></md-progress>
              </div>
            </div>
          </md-list-expand>
        </md-list-item>
      </md-list>
    </div>
    <div v-if="user.masterUser === false">
      <div class="error">
        <p>
          (>_<)
        </p>
        Hey {{ user.name }}, tu n'es pas le compte administrateur et tu n'as rien à faire ici.
        <div class="back">
          <md-button class="md-raised md-accent" href="#/" >
            <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
          </md-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var gradient = [
  '255, 0, 0, 0.8',
  '255, 36, 0, 0.75',
  '255, 72, 0, 0.7',
  '255, 126, 0, 0.7',
  '255, 160, 0, 0.7',
  '177, 180, 0, 0.7',
  '140, 200, 0, 0.7',
  '114, 255, 0, 0.7',
  '51, 255, 0, 0.7',
  '0, 255, 0, 0.7'
]
export default {
  name: 'admin',
  data: function () {
    return {
      scanProgress: -1,
      gradient: gradient
    }
  },
  beforeMount: function () {
    if (this.$store.state.user.id === undefined) {
      // Redirecting non-identified users to login page
      this.$router.push('/Login')
    }
  },
  computed: {
    user: function () {
      return this.$store.state.user
    },
    chartHeight: function () {
      if (this.$store.state.moods) {
        // Determined by the number of moods
        return 20 + (this.$store.state.moods.length * 20)
      } else {
        return 0
      }
    },
    chartWidth: function () {
      // This is a hack but I can't get it done reactively on mount in the data object
      if (this.$store.state.moods) {
        // Determined by the number of moods
        if (this.$refs.admin) {
          return this.$refs.admin.offsetWidth
        }
      } else {
        return 600
      }
    },
    sortedMoods: function () {
      var moods = this.$store.state.moods
      var sorted = moods.sort(function (a, b) {
        return parseInt(b.nbSongs, 10) - parseInt(a.nbSongs, 10)
      })
      var chart = [
        {
          label: 'Chansons',
          data: [],
          backgroundColor: []
        },
        {
          label: 'Chansons avec vidéo',
          data: [],
          backgroundColor: []
        }
      ]
      var label = []

      for (var i = 0; i < sorted.length; i++) {
        // Each moods have to be added to a labels array
        label.push(sorted[i].name)

        // Setting the number of song in the mood + color for the bar
        chart[0].data.push(sorted[i].nbSongs)
        chart[0].backgroundColor.push('rgba(152, 212, 205, 1)')

        chart[1].data.push(sorted[i].nbVideo)
        // Calculating the 10centage of songs with videos per mood
        if (sorted[i].nbVideo) {
          var tenCentage = Math.round((sorted[i].nbVideo / sorted[i].nbSongs) * 10)
        }
        // Setting video bar color
        chart[1].backgroundColor.push('rgba(' + gradient[tenCentage] + ')')
      }
      return {label: label, chart: chart}
    }
  },
  mounted: function () {
    // Changing the default chart width to the admin element width
    if (this.$refs.admin) {
      console.log(this.$refs.admin.offsetWidth)
      this.chartWidth = this.$refs.admin.offsetWidth
    }
  },
  sockets: {
    connect: function () {
      console.log('socket connection')
    },
    scan: function (val) {
      if (val === 'Done') {
        this.scanProgress = -1
      } else {
        this.scanProgress = val
      }
    }
  },
  methods: {
    resetSession () {
      window.vm.$Progress.start()

      this.$http.get('/admin/resetSession').then(response => {
        window.vm.$Progress.finish()

        console.log(response)
      }, response => {
        window.vm.$Progress.fail()

        console.log('Shit it the fan !')
      })
    },
    resetDatabase () {
      window.vm.$Progress.start()

      this.$http.get('/admin/resetDatabase').then(response => {
        window.vm.$Progress.finish()

        console.log(response)
      }, response => {
        window.vm.$Progress.fail()

        console.log('Shit it the fan !')
      })
    },
    scanMusic () {
      window.vm.$Progress.start()

      this.$socket.scan = (data) => {
        console.log('Socket response :')
        console.log(data)
      }

      this.$http.get('/admin/scanMusic').then(response => {
        this.scanProgress = 0
        window.vm.$Progress.finish()

        console.log(response)
      }, response => {
        window.vm.$Progress.fail()

        console.log('Shit it the fan !')
      })
    }
  }
}
</script>

<style>
#app:not(.video) div#main-container {
  width: 50rem;
}
#admin {
}
.md-display-2 {
  color: rgba(0, 0, 0, 0.6);
}
.error {
  color: rgba(0,0,0,0.5);
  font-size: 1rem;
}
.error > p {
  font-size: 8rem;
}
</style>
