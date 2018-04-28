import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '../config/routes'

Vue.use(VueRouter)

// 页面刷新时，重新赋值token
/*if (document.cookie.indexOf('username'+'=')>0) {
	let c_start=document.cookie.indexOf('username' + "=");
	c_start=c_start + 'username'.length+1 ;
	let c_end=document.cookie.indexOf(";",c_start);
	if (c_end==-1) c_end=document.cookie.length
    store.dispatch('login', unescape(document.cookie.substring(c_start,c_end)));
}*/

const router = new VueRouter({
	routes,
});


export default router;