import api from '../config/api'
import store from '../vuex'
import uri from '../config/url.js'
import axios from 'axios'

export default {
	kfs(){    
		return new Promise((resolve,reject)=>{
			if(api.isEmptyObj(store.state.service.kfs)){
				api.ajax(uri.kf.list,'get')
				.then(data=>{
					let [obj,head] = this.kfsHandler(data.list);
					resolve(obj); 
				})
				.catch(err=>{
					reject(err);
				})
			}else{
				resolve(store.state.service.kfs);
			}
		})
	},
	kfsHead(){
		return new Promise((resolve,reject)=>{
			if(api.isEmptyObj(store.state.service.kfs_head)){
				api.ajax(uri.kf.list,'get')
				.then(data=>{
					let [obj,head] = this.kfsHandler(data.list);
					resolve(head); 
				})
				.catch(err=>{
					reject(err);
				})
			}else{
				resolve(store.state.service.kfs_head);
			}
		})
	},
	kfsHandler(data){
		let head={},kfObj={};
		data.forEach(val=>{
			val.head = val.head||'./user_header.png';
			head[val.id] = val.head;
			kfObj[val.id] = val;
		});
		store.dispatch('setKfs',kfObj);
		store.dispatch('setKfsHead',head);
		return [kfObj,head];
	},
	/*快捷回复(){
		return new Promise((resolve,reject)=>{
			if(api.isEmptyObj(store.state.service.快捷回复)){
				axios.all([api.ajax(uri.setting.快捷回复.common,'get'), api.ajax(uri.setting.快捷回复.personal,'get')])
				.then(axios.spread((d1,d2)=>{   console.log(d1,d2);
					let 快捷回复 = {
						common:d1.quickFB.tag,
						personal:d2.quickFBUser.tag,
					}
					store.dispatch('set快捷回复',快捷回复);
					resolve(api.deepCopy(快捷回复));
				}))
			}else{
				resolve(api.deepCopy(store.state.service.快捷回复));
			}
		})
	},*/
};

//module.exports = source
