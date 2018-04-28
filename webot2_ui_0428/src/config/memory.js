const initObj = {
	initMemoryStorage(){
		window.memoryStorage = {
			data:{},
			setItem(k,v){
				this.data[k] = v;
				localStorage.setItem('sessionStorage',JSON.stringify(this.data));
			},
			getItem(k){
				return this.data[k];
			},
			removeItem(k){
				delete this.data[k];
				localStorage.setItem('sessionStorage',JSON.stringify(this.data));
			}
		};
		if(this.isEmptyObj(memoryStorage.data)){
			localStorage.setItem('getSessionStorage',Date.now());
		}
		window.addEventListener('storage',function(e){
			if(e.key == 'getSessionStorage'){             console.log('有页面来拿memory');
				localStorage.setItem('sessionStorage',JSON.stringify(memoryStorage.data));
				localStorage.removeItem('sessionStorage');
		}else if(event.key == 'sessionStorage'){     console.log('有页面改变了memory')
				let data = JSON.parse(e.newValue);
				for(let k in data){
					memoryStorage.data[k] = data[k];
				}
			}
		})
	},
	isEmptyObj(obj){
		for(let i in obj){
			return false;
		}
		return true;
	},
};
export default ()=>{
		initObj.initMemoryStorage();
	}
	
