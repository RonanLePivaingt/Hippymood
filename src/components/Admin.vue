<template>
  <div id="admin">
    <span class="md-display-2">Administration</span>
    <md-list>
      <md-list-item md-expand-multiple>
        <md-icon>trending_up</md-icon>
        <span>Répartition des chansons par mood</span>

        <md-list-expand>
          <chartjs-horizontal-bar :height="chartHeight" :width="800" :labels="sortedMoods.label" :datasets="sortedMoods.chart"></chartjs-horizontal-bar>
        </md-list-expand>
      </md-list-item>
      <md-list-item>
        <md-icon>build</md-icon>
        <span>Actions d'administration</span>

        <md-list-expand>
          <p>
          <md-button class="md-raised" @click="resetSession()">Reset session</md-button>
          </p>
          <p>
          <md-button class="md-raised md-warn" @click="resetDatabase()">Reset database</md-button>
          </p>
          <div>
            <md-button class="md-raised" @click="scanMusic()"> Scan music </md-button>
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
</template>

<script>
export default {
  name: 'admin',
  data () {
    return {
      scanProgress: -1
    }
  },
  computed: {
    chartHeight: function () {
      if (this.$store.state.moods) {
        // Determined by the number of moods
        return 20 + (this.$store.state.moods.length * 35)
      } else {
        return 0
      }
    },
    sortedMoods: function () {
      var moods = this.$store.state.moods
      var sorted = moods.sort(function (a, b) {
        return parseInt(b.nbSongs, 10) - parseInt(a.nbSongs, 10)
      })
      var label = []
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
      for (var i = 0; i < sorted.length; i++) {
        label.push(sorted[i].name)
        chart[0].data.push(sorted[i].nbSongs)
        // chart[0].backgroundColor.push('rgba(17, 15, 16, 0.80)')
        chart[0].backgroundColor.push('rgba(152, 212, 205, 1)')
        chart[1].data.push(sorted[i].nbVideo)
        // Calculer de 1 à 10 le pourcentage de vidéo
        if (sorted[i].nbVideo) {
          var pour10 = Math.round((sorted[i].nbVideo / sorted[i].nbSongs) * 10)
          console.log(pour10)
        }
        // Mettre 10 couleurs
        var degrade = [
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
        console.log(degrade)
        chart[1].backgroundColor.push('rgba(' + degrade[pour10] + ')')
      }
      return {label: label, chart: chart}
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
      this.$http.get('/admin/resetSession').then(response => {
        console.log(response)
      }, response => {
        console.log('Shit it the fan !')
      })
    },
    resetDatabase () {
      this.$http.get('/admin/resetDatabase').then(response => {
        console.log(response)
      }, response => {
        console.log('Shit it the fan !')
      })
    },
    scanMusic () {
      this.$socket.scan = (data) => {
        console.log(data)
      }

      this.$http.get('/admin/scanMusic').then(response => {
        console.log(response)
      }, response => {
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
</style>
