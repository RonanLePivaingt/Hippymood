import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import MoodList from '@/components/MoodList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/yo',
      name: 'MoodList',
      component: MoodList
    }
  ]
})
