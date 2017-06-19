import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/components/Player'
import Admin from '@/components/Admin'
import About from '@/components/About'
import Download from '@/components/Download'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Player',
      component: Player
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/download',
      name: 'Download',
      component: Download
    },
    {
      path: '/admin',
      name: 'Admin',
      component: Admin
    }
  ]
})
