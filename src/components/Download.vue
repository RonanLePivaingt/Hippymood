<template>
  <div id="download">
    <div class="back">
      <md-button class="md-raised md-accent dark-background" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <div class="download-card">
      <md-card-header>
        <div class="md-title">
          <i class="material-icons meta">audiotrack</i> {{ current.song }}
        </div>
        <div class="md-subhead">
          <span v-show="current.album">
            <i class="material-icons meta">album</i> {{ current.album }} </br>
          </span>
          <i class="material-icons">person</i> {{ current.artist }}
        </div>
      </md-card-header>
        <div class="download-link dark-background">
          <a class="md-button md-raised md-accent md-theme-default" :href="current.path" download>
              Télécharger la chanson <i class="material-icons">file_download</i>
          </a>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'download',
    mounted: function () {
      if (!this.$store.state.current.id) {
        this.$router.push('/')
      }
    },
    computed: {
      current: function () {
        return this.$store.state.current
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#download {
  margin: 0 auto;
  width: 40em;
}
.back {
  text-align: center;
}
.download-card {
  padding: 1rem;
}
.download-link {
  text-align: center;
}
.download-card p {
  color: rgba(0,0,0,0.87);
}
.download-card i {
  color: rgba(0,0,0,0.5);
}
.download-link i {
  color: rgba(255,255,255,0.7);
}
</style>
