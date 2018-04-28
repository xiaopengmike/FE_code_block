import Vue from 'vue'
import Vuex from 'vuex'
import global from './global.js'
import service from './service.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
  	global : global,
    service: service,
  }
})
export default store
