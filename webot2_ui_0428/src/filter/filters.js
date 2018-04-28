import store from '../vuex/global'
const myFilter = {
	install:function(Vue){
		Vue.filter("enums",function (value,enum_name) {
		    return store.state.enums[enum_name][value];
		});
	}
}
export default myFilter;
