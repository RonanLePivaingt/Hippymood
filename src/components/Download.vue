<template>
  <div id="download">
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        Retour au lecteur
      </md-button>
    </div>
    <div>

      <md-card-header>
        <div class="md-title">{{ current.song }}</div>
        <div class="md-subhead">
          <span v-show="current.album">{{ current.album }} </br></span>
          {{ current.artist }}
        </div>
      </md-card-header>
    </div>
    <div class="download-link">
      <a class="md-button md-raised" :href="current.path" download>Télécharger la chanson</a>
      
    </div>
  </div>
</template>

<script>
  export default {
    name: 'download',
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
