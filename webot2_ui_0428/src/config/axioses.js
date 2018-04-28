import store from '../vuex'
import router from '../router/index'
import Vue from 'vue'
import api from './api.js'
//0:有loading，1：无loading,2：无loading、返回所有数据（code,data,msg等,过滤部分特殊code）,3:无loading,返回所有数据，不报错
const v = new Vue();
const err_txt={
	400:'错误请求',
	401:'未授权请求',
	403:'服务器禁止此请求',
	404:'未找到此服务',
	405:'请求方法错误',
	500:'服务器出错了',
	502:'网关错误',
	504:'请求超时',
	default:'网络繁忙，请稍后再试',
}

export default [
	{
		实例:'',
		配置:{
			timeout:18000,
		},
		拦截:{
			sendBefore(config){
				store.state.global.loading++;
				if (store.state.global.user.token) {        
		            config.headers.Auth = store.state.global.user.token;
		        }
				if(config.url.indexOf('api2')==-1)
					config.url = '/api'+config.url;
		        return config;
			},
			sendError(err){
				store.state.global.loading--;
				router.replace({
		            path: '/login',
		            query: {}
		        });
			},
			AcceptAfter(response){
				store.state.global.loading--;
				let data;   
				let res = response.data;
		        switch(res.code){
		        	case 0:
		        		data = res.data;
		        		break;
		        	case 101:
		        		store.dispatch('logout');
		        		api.error(res.msg);
		        		router.replace({
		                    path: '/login',
		                    query: {}
		                });
		                store.state.global.user = {}; 
		                return Promise.reject();
		               break;
		            default:
		        		api.error(res.msg);
		        		return Promise.reject();
		        }
		        return data;
			},
			AcceptError(err){          
				store.state.global.loading--;
				try{
					if((err.code&&err.code=='ECONNABORTED')||err.response==undefined){
							api.error(err_txt.default)
					}
					else if(err.response&&err.response.status){
						api.error(err_txt[err.response.status]?err_txt[err.response.status]:err_txt.default)
					}else{
						api.error(err)
					}
				}catch(err){
					api.error('服务器错误')
				}
		        return Promise.reject(err)
			},
		}
	},
	{
		实例:'',
		配置:{
			timeout:18000,
		},
		拦截:{
			sendBefore(config){
				if (store.state.global.user.token) {        
		            config.headers.Auth = store.state.global.user.token;
		        }
				if(config.url.indexOf('api2')==-1)
					config.url = '/api'+config.url;
		        return config;
			},
			sendError(err){
				router.replace({
		            path: '/login',
		            query: {}
		        });
			},
			AcceptAfter(response){
				let data;   
				let res = response.data;
		        switch(res.code){
		        	case 0:
		        		data = res.data;
		        		break;
		        	case 101:
		        		store.dispatch('logout');
		        		api.error(res.msg);
		        		store.state.global.user = {}; 
		        		router.replace({
		                    path: '/login',
		                    query: {}
		                });
		                return Promise.reject();
		               break;
		            default:
		        		api.error(res.msg)
		        		return Promise.reject();
		        }
		        return data;
			},
			AcceptError(err){                  
		    	try{
					if((err.code&&err.code=='ECONNABORTED')||err.response==undefined){
							api.error(err_txt.default)
					}
					if(err.response&&err.response.status){
						api.error(err_txt[err.response.status]?err_txt[err.response.status]:err_txt.default)
					}
				}catch(err){
					api.error('服务器错误')
				}
		        return Promise.reject(err)
			},
		}
	},
	{
		实例:'',
		配置:{
			timeout:18000,
		},
		拦截:{
			sendBefore(config){
				if (store.state.global.user.token) {        
		            config.headers.Auth = store.state.global.user.token;
		        }
				if(config.url.indexOf('api2')==-1)
					config.url = '/api'+config.url;
		        return config;
			},
			sendError(err){
				router.replace({
		            path: '/login',
		            query: {}
		        });
			},
			AcceptAfter(response){
				let data;   
				let res = response.data;
		        switch(res.code){
		        	case 101:
		        		store.dispatch('logout');
		        		api.error( res.msg)
		        		store.state.global.user = {}; 
		        		router.replace({
		                    path: '/login',
		                    query: {}
		                });
		                return Promise.reject( res );
		               break;
		        }
		        return res;
			},
			AcceptError(err){
		    	api.error('服务器错误')
		        return Promise.reject(err)
			},
		}
	},
	{
		实例:'',
		配置:{
			timeout:18000,
		},
		拦截:{
			sendBefore(config){
				if (store.state.global.user.token) {        
		            config.headers.Auth = store.state.global.user.token;
		        }
				if(config.url.indexOf('api2')==-1)
					config.url = '/api'+config.url;
		        return config;
			},
			sendError(err){
				router.replace({
		            path: '/login',
		            query: {}
		        });
			},
			AcceptAfter(response){
				let res = response.data;
				switch(res.code){
		        	case 101:
		        		store.dispatch('logout');
		        		api.error( res.msg)
		        		store.state.global.user = {}; 
		        		router.replace({
		                    path: '/login',
		                    query: {}
		                });
		                return Promise.reject( res );
		               break;
		        }
		        return res;
			},
			AcceptError(err){
		        return Promise.reject(err)
			},
		}
	},
]
