import Vue from 'vue'
var Promise = require('es6-promise').Promise;
require('es6-promise').polyfill();
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // Warranty
  assetbody: undefined,
  snq: undefined
}

export default new Vuex.Store({
  state
})
