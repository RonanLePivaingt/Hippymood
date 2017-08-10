<template>
  <div id="download">
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>
    <div>

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
    </div>
    <div class="download-link">
      <a class="md-button md-raised" :href="current.path" download>
          Télécharger la chanson <i class="material-icons">file_download</i>
      </a>
      
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
<style>
#download {
  margin: 0 auto;
  width: 30em;
}
.download-link {
  text-align: center;
}
</style>
