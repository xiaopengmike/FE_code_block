

const state= {
	kf_statuses: [ {label: '离线', status: 0, color: '#34d659'}, {label: '在线', status: 1, color: '#b5bbc1'} ],
	kf_status:{
		label: '离线',
		status: 0,
	},
	kf_status_change_source:{control:'自动',instance:null},   //手动，自动（手动下线，系统强制下线，手动下线两秒后切为自动）
	kf_status_change_time:0,
	socket:{
		instance:null,
		subscription:null,
	},
	kfs:{},     //id为key
	kfs_head:{},
	快捷回复:{},
	sessions:[],
	sessions索引:{},
	session_current_id:'',   //指定所需指向的会话，强制打开’当前会话‘页面后开始此id的会话
	
}
const mutations= {
	setKfStatuses(state, es){
		state.kf_statuses = es;
	},
	setKfStatus(state,s){
		state.kf_status = s;
	},
	setKfs (state,list) {
		state.kfs = list
	},
	setKfsHead (state,list) {
		state.kfs_head = list
	},
	set快捷回复(state,data){
		for(let i in data){
			state.快捷回复[i] = data[i];
		}
	},
	setSessionCurrentId(state,id){
		state.session_current_id = id;
	}
}
const actions= {
	setKfStatuses(store,es){
    	store.commit('setKfStatuses',es);
    },
	'setKfStatus':function(store,s){
    	store.commit('setKfStatus',s);
    },
    'setKfs':function(store,l){
    	store.commit('setKfs',l);
    },
    'setKfsHead':function(store,l){
    	store.commit('setKfsHead',l);
    },
    set快捷回复(store,data){
    	store.commit('set快捷回复',data);
    },
    setSessionCurrentId(store,id){
		store.commit('setSessionCurrentId',id);
	}
}
const getters= {
	getKfStatuses : state => state.kf_statuses,
	getKfStatus : state => state.kf_status,
	getKfs : state => state.kfs,
	getKfsHead : state => state.kfs_head,
	get快捷回复 : state =>state.快捷回复,
}


export default {
	state,
	mutations,
	actions,
	getters
}