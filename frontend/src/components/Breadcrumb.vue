<template>
  <transition name="fade">
    <v-row
      v-show="$route.path !== '/'"
      class="px-6"
      justify="space-between"
      align="center"
    >
      <v-breadcrumbs
        class="breadcrumb mx-md-0 pl-0"
        :items="breadcrumbItems"
        large
      >
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item
            v-if="item.text === 'Hippy Mood'"
            to="/"
          >
            {{ item.text }}
          </v-breadcrumbs-item>

          <v-breadcrumbs-item
            v-if="item.text !== 'Hippy Mood'"
          >
            {{ $t(`menu.${item.text}`) }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <v-menu
        bottom
        left
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            class="breadcrumb-menu ma-2"
            icon
            text
            large
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>
        <Menu />
      </v-menu>
    </v-row>
  </transition>
</template>

<script>
import Menu from './Menu';

export default {
  name: 'Breadcrumb',
  components: {
    Menu,
  },
  computed: {
    breadcrumbItems () {
      return [
        {
          text: 'Hippy Mood',
          disabled: false,
          to: '/',
        },
        {
          text: this.$route.name,
          disabled: false,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
.breadcrumb-menu {
  float: right;
  display: none;

  @media screen and (min-width: 600px) {
    display: inline;
  }
}
</style>
