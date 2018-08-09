import Vue from 'vue'
import Router from 'vue-router'
import Top from '@/components/Top'
import SignIn from '@/components/SignIn'
import Add from '@/components/Add'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/album/',
  routes: [
    {
      path: '/',
      name: 'Top',
      component: Top
    },
    {
      path: '/signIn',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/add',
      name: 'Add',
      component: Add
    }
  ]
})
