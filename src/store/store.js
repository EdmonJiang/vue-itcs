import Vue from 'vue'
var Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // site
  sites: undefined,
  siteq: '',
  siteOpt: undefined,
  // AD user
  user: undefined,
  userq: '',
  userOpt: undefined,
  // Staff
  emps: undefined,
  empq: '',
  empOpt: undefined,
  // IPT
  iptdata: undefined,
  iptq: '',
  // Warranty
  assetbody: undefined,
  snq: undefined,
  // Altiris
  pcs: undefined,
  pcq: '',
  pcOpt: undefined,
  pcpagecount: 0,
  pctotal: 0,
  pcinitPage: 0,
  // PkgList
  pkgs: undefined,
  pkgq: '',
  // AirWatch
  users: undefined,
  pagecount: 0,
  total: 0,
  initPage: 0,
  eml: '',
  cn: '',
  co: '',
  fam: '',
  ebl: 'True',
  no: ''
}

export default new Vuex.Store({
  state
})
