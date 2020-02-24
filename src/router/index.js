import Vue from 'vue'
import VueRouter from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: Recommend
  },
  {
    path: '/singer',
    name: 'singer',
    component: Singer
  },
  {
    path: '/rank',
    name: 'rank',
    component: Rank
  }, {
    path: '/search',
    name: 'search',
    component: Search
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
