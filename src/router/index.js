import Vue from 'vue'
import Router from 'vue-router'
import Player from '@/components/Player'
import Admin from '@/components/Admin'
import About from '@/components/About'
import Download from '@/components/Download'
import Search from '@/components/Search'
import WhatsNew from '@/components/WhatsNew'
import Login from '@/components/Login'
import Suggestions from '@/components/Suggestions'
import SuggestionReply from '@/components/suggestions/Reply'

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
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/whatsNew',
      name: 'WhatsNew',
      component: WhatsNew
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/suggestions',
      name: 'Suggestions',
      component: Suggestions
    },
    {
      path: '/suggestions/:id',
      name: 'Suggestion response',
      component: SuggestionReply
    }
  ]
})
