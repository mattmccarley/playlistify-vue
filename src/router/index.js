import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Build from '@/components/Build'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      alias: '/welcome'
    },
    {
      path: '/build',
      name: 'Build',
      component: Build
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})
