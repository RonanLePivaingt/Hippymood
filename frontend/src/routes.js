import Player from './components/Player'
import Download from './components/Download'
import WhatsNew from './components/WhatsNew'
import Admin from './components/Admin'
import About from './components/About'
import Search from './components/Search'

const routes = [
  { path: '/', component: Player, name: 'Player'  },
  { path: '/admin', component: Admin, name: 'Admin'  },
  { path: '/search', component: Search, name: 'Search'  },
  { path: '/whatsnew', component: WhatsNew, name: 'WhatsNew' },
  { path: '/download', component: Download, name: 'Download'  },
  { path: '/about', component: About, name: 'About'  },
]

export default routes
