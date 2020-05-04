import Player from './components/Player.vue'

const lazyRouteOptions = [
  { path: '/', name: 'Player'  },
  { path: '/admin', name: 'Admin'  },
  { path: '/search', name: 'Search'  },
  { path: '/whatsnew', name: 'WhatsNew' },
  { path: '/download', name: 'Download'  },
  { path: '/about', name: 'About'  },
]

const routes = lazyRouteOptions.map(route => {
  return {
    ...route,
    component: () => import(/* webpackChunkName: "[request]" */ `./components/${route.name}.vue`)
  }
})

// routes.push({ path: '/', component: Player, name: 'Player'  })

export default routes
