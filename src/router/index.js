import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Staff from '@/components/Staff'
import AD from '@/components/AD'
import IPT from '@/components/IPT'
import Altiris from '@/components/Altiris'
import AirWatch from '@/components/AirWatch'
import Devices from '@/components/Devices'
import Warranty from '@/components/Warranty'
import PkgList from '@/components/PkgList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/site',
      name: 'home',
      component: Home
    },
    {
      path: '/staff',
      name: 'staff',
      component: Staff
    },
    {
      path: '/ad',
      name: 'ad',
      component: AD
    },
    {
      path: '/ipt',
      name: 'ipt',
      component: IPT
    },
    {
      path: '/altiris',
      name: 'altiris',
      component: Altiris
    },
    {
      path: '/airwatch',
      name: 'airwatch',
      component: AirWatch,
    },
    {
      path: '/devices',
      name: 'devices',
      component: Devices
    },
    {
      path: '/warranty',
      name: 'warranty',
      component: Warranty
    },
    {
      path: '/package',
      name: 'package',
      component: PkgList
    },
    { path: '*', redirect: '/site' }
  ]
})
