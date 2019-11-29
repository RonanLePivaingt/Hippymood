import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import store from './store'
import VueRouter from 'vue-router'
import routes from './routes'

if (process.env.NODE_ENV === 'development') {
  // Display user timings in dev tools to check components performance in browser dev tools
  // See more on Vue Dose : https://vuedose.tips/tips/measure-runtime-performance-in-vue-js-apps
  Vue.config.performance = true

  Vue.config.productionTip = false
} else if (process.env.NODE_ENV === 'production') {
  Vue.config.silent = true
}

const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.use(VueRouter)

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
