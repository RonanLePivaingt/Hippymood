import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

if (process.env.NODE_ENV === 'development') {
  // Display user timings in dev tools to check components performance in browser dev tools
  // See more on Vue Dose : https://vuedose.tips/tips/measure-runtime-performance-in-vue-js-apps
  Vue.config.performance = true

  Vue.config.productionTip = false
} else if (process.env.NODE_ENV === 'production') {
  Vue.config.silent = true
}

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
