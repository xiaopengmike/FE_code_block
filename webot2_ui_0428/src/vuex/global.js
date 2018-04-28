import api from '../config/api.js'
import router from '../router'
import uri from '../config/url.js'

const state = {
	loading:0,
	user:{},
	enums:{},
	authority:[],
	path:'',
	mode:'admin',//admin\servicer
	
	zoomin_uri:'',
	阻止登出:false,
	准备登出:false,
	问题检测:false,
	delay_lock: {
		change_kf_status: false,
	},            //忽略delay判断默写状态
}

const mutations = {
	setUser (state,user) {
		state.user = user
	},
	setEnums(state,enums){
		state.enums = enums;
	},
	setAuthority(state,authority){
		state.authority = authority;
	},
	setPath(state,p){    
		if(p.indexOf('/servicer')==0){
			state.mode = 'servicer';   
		} 
		state.path = p;          
	},
	setMode(state){
		if(state.mode=='admin'){
			state.mode = 'servicer';
			state.path="/servicer/session";
			router.push('/servicer/session');
		}
		else{
			state.mode='admin'
			state.path="/index";
			router.push('/index');
		}
	},

	setZoominUri(state,uri){
		state.zoomin_uri = uri;
	},
	
	set问题检测(state,bool){
		state.问题检测 = bool;
	}
}

const actions = {  
	'login':function(store , param){
		store.commit('setUser',param);
		//router.push('/index');
		api.setCookie('Auth',param.token,7);
		localStorage.token=param.token;
		localStorage.role=param.role;
        localStorage.account=param.account;
        localStorage.nickname=param.nickname;
		localStorage.username=param.username;
		localStorage.id=param.id;
		localStorage.cid=param.cid;
        
    },
    setUser:function(store,param){
    	localStorage.token=param.token;
        localStorage.account=param.account;
        localStorage.nickname=param.nickname;
		localStorage.username=param.username;
		localStorage.role=param.role;
		localStorage.id=param.id;
		localStorage.cid=param.cid;
		store.commit('setUser',param);
    },
    'logout':function(store){
    	if(!store.state.阻止登出){
    		router.replace({
		        path: '/login',
		        query: {}
		    });
		    api.delCookie('Auth');
	    	localStorage.clear();
	    	store.commit('setUser',{})
	    	}
    	
    },
    'initEnums':function(store,data){
    	store.commit('setEnums',data)
    },
    'initAuthority':function(store,data){
    	store.commit('setAuthority',data)
    },
    'setPath':function(store,p){ 
    	store.commit('setPath',p);
    },
    'changeMode':function(store){ 
    	store.commit('setMode');
    },
	
    'setZoominUri':function(store,uri){
    	store.commit('setZoominUri',uri);
    },
    set问题检测(store,bool){
    	store.commit('set问题检测',bool);
    	api.ajaxNoLoading(uri.company.some_status,'put',{status:Number(bool)});
    },
}
const getters = {
	getLoading : state => state.loading,
	getUser: state => state.user,
	getEnums : state => state.enums,
	getAuthority : state => state.authority,
	getPath : state => state.path,
	getMode : state => state.mode,
	getZoominUri : state => state.zoomin_uri,
	
}

export default {
	state,
	mutations,
	actions,
	getters
}