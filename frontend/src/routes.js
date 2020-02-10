import Player from './components/Player'
import Download from './components/Download'
import WhatsNew from './components/WhatsNew'
import Admin from './components/Admin'
import About from './components/About'
import Search from './components/Search'

const routes = [
  { path: '/', component: Player, name: 'player'  },
  { path: '/admin', component: Admin, name: 'admin'  },
  { path: '/search', component: Search, name: 'search'  },
  { path: '/whatsnew', component: WhatsNew, name: 'whatsNew' },
  { path: '/download', component: Download, name: 'download'  },
  { path: '/about', component: About, name: 'about'  },
]

export default routes
