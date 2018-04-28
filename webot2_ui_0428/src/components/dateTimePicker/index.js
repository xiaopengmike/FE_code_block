import comp from './index.vue'

	const myDatePicker = {
		install:function(Vue){
			Vue.component('myDatePicker',comp);
		}
	}
export default myDatePicker;