import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#028F76',
        secondary: '#B9340B',
      },
      dark: {
        primary: '#028F76',
        secondary: '#B9340B',
      },
    },
  },
});
