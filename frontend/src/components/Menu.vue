<template>
  <v-container class="menu-container d-flex flex-column flex-grow-1 pa-0">
    <v-col class="pa-0">
      <v-list dense>
        <v-list-item class="d-flex d-sm-none">
          <v-list-item-content>
            <v-list-item-title class="title pa-2 ma-2">
              Hippy Mood
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider class="d-flex d-sm-none" />

        <v-list-item
          to="/"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-play-circle-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.player') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          class="d-flex d-sm-none"
          to="/search"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.search') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/whatsnew"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-new-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.whatsNew') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="toggleVideoMode">
          <v-list-item-action class="mr-0">
            <v-switch
              v-model="videoMode"
              class="mr-4"
              color="secondary"
              readonly
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.videoMode') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/download"
          link
          class="d-none"
        >
          <v-list-item-action>
            <v-icon>mdi-download</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.download') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin"
          link
          class="d-none"
        >
          <v-list-item-action>
            <v-icon>mdi-wrench</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.admin') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/about"
          link
        >
          <v-list-item-action>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t('menu.about') }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>

    <v-spacer />

    <v-col class="pa-0 flex-grow-0">
      <v-list class="pa-0">
        <v-divider />

        <v-list-item class="pa-0">
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                class="ma-2"
                icon
                text
                v-on="on"
              >
                <v-icon v-show="!darkMode">
                  mdi-translate
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group
                color="primary"
                :value="langItemIndex"
              >
                <v-list-item
                  v-for="(item, index) in langItems"
                  :key="index"
                  @click="changeLang(item.lang, index)"
                >
                  <v-list-item-icon>
                    <v-img
                      class="lang-img mr-3"
                      :src="require(`../assets/lang/${item.lang}.svg`)"
                      height="1rem"
                      width="2rem"
                      contain
                    />
                  </v-list-item-icon>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>

          <v-spacer />

          <v-btn
            class="ma-2"
            text
            icon
            @click="toggleDarkMode()"
          >
            <v-icon v-show="!darkMode">
              mdi-brightness-7
            </v-icon>
            <v-icon v-show="darkMode">
              mdi-brightness-4
            </v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-col>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Menu',
  data: () => ({
    langItems: [
      {
        name: 'Français',
        lang: 'fr',
      },
      {
        name: 'English',
        lang: 'en',
      },
      {
        name: 'Brezhoneg',
        lang: 'br',
      },
    ],
  }),
  computed: {
    ...mapState('music', [ 'videoMode' ]),
    ...mapState([
      'darkMode',
      'lang',
      'langIndex',
    ]),
    //  Computed with getter and setter to avoid no setter error because value is coming from state
    //  Unfortunately the setter is not called when the index is updated, so changeLang func is here
    langItemIndex: {
      get () {
        return this.langIndex
      },
      set () {}
    }
  },
  created () {
    this.langItem = this.langItems.findIndex(item => item.lang === this.lang)
  },
  methods: {
    ...mapActions('music', [ 'toggleVideoMode' ]),
    ...mapActions([
      'toggleDarkMode',
      'setLang',
    ]),
    changeLang (lang, index) {
      this.$root.$i18n.locale = lang
      this.setLang({
        lang,
        index,
      })
    }
  }
};
</script>

<style>
.menu-container {
  height: 100%;
}
</style>
