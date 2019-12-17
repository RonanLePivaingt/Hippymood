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
        primary: '#ffd369',
        secondary: '#89C4F4',
      },
      dark: {
        primary: '#ffd369',
        secondary: '#89C4F4',
      },
    },
  },
});
