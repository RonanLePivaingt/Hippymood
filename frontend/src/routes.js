import Player from './components/Player'
import Download from './components/Download'
import WhatsNew from './components/WhatsNew'
import Admin from './components/Admin'
import About from './components/About'

const routes = [
  { path: '/', component: Player },
  { path: '/download', component: Download },
  { path: '/whatsnew', component: WhatsNew },
  { path: '/admin', component: Admin },
  { path: '/about', component: About },
]

export default routes
