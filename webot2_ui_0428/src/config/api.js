import axios from 'axios'
import axioses from './axioses.js'
import logo from '../assets/img/notification.jpg'
import Vue from 'vue'
/*import config from './config'
import qs from 'qs'*/
const v = new Vue();
export default {
	axioses:axioses,
	initAllAxios(){
		this.axioses.forEach((val,i)=>{
			val.实例 = axios.create(val.配置);
			val.实例.interceptors.request.use(val.拦截.sendBefore,val.拦截.sendError);
			val.实例.interceptors.response.use(val.拦截.AcceptAfter,val.拦截.AcceptError);
		});
	},
	ajaxDefault(oneAxios, uri, type, params, config=undefined ) {
		if((type == 'get') && params) {
			if(uri.indexOf('?')==-1)
				uri = uri + "?";
			else
				uri = uri + "&";
			for(var k in params) {
				uri = uri + k + '=' + params[k] + '&';
			}
		}
		if(config)
			return oneAxios[type](uri, params);
		else
			return oneAxios[type](uri, params,config);
	},
	ajax(uri, type, params, config=undefined) {
		return this.ajaxDefault(this.axioses[0].实例,uri, type, params, config);
	},
	ajaxNoLoading(uri, type, params, config=undefined) {
		return this.ajaxDefault(this.axioses[1].实例,uri, type, params, config);
	},
	ajaxReturnAllNoLoading(uri, type, params, config=undefined){
		return this.ajaxDefault(this.axioses[2].实例,uri, type, params, config);
	},
	ajaxReturnAllNoLoadingNoError(uri, type, params, config=undefined){
		return this.ajaxDefault(this.axioses[3].实例,uri, type, params, config);
	},
	//验证
	validate(validate, obj) {
		var result = [true, ''];
		var nullList = ["", [], undefined, null, NaN]
		var isNull = function(data){
			for(var i in nullList){
				if(data == nullList[i]) return true;
			}
			return false;
		}
		for(var i in validate) {
			console.log("validate",validate)
			if(isNull(obj[i])){
				// 如果obj为空且必须则判断失败
				if(validate[i].required)
					result = [false, validate[i].name + '是必填的！'];
				// 为空且不是必须则跳过验证
				else continue;
			}
			else if(validate[i].type=='object') {
				//return arguments.callee(validate[i],obj[i]);
				return this.validate(validate[i].property||validate[i].child, obj[i]);
			} else {
				// 验证传入空字符串的情况
				// if(validate[i].required) {
				// 	if((validate[i].type=='string' && obj[i].trim() == '')||(validate[i].type=='number' && obj[i] == ''))
				// 		return [false, validate[i].name + '是必填项！'];
				// 	if((validate[i].type=='array_repeat' && obj[i].length<validate[i].required)){
				// 		return [false, validate[i].name + '是必填项且不少于'+validate[i].required+'个！'];
				// 	}
				// }
				// else{
				// 	continue;
				// }
				switch(validate[i].type) {
					case 'string':
						if(typeof obj[i] !== 'string') {
							result = [false, validate[i].name + '必填是字符串！'];
						} else {
							if(validate[i].RegExp != undefined && new RegExp(validate[i].RegExp, 'gi').test(obj[i])) {
								result = [false, validate[i].name + validate[i].RegExp_err];
							}
						}
						break;
					case 'number':
						// console.info(typeof Number(obj[i]))
						var _temp = Number(obj[i])
						console.info(_temp)
						if(isNaN(_temp) || typeof Number(obj[i]) !== 'number') {
							result = [false, validate[i].name + '必填是数字！'];
						}
						break;
					case 'array_repeat':
						if(validate[i].RegExp != undefined) {
							var reg = new RegExp(validate[i].RegExp, 'gi');
							for(var j = 0; j < obj[i].length; j++) {
								if(typeof obj[i][j] !== validate[i].type_arr) {
									result = [false, validate[i].name + '第' + (j+1) + '个必填是'+validate[i].type_arr+'类型！'];
								}
								else if(reg.test(obj[i][j])) {
									result = [false, validate[i].name + '第' + (j + 1) + '个' + validate[i].RegExp_err];
								}
							}
						}
						break;
					case 'integer':
						var reg = /^[1-9][0-9]*$/
						if(!reg.test(obj[i])){
							result = [false, validate[i].name + '必须为大于1的整数'];
						}
						break;
					case 'url':
						// console.info(typeof Number(obj[i]))
						var reg =/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
						// console.info(obj[i])
						if(!reg.test(obj[i])) {
							result = [false, validate[i].name + '格式有误'];
						}
						break;
					case 'mobile':
						// var reg = /^([0]|[1-9]\d*)$/
						var reg02 = /[0-9\-\+\(\)]{3,18}/;

						if(!reg02.test(obj[i])) {
							result = [false, validate[i].name + '格式有误，格式为数字（可加+、-）']
						}
						break;
					case 'password':
						var reg = /^[A-Za-z0-9]{8,}$/;
						var reg2 = /[\d]+/;
						var reg3 = /[A-Za-z]+/
						if(!reg.test(obj[i])) {
							result = [false, validate[i].name + '至少8位']
						}
						else if(!reg2.test(obj[i]) | !reg3.test(obj[i])) {
							result = [false, validate[i].name + '必须是数字和字母组合']
						}
						break;

					case 'email':
						var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
						if(!reg.test(obj[i])) {
							result = [false, validate[i].name + '格式有误']
						}
						break;

				}
			}

			if(!result[0]){
				isNull = undefined;
				return result;
			}
		}
		return result;
	},
	//深度复制
    /*deepCopy(obj1, obj2){
    	if(obj2===undefined){
    		if(obj1 instanceof Object)
    			obj2={};
    		if(obj1 instanceof Array)
    			obj2 = [];
    	}
    	return  Object.assign(obj2, obj1);

    },*/
	deepCopy(parent, child) {
		var i,proxy;
		proxy = JSON.stringify(parent); //把parent对象转换成字符串
		proxy = JSON.parse(proxy) //把字符串转换成对象，这是parent的一个副本
		if(typeof proxy === 'object'){
			if(proxy instanceof Array){
				child = child || [];
				proxy.forEach((val,i)=>{
					if(typeof val == 'object' && val != null){
						child.push(this.deepCopy(val));
					}else{
						child.push(val);
					}
				});
			}
			else if(proxy instanceof Object){
				child = child || {};
				for(i in proxy) {
					if(typeof proxy[i] == 'object' && proxy[i] != null) {
						child[i] = this.deepCopy(proxy[i],child[i]);
					} else
						child[i] = proxy[i];

				}
			}
		}else{
			child = proxy;
		}

		proxy = null; //因为proxy是中间对象，可以将它回收掉
		return child;
	},
	//判断空对象
	isEmptyObj(obj){
		for(var i in obj){
			return false;
		}
		return true;
	},
	dateFormat(fmt,time=null){
		let t;
		if(time){
			if(typeof time == 'string')
				time = time.replace(/-/g, "/");
			t = new Date(time);
		}
		else
			t = new Date();
		let o = {
			    "M+" : t.getMonth()+1,                 //月份
			    "d+" : t.getDate(),                    //日
			    "h+" : t.getHours(),                   //小时
			    "m+" : t.getMinutes(),                 //分
			    "s+" : t.getSeconds(),                 //秒
			    "q+" : Math.floor((t.getMonth()+3)/3), //季度
			    "S"  : t.getMilliseconds()             //毫秒
		};
		if(/(y+)/.test(fmt))
		    	fmt=fmt.replace(RegExp.$1, (t.getFullYear()+"").substr(4 - RegExp.$1.length));
		for(var k in o)
		    	if(new RegExp("("+ k +")").test(fmt))
		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		return fmt;
	}  ,
	//毫秒转时间
	MillisecondToDate(msd,format=['秒','分','时','天']) {
		let result = '';
	    if (null!= msd &&""!= msd) {


	    	let time = msd = parseInt(msd)/1000;
	    	/*if(time>=(24*3600)){
	    		result += parseInt(time/24/3600);
	    		time = parseInt(time%(24*3600));
	    		result +="天";
	    	}*/
	    	if(time>=3600){
	    		result += parseInt(time/3600);
	    		time = parseInt(time%3600);
	    	}else if(result.length>0){
	    		result +='0';
	    	}
	    	if(result.length>0)
	    		result +=format[2];
	    	if(time>=60){
	    		result += parseInt(time/60);
	    		time = parseInt(time%60);
	    	}else if(result.length>0){
	    		if(msd>3600)
	    			return result;
	    		result +='0';
	    	}
	    	if(result.length>0)
	    		result +=format[1];

	    	if(msd>3600)
	    		return result;

	    	if(time!=0){
	    		result += time.toFixed(0);
	    	}
	    	else{
	    		result +='0'
	    	}
	    	result +=format[0];
	    }else{
	        result = "0"+format[0];
	    }
	    return result;

	},
	//截取字段显示
	截取字段(str,len){
		if(!str || typeof(str)!="string") return str;
		if(str.length>len){
			return str.slice(0,len)+'···';
		}else{
			return str;
		}
	},
	计算相差多少天(time1,time2=Date.now()){
		let t1 = new Date(time1).setHours(0,0,0,0);
		let t2 = new Date(time2).setHours(0,0,0,0);
		return Math.abs((t1-t2)/(24*3600000));
	},
	//页面最小化
	isMinWindow() {
		var isMin = false;
		if (window.outerWidth != undefined) {
		isMin = window.outerWidth <= 160 && window.outerHeight <= 27;
		}
		else {
		isMin = window.screenTop < -30000 && window.screenLeft < -30000;
		}
		return isMin;
	} ,
	//用户浏览当前页面？
	readingThisPage(){
		let reading = true;
		var hiddenProperty = 'hidden' in document ? 'hidden' :
		    'webkitHidden' in document ? 'webkitHidden' :
		    'mozHidden' in document ? 'mozHidden' :
		    null;
		if (!document[hiddenProperty]) {
	        reading=true;
	    }else{
	        reading = false;
	    }
		return reading;
	},
	//赋予不存在的字段
	赋予不存在的字段(受体,供体){
		for(let i in 供体){
			if(受体[i]==undefined){
				受体[i]=供体[i];
			}
		}
	},

	setCookie(name,value,Days=0){
		let exp = new Date();
		if(Days){
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+';path=/';
		}else
			document.cookie = name + "="+ escape (value)+';path=/';
	},
	getCookie(name){
		let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	delCookie(name){
		let exp = new Date();
		exp.setTime(exp.getTime() - 1);
		let cval=this.getCookie(name);
		if(cval!=null)
			document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	},
	//下载函数
	downloadFromService(name, url){
        let alink = document.createElement('a');
        alink.download = name;
        alink.href = url;
        alink.style.display = 'none';
        document.body.appendChild(alink);
        alink.click();
        document.body.removeChild(alink);
	},
	//查看文件函数
	checkFile(url,name='文件查看',type){
		this.downloadFromService(name,url);
	},
	newInfo(info,title){
		let v =this;
		if(window.Notification && Notification.permission !== "denied"){
			Notification.requestPermission(function(status) {
				const n = new Notification(title||'提示消息', {
					icon: logo,
					body: info ,
					silent:false,
					sound:'http://xunlei.sc.chinaz.com/Files/DownLoad/sound1/201702/8343.mp3',
				});
				n.onclick=function(){
					if(i!=undefined)
						v.current = i;
					if(!this.readingThisPage() || this.isMinWindow()){
						window.focus();
					}
				},
				n.onshow = function() {
		            setTimeout(function() {
		                n.close();
		            }, 4000);
		        };
			})
		}else{
			const h = this.$createElement;
		    this.$notify({
			    title: '新的消息',
			    message: h('i', { style: 'color: teal'}, info)
		    });
		}
	},
	isToday(time){
		time = new Date(time).getTime();
		let now = new Date().setHours(0,0,0,0);
		let 相差 = time-now
		if(相差<24*3600*1000 && 相差>=0){
			return true;
		}
		return false;
	},
	filterSerachStringAndLimitNum(str='',q,num){
    	var len = num||30;
    	var strs = str===null||str===undefined?"":str.toString();
    	if(q!=='' && strs.indexOf(q)>=0){
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
    		if(strs.length>len)
    			strs = strs+'···';
    	}
    	return strs;
    },

	htmlToStr(html){
		let str = html.replace(/\n/ig,'').replace(/<.+?>/ig,'');
		return str;
	},

	json2Url(Json){
		let query='';
		for(let i in Json){
			query += `${i}=${Json[i]}&`;
		}
		return query;
	},
	hsl2rgb(OxFF,opacity=undefined){
		var sColor = OxFF.toLowerCase();
	    //十六进制颜色值的正则表达式
	    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	    // 如果是16进制颜色
	    if (sColor && reg.test(sColor)) {
	        if (sColor.length === 4) {
	            var sColorNew = "#";
	            for (var i=1; i<4; i+=1) {
	                sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
	            }
	            sColor = sColorNew;
	        }
	        //处理六位的颜色值
	        var sColorChange = [];
	        for (var i=1; i<7; i+=2) {
	            sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
	        }
	        if(opacity!==undefined){
	        	return "RGBA(" + sColorChange.join(",") + ","+opacity+")";
	        }else{
	        	return "RGB(" + sColorChange.join(",") + ")";
	        }
	    }
	    return sColor;
	},

	createObjectURL(blob){
		if(!blob){
			console.log('api---createObjectURL参数错误！！')
			return null;
		}
	    if(window.URL){
	        return window.URL.createObjectURL(blob);
	    } else if (window.webkitURL) {
	        return window.webkitURL.createObjectURL(blob);
	    } else {
	        return null;
	    }
	},
	//async、await中间转换函数
	to(promises){
		return promises.then(data => {
	      	return [null, data];
	  	}) .catch(err => [err]);
	},
	//警告，错误，信息提示函数
	info(str){
		v.$message({
			message:str,
			type:'info'
		})
	},
	warn(str){
		v.$message({
			message:str,
			type:'warning'
		})
	},
	error(str){
		v.$message({
			message:str,
			type:'error'
		})
	},
	success(str){
		v.$message({
			message:str,
			type:'success'
		})
	},
	alert(content, title="提示", options={}){
		v.$alert(content, title , {
	        confirmButtonText: options.buttonText || '确认',
	        callback: action => {
	          		if(options.callback)
	          			options.callback();
	        }
       });
	},
	confirm({content,  title="提示", type="warn"}){
		return new Promise((resolve, reject)=>{
			v.$confirm({
				title: title,
				message: content,
	          	type: type,
			}).then(action=>{
			 	resolve( action );
			}).catch(err=>{
				reject(err);
			});
		});
	},
	//粘贴处理--去除标签
	pasteHandler(e){
		let v= this;
		let _this = v.$refs.write;
        e.preventDefault();
        var text = null;
        if(window.clipboardData && clipboardData.setData) {
            // IE
            text = window.clipboardData.getData('text');
        } else {
            text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
        }
        if (document.body.createTextRange) {
            if (document.selection) {
                textRange = document.selection.createRange();
            } else if (window.getSelection) {
                sel = window.getSelection();
                var range = sel.getRangeAt(0);

                // 创建临时元素，使得TextRange可以移动到正确的位置
                var tempEl = document.createElement("span");
                tempEl.innerHTML = "&#FEFF;";
                range.deleteContents();
                range.insertNode(tempEl);
                textRange = document.body.createTextRange();
                textRange.moveToElementText(tempEl);
                tempEl.parentNode.removeChild(tempEl);
            }
            textRange.text = text;
            textRange.collapse(false);
            textRange.select();
        } else {
            // Chrome之类浏览器
            document.execCommand("insertText", false, text);
        }
	},
	//复制粘贴板
	copyToClipboard(txt) {
		let input = document.createElement('input');
		input.style.opacity= 0;
		input.style.height = 0;
		document.body.appendChild(input);
		input.setAttribute('value',txt);
		input.select();
		if (document.execCommand('copy', false, null)) {
			this.success('复制成功');
		}else{
			this.warn('复制失败');
		}
		document.body.removeChild(input);
    },
}
