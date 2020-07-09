// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store/store'
// import $ from 'jquery'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    user: String
  },
  created () {
    // this.user = document.getElementsByTagName('title')[0].getAttribute('user')
    this.user = window.returnCitySN['cname'] + ' ' + window.returnCitySN['cip']
  },
  router,
  store,
  template: '<App :user="user" />',
  components: { App }
})
