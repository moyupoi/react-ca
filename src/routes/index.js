import { App, Dis, Sea } from 'layouts'
// 首页
import Home from './Home'
// 404
import NotFound from './NotFound'

export const createRoutes = (store) => ([
  {
    path: '/',
    component: App,
    indexRoute: Home(store),
    childRoutes: [
    ]
  },
  {
    path: '/page/404',
    component: App,
    indexRoute: NotFound
  },
  {
    path: '*',
    component: App,
    indexRoute: NotFound
  }
])

// FIXME page/404
export default createRoutes
