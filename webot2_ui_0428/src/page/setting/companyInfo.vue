<template>
    <div class="company-info setting">
        <article>
            <header>
                <h2>公司信息</h2>
            </header>
            <section>
                <div>
                    <label>域名</label>
                    <input type="text" v-model="company.domain"  readonly="readonly" class="no-border">
                </div>
                <div>
                    <label>公司名</label>
                    <input type="text" placeholder="公司名" v-model="company.name">
                </div>
                <div>
                    <label>联系人</label>
                    <input type="text" placeholder="联系人" v-model="company.username">
                </div>
                <div>
                    <label>联系电话</label>
                    <input type="text" placeholder="联系电话" v-model="company.mobile">
                </div>
                <div>
                    <label>公司邮箱</label>
                    <input type="text" placeholder="公司邮箱" v-model="company.email">
                </div>
                <div>
                    <label>公司地址</label>
                    <input type="text" placeholder="公司地址" v-model="company.address">
                </div>
                
            </section>
        </article>
        <article>
        	<header>
                <h2>公司logo</h2>
            </header>
        	<section>
        		<div class="set-logo">
                	
                	<label class="text-center img">
                		<img :src="company.logo" alt="">
                	</label>
                		
                		<el-button class="pointer" @click="show_crop=!show_crop">上传图片</el-button>
                		<upload field="file"
						:width="65"
						:height="65"
						:url="$uri.upload.file"
						@crop-success="cropSuccess"
				        @crop-upload-success="cropUploadSuccess"
				        @crop-upload-fail="cropUploadFail"
				        v-model="show_crop" 
						></upload>
                		<!--<upload :action="'/api/chats/upload/logo'" :accept="'image/*'" :success="successUpload" :error="errorUpload">
	                        <el-button class="pointer">上传图片</el-button>
	                   </upload>--><br />
                	<label class="text-center"><small>(70x70)</small></label>
                </div>
           	 	<el-button type="primary" @click="submit" :disabled="change_company?false:true">保存</el-button>
        	</section>
        </article>
    </div>
</template>
<script>
    import upload from '../module/image-crop-upload'
    import subNav from '../module/subNavVertical.vue'
    
    export default {
        props:{},
        data(){
            return {
                re_password: '',
                company: {
                    id: 0,
                    name: '',
                    logo: '',  
                    domain: '',
                    username: '',
                    mobile: '',
                    email: '',
                    address: ''
                },
                change_company:false,
                validate: {
                    mobile: {
                        required:0,
                        type:'mobile',
                        name:'联系电话',
                    },
                    email: {
                        required:0,
                        type:'email',
                        name:'公司邮箱',
                    }
                },
                show_crop:false,
            }
        },
        created(){
            this.getSettings();
        },
        methods:{
            submit(password){
                var [isOk, msg] = this.$api.validate(this.validate, this.company)
                if(!isOk){
                    this.$message({type: 'error', message: msg})
                    return ;
                }
                console.log("company", this.company)
                this.$api.ajax('/company','put', this.company).then(data=>{
                        this.$message({
                            type: 'success',
                            message: "修改成功"
                        })
                        this.change_company=false;
                        this.$store.state.global.enums.logo = this.company.logo;
                })
            },
            getSettings(){
                this.$api.ajax('/company','get')
                .then(data=>{
                    if(data.domain != null){
                        this.company = data;
                        setTimeout(()=>{
                        	this.change_company=false;
                        },200)
                    }
                })
            },
            successUpload(result,file){
                this.company.logo = result.url;        
            },
            errorUpload(msg,file){
                let v= this;
                v.$message({
                    message:msg,
                    type:'error',
                })
            },
			cropSuccess(imgDataUrl, field){
				console.log('-------- crop success --------');
				
			},
			cropUploadSuccess(data, field){
				if(data.code==0){
					this.company.logo = data.data.url+'?r='+Math.random();
				}else{
					this.$message({
						message:data.msg,
						type:'error'
					})
				}
			},
			cropUploadFail(status, field){
				console.log('-------- upload fail --------');
				console.log(status);
				console.log('field: ' + field);
			}
        },
        beforeRouteLeave (to,from,next){   
        	if(this.change_company){
        		this.$confirm(
        			'您有数据未保存，确定要离开吗？', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	next();
			        }).catch(() => {
			           next(false);
			        });
			
        	}
        	else{
        		next();
        	}
        },
        components:{
            subNav,
            upload
        },
        watch:{
        	'company':{
        		handler:function(n){
        			this.change_company=true;
        		},
        		deep:true,
        	}
        }
    }
</script>
<style lang="scss" >
.company-info{
	article {
		section{
			margin-left:50px;
			.set-logo {
				.img {height:70px; width:70px; border-radius:50px; background:#eee; }
				img {width: 100%; height: 100%; border-radius:50px;}
			}
		}
	}
}
    .company-info .no-border {border: none}
    .company-info h2{font-size: 2rem; padding: 10px 0; font-weight: 700}

    .company-info > article > header {border-bottom: solid 1px #000;}
    .company-info header p {margin: 0px}
    .company-info h3{font-size: 1.6rem; margin: 20px 0 10px 0;}
    .company-info p {margin: 0 0 10px 0; color: #999;}
    .company-info section > div{margin-top: 30px;}
    .company-info section input {height: 40px; width: 340px; border: 1px solid #e6eaeb; padding: 10px}
    .company-info section label{width:70px; margin-right: 30px; font-size: 1.6rem; font-weight: 400}
    .company-info .el-button{ }
    .company-info .logo-img img { width: 100px; height: 100px; }
</style>
