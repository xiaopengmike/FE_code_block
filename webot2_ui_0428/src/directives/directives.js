import store from '../vuex/global'
const myDirective = {
	install:function(Vue){
		//权限控制显示
		Vue.directive('authority',{
			bind:function(el,binding){       
				let name = binding.value;        
				let show = true;	
				let role = store.state.user.role ;   
				if( role==undefined || store.state.authority[role]==undefined) 
					show = false;
				else{
					if(store.state.authority[role].permissions[name]==1)
						show = true;
					if(store.state.authority[role].permissions[name]==0)
						show = false;
				}
				if(!show){     
					el.setAttribute("style","display:none;");
				}
			}
		});
		//透明显示
		Vue.directive('opacity',{
			bind(el,{value}){       
				el.style.opacity = Number(value);
			},
			update(el, {value}){
				el.style.opacity = Number(value);
			}
		});
		//输入正则验证
		Vue.directive('输入验证',{
			inserted:function(el,binding){                        
				var reg = binding.value;             
				if(el.value=="") return;
				if(typeof reg == 'string')
					reg = new RegExp(reg,'g');               
				if(reg.test(el.value)){                
					if(el.getAttribute('style'))
						el.setAttribute('style',el.getAttribute('style').replace(/border-color\s*:\s*.+?;/g,''))
				}else{
					el.style.borderColor='red';
				}
			}
		});
		
		
		/*Vue.directive('输入验证(符合)',{
			update:function(el,binding){                        
				var reg = binding.value;             
				if(el.value=="") return;
				if(typeof reg == 'string')
					reg = new RegExp(reg,'g');               
				if(reg.test(el.value)){                
					if(el.getAttribute('style'))
						el.setAttribute('style',el.getAttribute('style').replace(/border-color\s*:\s*.+?;/g,''))
				}else{
					el.style.borderColor='red';
				}
			}
		});
		//输入正则验证
		Vue.directive('输入验证(不符合)',{
			update:function(el,binding){                        
				let reg = binding.value;             
				if(el.value=="") return;
				if(typeof reg == 'string')
					reg = new RegExp(reg,'g');               
				if(!reg.test(el.value)){                
					if(el.getAttribute('style'))
						el.setAttribute('style',el.getAttribute('style').replace(/border-color\s*:\s*.+?;/g,''))
				}else{
					el.style.borderColor='red';
				}
			}
		});
		//输入正则验证
		Vue.directive('输入验证(不符合)(非空)',{
			update:function(el,binding){                         
				let reg = binding.value;      
				let txt = el.hasOwnProperty('value')?el.value:el.innerText;   console.log(txt)
				if(typeof reg == 'string')
					reg = new RegExp(reg,'g');             
				
				if(reg.test(txt)){                
					if(el.getAttribute('style'))
						el.setAttribute('style',el.getAttribute('style').replace(/border-color\s*:\s*.+?;/g,''))
				}else{
					el.style.borderColor='red';
				}
			}
		});*/
		//输入正则限制
		Vue.directive('输入限制',{
			update:function(el,binding,vnode){      
				var reg = binding.value;                 
				if(typeof reg == 'string')
					reg = new RegExp(reg,'g');
				var match = el.value.match(reg);       
				if(match!=null)
					el.value = match[0];
				else
					el.value = '';     
			}
		});
		Vue.directive('输入限制(警告)',{
			update:function(el,binding){ 
				var reg = binding.value;                 
				if(typeof reg == 'string')
					reg = new RegExp(reg,'g');
				if(reg.test(el.value)){                
					if(el.getAttribute('style'))
						el.setAttribute('style',el.getAttribute('style').replace(/border-color\s*:\s*.+?;/g,''))
				}else{
					el.style.borderColor='red';
				}
			}
		});
		Vue.directive('focus',{ 
			bind:function(el,{value,modifiers}){
				if(modifiers.bind && value)
					setTimeout(()=>{
						el.focus();
					},200)
			},
			inserted:function(el,{value,modifiers}){    
				if(value)
					setTimeout(()=>{
						el.focus();
					},200)
			},
			update:function(el,{value,modifiers}){   
				if(modifiers.update && value)
					setTimeout(()=>{
						el.focus();
					},200)
			}
		});
		
		Vue.directive('tap',{
			bind:function(el,binding){
				let start,end;
				el.onmousedown=function(e){
					start = Date.now();
				}
				el.onmouseup=function(e){
					let method = binding.value;
					end=Date.now();
					if(end-start<200){
						method();
					}
					start = 0;
				}
			},
			unbind:function(el){
				el.onmousedown=undefined;
				el.onmouseup=undefined;
			}
		});
	}
}
export default myDirective;