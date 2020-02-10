<template>
  <v-col class="about">
    <h2> {{ $t('menu.about') }} </h2>

    <div class="made-with-love">
      {{ $t('about.madeWith') }} <div class="heart" /> {{ $t('about.by') }} Ronan Le Pivaingt
    </div>

    <v-list>
      <v-list-group
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title> {{ $t('about.usedTechnologies') }} </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item class="pl-4">
          <v-list-item-content>
            <v-list-item-title>Frontend</v-list-item-title>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-card class="ma-2">
                  <a
                    class="logo-link"
                    href="https://vuejs.org/"
                    target="_blank"
                    title="Vue.js"
                    contain
                  >
                    <img
                      class="logo"
                      src="../assets/used-technologies/Vue.js.svg"
                      alt="Vue.js logo"
                    >
                    <span class="my-auto mx-4">
                      VueJS
                    </span>
                  </a>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-card class="ma-2">
                  <a
                    class="logo-link"
                    href="https://vuetifyjs.com/"
                    target="_blank"
                    title="Vuetify"
                  >
                    <img
                      class="logo"
                      src="../assets/used-technologies/Vuetify.svg"
                      alt="Vuetify logo"
                    >
                    <span class="my-auto mx-4">
                      Vuetify
                    </span>
                  </a>
                </v-card>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>

        <v-list-item class="pl-4">
          <v-list-item-content>
            <v-list-item-title>Backend</v-list-item-title>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-card class="ma-2">
                  <a
                    class="logo-link"
                    href="https://nodejs.org/"
                    target="_blank"
                    title="Node.js"
                    contain
                  >
                    <img
                      src="../assets/used-technologies/Node.js.png"
                      alt="Node.js logo"
                    >
                    <span class="my-auto mx-4">
                      Node.js
                    </span>
                  </a>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-card class="ma-2">
                  <a
                    class="logo-link express"
                    href="https://expressjs.com/fr/"
                    target="_blank"
                    title="Express"
                  >
                    <img
                      class="logo"
                      src="../assets/used-technologies/Expressjs.png"
                      alt="Express logo"
                    >
                    <span class="my-auto mx-4">
                      Express
                    </span>
                  </a>
                </v-card>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider class="mb-4" />

    <v-row justify="space-around">
      <a
        href="https://github.com/3615Yeye/Hippymood"
        :title="$t('about.seeCode')"
        target="_blank"
        class="github-link"
      >
        <v-icon size="10rem">mdi-github-circle</v-icon>
      </a>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: 'About',
};
</script>

<style lang="scss">
/* Heart effect
 * Thanks to Twitter and this nice tutorial : https://medium.com/@chrismabry/how-did-they-do-that-the-twitter-like-animation-2a473b658e43
 */
@import "../assets/heart-animation/style.css";

.about {
  .made-with-love {
    display: flex;
    align-items: center;
  }

  .v-list {
    background: transparent !important;

    .logo-link {
      display: flex;
      padding: 1rem;

      img {
        max-height: 4rem;
      }

      &.express {
        padding-top: 1rem;
        padding-bottom: 1rem;
      }
    }
  }

  .github-link {
    text-decoration: none;
  }
}
</style>
