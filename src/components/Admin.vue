<template>
  <div id="admin">
    <span class="md-display-2">Administration</span>
    <p>Coucou la CI ;)</p>
    <md-list>
      <md-list-item>
        <md-icon>trending_up</md-icon>
        <span>Répartition des chansons par mood</span>

        <md-list-expand>
          <chartjs-horizontal-bar :height="1280" :width="800" :labels="sortedMoods.label" :datasets="sortedMoods.chart"></chartjs-horizontal-bar>
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
      scanProgress: -1,
      mylabels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      mydatasets: [
        {
          label: 'My First dataset',
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'My Second dataset',
          data: [20, 50, 20, 41, 26, 85, 20]
        }
      ]
    }
  },
  computed: {
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
        chart[0].backgroundColor.push('rgba(255, 99, 132, 0.2)')
        chart[1].data.push(sorted[i].nbVideo)
        chart[1].backgroundColor.push('rgba(255,99,132,1)')
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
#admin .md-display-2 {
  color: rgba(0, 0, 0, 0.6);
}
</style>
