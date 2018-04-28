// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
sessionStorage.path = window.location.hash.substr(1);
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import App from './App.vue'
import router from './router/index'
import api from './config/api'
//全局性初始化
import memory from './config/memory'
memory();
//原型链处理
import prototype from './config/prototype'
prototype();

Vue.prototype.$api = api

api.initAllAxios();
import axios from './config/http'
Vue.prototype.axios = axios;
//import './assets/css/bootstrap.min.css'
import './assets/fonts/my-webfont/my-webfont.css'
import './assets/fonts/dongqingxihei/dongqingxihei.css'
import './assets/css/base.css'
import './assets/css/themes.css'
import './assets/scss/themes.scss'
import './assets/scss/changeDefault.scss'
import store from './vuex';

import filters from './filter/filters'
Vue.use(filters)
import directives from './directives/directives'
Vue.use(directives)



import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView)

import ElementUI from 'element-ui'
//import './assets/css/element-ui-index0.css'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI)

import VueClipboard from 'vue-clipboard2'
// var VueClipboard = require('vue-clipboard')
Vue.use(VueClipboard)


//公共组件
//loading
import loading from './components/loading'
Vue.use(loading);
//名词解释
import wordExplain from './components/名词解释'
Vue.use(wordExplain);
//模态框
import myModals from './components/modals'
Vue.use(myModals);
//时间选择框
import myDatePicker from './components/dateTimePicker'
Vue.use(myDatePicker);

//api
import uri from './config/url.js'
Vue.prototype.$uri = uri;


import source from './source'
Vue.prototype.$source = source;

/*假数据*/


/*api.setCookie('Auth','e8c0ebc8-ead2-11e7-97e0-000c2913faa5');
localStorage.token="e8c0ebc8-ead2-11e7-97e0-000c2913faa5";
localStorage.id="22";*/

window.$$vue = Vue;
window.$store = store;

/*假数据*/

if(localStorage.token!=undefined){
	let user = {
		token:localStorage.token,
		username:localStorage.username,
		nickname:localStorage.nickname,
		role:localStorage.role,
		id:localStorage.id,
	}
	store.dispatch('login',user);
	if(sessionStorage.path){
		router.push(sessionStorage.path);
		store.dispatch('setPath', sessionStorage.path);
	}
}else{
	store.dispatch('setPath', '/login');
	router.push("/login")
}
router.beforeEach((to, from, next) => {
	store.state.global.loading++;


    if (to.meta && to.meta.requireAuth) {
        if (store.state.global.user.token) {
        	//记录当前路径
        	store.dispatch('setPath', to.path);         
        	//维护历史路径（部分面包屑导航有用）
        	let a_history = {name: to.name, path: to.path, query: to.query};
        	let historys = sessionStorage.historys;
        	if(historys && historys!='undefined'){
        		historys = JSON.parse(historys);
        		if(historys[historys.length-1].path !== to.path){
        			historys.push(a_history);
        			sessionStorage.historys = JSON.stringify(historys.slice(-3));
        		}
        	}else{
        		sessionStorage.historys = JSON.stringify([a_history]);
        	}
            next();
        }
        else {
        	store.state.global.loading--;
            next({
                path: '/login',
                query: {}
            })
        }
    }
    else {
    	store.dispatch('setPath', to.path);
        next();
    }
});
router.afterEach((to,from)=>{
	//强制滚动回顶部
	let content = document.getElementById('_content');
	if(content) content.scrollTop = 0;
	store.state.global.loading--;
})
//socket
/*
import VueWebsocket from "vue-websocket";
Vue.use(VueWebsocket);*/

window.公共实例 = new Vue();

import color from './config/颜色配置.js'
window.color = color;

new Vue({
  el: '#app',
  router,
  axios,
  store,
  render: (h) => h(App)
});

