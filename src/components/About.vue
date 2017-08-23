<template>
  <div id="about">
    <div class="back">
      <md-button class="md-raised md-accent" href="#/" >
        <i class="material-icons">keyboard_backspace</i> Revenir au lecteur
      </md-button>
    </div>

    <p> Fait avec ♥ par Ronan Le Pivaingt </p>

    <md-list class="keyboards-shortcuts">
      <md-list-item>
        <md-icon>keyboard</md-icon>
          <span>Raccourcis clavier</span>

        <md-list-expand>
          <md-list>
            <md-list-item class="md-inset">
              Pause
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>espace</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Chanson précédente
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>🡸</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Chanson suivante
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>🡺</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Recherche
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>F</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Télécharger la chanson
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>S</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Afficher la page à propos
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>I</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Afficher le lecteur
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>H</span>
                </div>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              Activer les fonctionnalités beta
              <div class="keyboard-shortcut">
                <div class="key">
                  <span>ctrl</span>
                </div>
                +
                <div class="key">
                  <span>B</span>
                </div>
              </div>
            </md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>

      <md-list-item>
        <md-icon>build</md-icon>
        <span>Téchnologies utilisées</span>

        <md-list-expand>
          <md-list>
            <md-list-item class="md-inset">
              <div class="logo-container">
                <a href="https://vuejs.org/" target="_blank" title="Vue.js">
                  <img class="logo" src="../assets/vue_logo.png" alt="Vue js logo" />
                </a>
                <a href="http://vuematerial.io/" target="_blank" title="Vue Material">
                  <img class="logo" src="../assets/vue-material-logo.png" alt="Vue Material logo" />
                </a>
              </div>
            </md-list-item>
            <md-list-item class="md-inset">
              <div class="logo-container logo-container-small">
                <a href="https://nodejs.org/" target="_blank" title="Node.js">
                  <img class="logoBigger" src="/static/img/nodejs_logo.png" alt="Vue js logo" />
                </a>
                <a href="https://expressjs.com/" target="_blank" title="Express">
                  <img class="logoBigger" src="../assets/express-logo.png" alt="Express logo" />
                </a>
              </div>
            </md-list-item>
          </md-list>
        </md-list-expand>
      </md-list-item>
    </md-list>

    <md-divider class="md-inset github-separator"></md-divider>

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
<style scoped>
#about {
  margin: 0 auto 2rem auto;
  width: 30em;
  font-size: 1rem;
}
.back {
  text-align: center;
}
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo-container-small {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
hr.md-divider.md-inset.github-separator {
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: 0px;
}
.github-link {
  text-align: center;
}

/* Keyboard shortcuts style
   Thanks to Rizky Kurniawan Ritonga for this codepen : https://codepen.io/rizky_k_r/pen/wospJ */
.keyboard-shortcuts * { 
  outline: none !important; 
}

a, a:visited, a:hover, a:active { 
  text-decoration: none;
  color: inherit; 
}

div.key {
  display: inline-block;
  min-width:35px;
  height: 37px;
  padding: 1px;
  margin: 10px;
}

div.key > span {
  display: block;
  min-width: 35px;
  height: 35px;
  border: 1px solid #a9a9a9;
  border-radius: 2px 2px 2px 2px;
  -moz-border-radius: 2px 2px 2px 2px;
  -webkit-border-radius: 2px 2px 2px 2px;
  font-size: 12px;
  -moz-box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
  box-sizing: border-box !important;
  text-align: center;
  padding-top: 10px;
  color: #7c7c7c;
  -webkit-box-shadow: 0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px rgba(169,169,169,1);
  -moz-box-shadow: 0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px rgba(169,169,169,1);
  box-shadow: 0px 3px 0px -2px rgba(255,255,255,1), 0px 2px 0px 0px rgba(169,169,169,1);
  cursor: pointer;
}
div.key > span:hover {
  background-color: #75b4fb;
  border: 1px solid #5a88c5;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
  -webkit-box-shadow: 0px 3px 0px -2px rgba(117,180,251,1), 0px 2px 0px 0px rgba(90,136,197,1);
  -moz-box-shadow: 0px 3px 0px -2px rgba(117,180,251,1), 0px 2px 0px 0px rgba(90,136,197,1);
  box-shadow: 0px 3px 0px -2px rgba(117,180,251,1), 0px 2px 0px 0px rgba(90,136,197,1);
  cursor: pointer;
}

div.key > span:active {
  margin-top: 2px;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
}

div.key.special > span {
  padding-top: 15px;
  font-size: 11px;
}

div.key.icon > span {
  font-size: 14px;
}
</style>
