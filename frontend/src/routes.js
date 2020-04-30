const routeOptions = [
  { path: '/', name: 'Player'  },
  { path: '/admin', name: 'Admin'  },
  { path: '/search', name: 'Search'  },
  { path: '/whatsnew', name: 'WhatsNew' },
  { path: '/download', name: 'Download'  },
  { path: '/about', name: 'About'  },
]

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () => import(/* webpackChunkName: "[request]" */ `./components/${route.name}.vue`)
  }
})

export default routes
