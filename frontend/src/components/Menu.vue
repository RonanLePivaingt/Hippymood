<template>
  <v-container class="menu-container d-flex flex-column flex-grow-1 pa-0">
    <v-col class="pa-0">
      <v-list
        class="pa-0"
        dense
      >
        <v-list-item
          class="d-flex d-sm-none"
          two-line
        >
          <v-list-item-content>
            <v-list-item-title class="menu-title text-center pt-3">
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
              {{ $t('menu.Player') }}
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
              {{ $t('menu.Search') }}
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
              {{ $t('menu.WhatsNew') }}
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
              {{ $t('menu.VideoMode') }}
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
              {{ $t('menu.Download') }}
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
              {{ $t('menu.Admin') }}
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
              {{ $t('menu.About') }}
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
          <LangMenu />

          <v-spacer />

          <v-btn
            class="ma-2"
            text
            icon
            @click="setDarkMode(!darkMode)"
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
import LangMenu from './LangMenu';

export default {
  name: 'Menu',
  components: {
    LangMenu,
  },
  computed: {
    ...mapState('music', [ 'videoMode' ]),
    ...mapState([
      'darkMode',
      'lang',
    ]),
  },
  methods: {
    ...mapActions('music', [ 'toggleVideoMode' ]),
    ...mapActions([ 'setDarkMode' ]),
  }
};
</script>

<style lang="scss">
.menu-container {
  height: 100%;

  .menu-title {
    height: 4rem;
    font-family: 'Grenadier-NF';
    font-size: 3rem !important;
    line-height: 3rem !important;
  }
}
</style>
