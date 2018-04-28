import modalsComponent from './modals.vue'

	const myModals = {
		install:function(Vue){
			Vue.component('myModals',modalsComponent);
		}
	}
export default myModals;