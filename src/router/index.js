import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Player from '@/components/Player'
import MoodList from '@/components/MoodList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Player',
      component: Player
    },
    {
      path: '/Hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/MoodList',
      name: 'MoodList',
      component: MoodList
    }
  ]
})
