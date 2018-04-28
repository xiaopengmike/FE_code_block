export default {
	data(){
		return {
			
			
		}
	},
  	methods:{
  		//列表过滤
	    filterSerachStringAndLimitNum(str,q,num){  
	    	var len = num||30;
	    	var strs = str;                       
	    	if(q!='' && strs.indexOf(q)>=0){
	    		var reg = new RegExp(q,'gmi');
		    	if(strs.length<=len){
		    		strs = strs.replace(reg,'<span class="keyt">'+q+'</span>');  
		    	}else{
		    		if(q.length<len){
		    				var index = strs.indexOf(q);
		    				var other = (len-q.length)%2==0?len-q.length:len-q.length+1;
		    				var start = index-other/2<=0?0:index-other/2;
		    				var end = index+q.length+(other-index+start);
		    				strs = strs.slice(start,end).replace(reg,'<span class="keyt">'+q+'</span>');
		    				if(start!=0)
		    					strs = '···'+strs;
		    				if(end<str.length)
		    					strs = strs+'···';
	
		    		}else{
		    			strs = '···<span class="keyt">'+q.slice(0,len)+'</span>···';
		    		}
		    	}
	    	} else{
	    		strs = strs.slice(0,len);
	    		if(str.length>len)
	    			strs = strs+'···';
	    	}
	    	return strs;
	    },
	    
	    
  	}
}