import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/components/Player'
import Admin from '@/components/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Player',
      component: Player
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
