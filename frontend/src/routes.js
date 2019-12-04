import Player from './components/Player'
import Download from './components/Download'
import WhatsNew from './components/WhatsNew'
import Admin from './components/Admin'
import About from './components/About'
import Search from './components/Search'

const routes = [
  { path: '/', component: Player },
  { path: '/admin', component: Admin },
  { path: '/search', component: Search },
  { path: '/whatsnew', component: WhatsNew },
  { path: '/download', component: Download },
  { path: '/about', component: About },
]

export default routes
