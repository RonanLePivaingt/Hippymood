<template>
  <div id="about">
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        Retour au lecteur
      </md-button>
    </div>

    <p> Fait avec ♥ par Ronan Le Pivaingt </p>
    <p>Avec : </p> 
    <div>
      <a href="https://vuejs.org/" target="_blank" title="Vue.js">
        <img class="logo" src="/static/img/vue_logo.png" alt="Vue js logo" />
      </a>
      <a href="https://getmdl.io/" target="_blank" title="Material Design Component" style="filter: invert(100%">
        <img class="logo" src="/static/img/mdl_logo.svg" alt="Material Design Component logo" />
      </a>
    </div>
    <div>
      <a href="https://nodejs.org/" target="_blank" title="Node.js">
        <img class="logoBigger" src="/static/img/nodejs_logo.png" alt="Vue js logo" />
      </a>
      <a href="https://expressjs.com/" target="_blank" title="Express">
        <img class="logoBigger" src="/static/img/express_logo.png" alt="Express logo" />
      </a>
    </div>
    <p>Voir le code : </p>
    <a href="https://github.com/RonanLePivaingt/Hippymood" target="_blank" title="Hippymood sur Github">
      <img class="logo" src="/static/img/github_logo.png"/>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'about'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#about {
  margin: 0 auto;
  width: 30em;
}
.back {
  text-align: center;
}
img {
  max-width: 20%;
  max-height: 20%;
}
img.logo {
  max-width: 20%;
  max-height: 20%;
}
img.bigger {
  max-width: 50%;
  max-height: 50%;
}
</style>
