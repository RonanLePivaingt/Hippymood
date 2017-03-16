import Vue from 'vue'
import Router from 'vue-router'
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
      path: '/MoodList',
      name: 'MoodList',
      component: MoodList
    }
  ]
})
