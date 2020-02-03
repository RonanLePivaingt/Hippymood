import Player from './components/Player'
import Download from './components/Download'
import WhatsNew from './components/WhatsNew'
import Admin from './components/Admin'
import About from './components/About'
import Search from './components/Search'

const routes = [
  { path: '/', component: Player, name: 'Lecteur'  },
  { path: '/admin', component: Admin, name: 'Administration'  },
  { path: '/search', component: Search, name: 'Recherche'  },
  { path: '/whatsnew', component: WhatsNew, name: 'Quoi de neuf ?' },
  { path: '/download', component: Download, name: 'Téléchargement'  },
  { path: '/about', component: About, name: 'À propos'  },
]

export default routes
