const en = new CustomEvent('resize',{detail:'自定义触发resize'});
export function triggerResize(){   
	setTimeout(function(){
		window.dispatchEvent(en);
	},200);
}
