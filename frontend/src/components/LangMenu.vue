<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        class="ma-2"
        :fab="fab ? true : false"
        :icon="fab ? false : true"
        small
        v-on="on"
      >
        <v-icon>
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
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { langItems } from '../lang/index.js'

export default {
  name: 'LangMenu',
  props: {
    fab: Boolean,
  },
  data: () => ({
    langItems: Object.freeze(langItems)
  }),
  computed: {
    ...mapState('music', [
      'currentSong',
      'videoMode',
    ]),
    ...mapState([
      'darkMode',
      'lang',
    ]),
    //  Computed with getter and setter to avoid no setter error because value is coming from state
    //  Unfortunately the setter is not called when the index is updated, so changeLang func is here
    langItemIndex: {
      get () {
        return this.langItems.findIndex(item => item.lang === this.lang)
      },
      set () {}
    }
  },
  methods: {
    ...mapActions( [ 'setLang' ] ),
    changeLang ( lang, index ) {
      this.$root.$i18n.locale = lang
      this.setLang( lang )
    }
  },
};
</script>
