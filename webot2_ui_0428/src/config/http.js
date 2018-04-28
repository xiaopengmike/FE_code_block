
import axios from 'axios'
import store from '../vuex/global'
import router from '../router/index'
import Vue from 'vue'

var v = new Vue();
// axios 配置
axios.defaults.timeout = 15000;
//axios.defaults.baseURL ='http://192.168.3.51:8000';
//axios.defaults.headers.common['Authorization'] = localStorage('token');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// http request 拦截器
axios.interceptors.request.use(
    config => {                       
    	store.state.loading++;
        if (store.state.user.token) {
            config.headers.Auth = store.state.user.token;
        }
        config.url = '/api'+config.url;
        return config;
    },
    err => {
        router.replace({
            path: '/login',
            query: {}
        });
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
    	store.state.loading--;
		let data;   
		let res = response.data;
        switch(res.code){
        	case 0:
        		data = res.data;
        		break;
        	case 101:
        		store.dispatch('logout');
        		router.replace({
                    path: '/login',
                    query: {}
                });
                return Promise.reject();
               break;
            default:
        		v.$message({
        			type:'error',
        			message:res.msg
        		});
        		return Promise.reject();
        }
        return data;
    },
    error => {
    	store.state.loading--;
    	v.$message({
			type:'error',
			message:'服务器错误'
		});
        return Promise.reject(error)
    });

export default axios;