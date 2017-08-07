<template>
  <div id="about">
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        Retour au lecteur
      </md-button>
    </div>

    <p> Fait avec ♥ par Ronan Le Pivaingt </p>
    <p>Technologies web utilisées : </p> 
    <div class="logo-container">
      <a href="https://vuejs.org/" target="_blank" title="Vue.js">
        <img class="logo" src="../assets/vue_logo.png" alt="Vue js logo" />
      </a>
      <a href="http://vuematerial.io/" target="_blank" title="Vue Material">
        <img class="logo" src="../assets/vue-material-logo.png" alt="Vue Material logo" />
      </a>
    </div>
    <div class="logo-container">
      <a href="https://nodejs.org/" target="_blank" title="Node.js">
        <img class="logoBigger" src="/static/img/nodejs_logo.png" alt="Vue js logo" />
      </a>
      <a href="https://expressjs.com/" target="_blank" title="Express">
        <img class="logoBigger" src="../assets/express-logo.png" alt="Express logo" />
      </a>
    </div>

    <md-divider class="md-inset"></md-divider>

    <div class="github-link">
      <a href="https://github.com/RonanLePivaingt/Hippymood" target="_blank" title="Voir le code d'Hippymood sur Github">
        <img class="logo" src="../assets/github_logo.png"/>
      </a>
    </div>
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
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-container img {
  height: 100%;
}
hr.md-divider {
  margin-top: 5%;
  margin-bottom: 5%;
}
.github-link {
  text-align: center;
}
/*
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
*/
</style>
