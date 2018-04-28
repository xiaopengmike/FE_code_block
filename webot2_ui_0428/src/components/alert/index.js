import alert from './alert.vue'

	const myalert = {
		install:function(Vue){
			Vue.component('myalert',alert);
		}
	}
export default myalert;