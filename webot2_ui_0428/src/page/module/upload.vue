<template>
	<div class="__upload"  @click="click">
		<slot></slot>
		<input type="file" name="file" ref="input" :accept="accept" @change="change" />
	</div>
</template>

<script>
	const Upload = class  {
		constructor(file, action, type, data, header){
			this.action = action;
			this.type = type;
			this.data = data;
			this.header = header;
			this.id = new Date().getTime();
			this.file = file;
			this.before_upload_data = null;
		};
		doUpload(success, error, progress, finish ){
			let v = this, file = this.file;
			console.info("uploading ....");
			let formdata = new FormData();
		    formdata.append('file',file);
		    if(v.data){
		    	for(let p in v.data)
		    		formdata.append(p,v.data[p]);
		    }
		    let xhr = new XMLHttpRequest();
		    xhr.open(v.type,v.action,true);
		    if(v.headers){
		    	for(let h in v.headers){
		    		xhr.setRequestHeader(h, v.headers[h]);
		    	}
		    }
		    xhr.onreadystatechange=function(){
		    	if(xhr.readyState == 4 && xhr.status == 200){
		    		let result = JSON.parse(xhr.responseText);
		    		if(result.code==0){
		    			progress(1, v.before_upload_data, xhr);   //返回xhr实例，可用于阻止上传操作
		    			success(result.data,file,v.before_upload_data);
		    			finish( v.id );
		    		}else{
		    			error(result.msg,file,v.before_upload_data);
		    		}
		    	}
		    	if(xhr.status > 400){
		    		error(xhr.statusText,file,v.before_upload_data);
		    	}
		    };
		    xhr.upload.onprogress = function (evt) {
                if (evt.lengthComputable) {
                    let percentComplete = Math.round(evt.loaded / evt.total);
                   	progress(percentComplete,v.before_upload_data,xhr);   //返回xhr实例，可用于阻止上传操作
                }
            };
            xhr.send(formdata);
		}
	};
	export default{
		props:{
			accept:{
				type:String,
				default:'',
			},
			action:{
				required:true,
				type:String,
			},
			type:{
				default:'post'
			},
			//{max:"100M",min:'2M'}或'100M'   当为整数时，指的是最大值
			size:{
				default:'5M',//K,M,G
			},
			//和文件一同发送给服务器的数据
			data:{
				type:Object,
			},
			headers:{
				type:Object,
			},
			success:{
				type:Function,
				default:()=>{},
			},
			error:{
				type:Function,
				default:()=>{},
			},
			before:{
				type:Function,
				default:()=>{return true},
			},
			progress:{
				type:Function,
				default:()=>{},
			},
			value:{                //外部源（可直接上传）
				required:false
			},
		},
		data(){
			return {
				Upload : Upload,
				instances: { },         //上传的特殊标记
			}
		},
		computed:{
			currentValue: {
		        get:function() {
		          return this.value;
		        },
		        set:function(val) {
		          this.$emit('input', val);
		        }
		    }
		},
		methods:{
			click(){
				this.$refs.input.click();
			},
			change(e){
				let v = this;
				let file = e.target.files[0];
				v.beforeUpload(file);
			},
			async beforeUpload(file){
				let v = this, err, before_upload_data = true;
				if(!v.typeTest(file)) return;
				if(!v.sizeTest(file)) return;
				if(typeof v.before == 'function'){
					[err, before_upload_data] = await v.to(v.before(file));
				if(before_upload_data===undefined || before_upload_data===false ||before_upload_data===null) {
						v.clear();
						return false;
					};
				}
				let instance = new Upload(file, v.action, v.type, v.data, v.header);
				instance.before_upload_data = before_upload_data;
				v.instances[ instance.id ] = instance;

				instance.doUpload(v.success, v.error, v.progress, v.finish);

				v.clear();
			},
			finish(id){
				delete this.instances[id];
			},
			clear(){
				let v = this;
				if(v.currentValue&&v.currentValue.name)
    				v.currentValue = {};
    			else
	            	this.$refs.input.value='';
			},
			typeTest(f){
				let v = this;
				let reg = /.+\.([a-zA-Z]+)$/;
				// console.info("test type --> "+f.type)
				let type = f.type.split("/")[0];
				if((v.accept.indexOf(type.toLocaleLowerCase())==-1 && !new RegExp(v.accept,'gi').test(f.type)) && v.accept!==''){
					v.error('文件格式错误，请上传'+v.accept+'格式文件');
					this.$refs.input.value='';
					return false;
				}
				return true;
			},
			sizeTest(f){
				let v = this;
				if(v.size){
					if(typeof v.size === 'object'){
						if(v.size.max){
							let num = v.size.max.match(/\d+/g)[0];
							let level = v.size.max.match(/[kKmMgG]/g)[0];
							let multiple = 1;
							if(level=='k'||level=='K') multiple = 1024;
							if(level=='m'||level=='M') multiple = 1024*1024;
							if(level=='g'||level=='G') multiple = 1024*1024*1024;
							if(num*multiple<f.size){
								v.error('请上传小于'+v.size.max+'的文件');
								this.$refs.input.value='';
								return false;
							}
						}
						if(v.size.min){
							let num = v.size.min.match(/\d+/g)[0];
							let level = v.size.min.match(/[kKmMgG]/g)[0];
							let multiple = 1;
							if(level=='k'||level=='K') multiple = 1024;
							if(level=='m'||level=='M') multiple = 1024*1024;
							if(level=='g'||level=='G') multiple = 1024*1024*1024;
							if(num*multiple>f.size){
								v.error('请上传大于'+v.size.min+'的文件');
								this.$refs.input.value='';
								return false;
							}
						}
					}else{
						let num = v.size.match(/\d+/g)[0];
						let level = v.size.match(/[kKmMgG]/g)[0];
						let multiple = 1;
						if(level=='k'||level=='K') multiple = 1024;
						if(level=='m'||level=='M') multiple = 1024*1024;
						if(level=='g'||level=='G') multiple = 1024*1024*1024;
						if(num*multiple<f.size){
							v.error('请上传小于'+v.size+'的文件');
							this.$refs.input.value='';
							return false;
						}
					}
				}
				return true;
			},
			to(promises){
				if(promises instanceof Promise ){
					return promises.then(data => {
				      	return [null, data];
				  	}) .catch(err => [err]);
				}else{
					return [ null, promises ]
				}
			}
		},
		watch:{
			currentValue:{
				handler(n){
					if(n.name!==undefined)
						this.beforeUpload(n);
				},deep:true,
			}
		}
	}
</script>

<style>
	.__upload {display:inline-block; position:relative;}
	.__upload input[type="file"] {position:absolute; top:0; left:0; width:100%; height:100%; z-index:50; display:none;}
</style>
