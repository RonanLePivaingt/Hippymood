import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import VueRouter from 'vue-router'
import routes from './routes'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueI18n from 'vue-i18n'
import { messages, defaultLocale } from './lang/index.js'

if (process.env.NODE_ENV === 'development') {
  // Display user timings in dev tools to check components performance in browser dev tools
  // See more on Vue Dose : https://vuedose.tips/tips/measure-runtime-performance-in-vue-js-apps
  Vue.config.performance = true
  Vue.config.devtools = true

  Vue.config.productionTip = false
} else if (process.env.NODE_ENV === 'production') {
  Vue.config.silent = true
  Vue.config.performance = true
}

const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.use(VueRouter)
Vue.use(VueYouTubeEmbed)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: defaultLocale,
  fallbackLocale: 'fr',
  messages
})

new Vue({
  vuetify,
  store,
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
