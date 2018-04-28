import calendarComponent from './calendar.vue'

	const loading = {
		install:function(Vue){
			Vue.component('calendar',calendarComponent);
		}
	}
export default calendar;