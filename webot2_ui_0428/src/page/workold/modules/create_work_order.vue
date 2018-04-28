<template>
    <div id="create_work_order">
        <my-modals v-model="show">
          <span slot="title">创建工单</span>
          <div slot="content">
            <el-form :model="workorder" :rules="workorder_rules" ref="workorder" class="small_modals">
              <el-form-item label="工单标题" prop="title">
                <el-input v-model="workorder.title"></el-input>
              </el-form-item>
              <el-form-item label="工单描述" prop="content">
                <el-input type="textarea" v-model="workorder.content"></el-input>
              </el-form-item>
              <div class="upload">
                <upload v-if="workorder.uploads.length<5"  :action="$uri.upload.file" size="20M" :success="uploadSuccess" :error="uploadError_mixin" :before="beforeUpload_mixin" >
                                <span class="upload_text pointer">
                                    <i class="fa fa-papperclip" aria-hidden="true"></i>
                                    上传文件
                                </span>
                  <small>单个附件不可超过20M，最多可上传5个附件</small>
                </upload>
                <div class="file" v-for="(f,i) in workorder.uploads">
                  <i class="fa fa-file" ></i>
                  <span class="name" :title="f.name">{{f.name}}</span>
                  <!--<span class="upload_text pointer" @click="$api.checkFile(f.url,f.name,f.type)">查看</span>-->
                  <span class="upload_text pointer" @click="$api.downloadFromService(f.name,f.url)">下载</span>
                  <b class="close" @click="workorder.uploads.splice(i,1)">×</b>
                  <div class="progress"></div>
                </div>
              </div>

              <el-form-item label="分类" >
                <el-select v-model="workorder.tag1" placeholder="" @change="workorder.tag2=''">
                  <el-option v-for="item2 in ctags" :value="item2.id" :label="item2.name"></el-option>
                </el-select>
                <el-select v-model="workorder.tag2" placeholder="">
                  <el-option v-for="item2 in tag2" :value="item2.id" :label="item2.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="受理人" >
                <el-select v-model="workorder.user_id" placeholder="">
                  <el-option v-for="item in $store.state.service.kfs" :value="item.id" :label="item.username"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名" >
                <el-input v-model="workorder.nickname" icon="search" :on-icon-click="searchUser" class="customer-search"
                placeholder="请输入完整的姓名">
                </el-input>
                <el-select v-model="customer_id" placeholder="" class="customer-select" @change="bindCustomer">
                  <el-option v-for="customer in customers" :value="customer.uid" :label="customer.nickname">
                      <img :src="customer.head" class="customer-head"></img>
                      <span>{{customer.nickname}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="email" label="邮箱">
                <el-input v-model="workorder.email"></el-input>
              </el-form-item>

              <el-form-item label="手机" prop="mobile">
                <el-input v-model="workorder.mobile"></el-input>
              </el-form-item>

            </el-form>

          </div>
          <div slot="foot">
            <button class="my-btn my-btn-transparent" @click="show=false">&emsp;取消&emsp;</button>&emsp;&emsp;
            <button class="my-btn my-btn-info-f" @click="update">&emsp;确定&emsp;</button>
          </div>
        </my-modals>
    </div>
</template>

<script>
    import upload from '../../module/upload'
    import upload_mixin from '../../module/upload_mixin.js'
    export default {
        mixins:[upload_mixin],
        props:{
            work_order: {
                required: false,
                type: Object,
            },
            value:{
                type:Boolean,
                default:false
            },
            create_success:{
                required: false,
                type: Function,
            },
            tags:{
                default:()=>{return [];},
                type: Array,
            },
        },
        data(){
            var checkMobile = (rule, value, callback) => {   
                if(value==='' || value===null || value===undefined || value.trim()==='')
                    callback();
                else {
                	if(!(/^1\d{10}$/.test(value))){
                  		callback(new Error('请输入正确的手机号'));
                	}
	                else {
	                  callback();
	                }
                }
            };
            return {
                selectValue: "",
                ctags:[],
                // tags_: this.tags,
                workorder: this.initWorkOrder(),
                customers: [],
                customer_id: "",
                workorder_rules:{
	                title:[{required:true,message:'请输入工单标题',trigger:'blur'}],
	                content:[{required:true,message:'请输入工单描述',trigger:'blur'}],
	                  /*tag: [{required:true,message:'请输入昵称',trigger:'blur'}],
	                            acceptor: [{required:true,message:'请输入密码',trigger:'blur'}],
	                            user_id: [{required:true,message:'请输入密码',trigger:'blur'}],
	                            name: [{required:true,message:'请选择角色',trigger:'blur'}],*/
	                mobile: [ {validator: checkMobile, trigger: 'blur'}],
	                email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
                },
            }
        },

        // created(){
        //     this.initTags();
        // },
        methods:{
            update(){
                let v = this;
                this.$refs.workorder.validate((valid) => {
                    if (valid) {
                        let workorder = v.$api.deepCopy(v.workorder);
                        workorder.action = "创建";
                        console.log(workorder)
                        v.$api.ajax(v.$uri.workold.list,'post',v.workorder)
                        .then(data=>{
                        	v.$message({
                        		type:'success',
                        		message:'创建成功！'
                        	})
                            v.show=false;
                            v.$emit('update-success',true);
                        })
                    }
                });
            },
            genWorkOrder(){
                return {
                    title:'',
                    content:'',
                    uploads:[],
                    tag1:'',
                    tag2:'',
                    acceptor:'',
                    user_id:'',
                    status:0,
                    creator_id:'',
                    uid: "",
                    nickname: "",
                    email: "",
                    mobile: "",
                }
            },
            initTags(){
               
                this.$api.ajax(this.$uri.workold.tags, 'get').then(data =>{
                    this.ctags = data;
                })
                
            },
            initWorkOrder(){
                let w_o = this.genWorkOrder()
                // 获取传入的work_order字段
                console.log(this.work_order)
                for(let key in this.work_order){
                    w_o[key] = this.work_order[key]
                }
                return w_o
            },
            bindCustomer(id){   

                let customer = "";
                for(let index in this.customers){
                    if(this.customers[index].uid==id){
                        customer = this.customers[index]
                        break;
                    }
                }
                this.workorder.uid = customer.uid;
                this.workorder.nickname = customer.nickname;
                this.workorder.email = customer.email;
                this.workorder.mobile = customer.mobile||'';
            },
            searchUser(ev){
                if(!this.workorder.nickname) return;
                let input = document.getElementsByClassName("el-icon-search")[0].parentElement;
                let select = input.nextElementSibling;
                this.$api.ajax(this.$uri.workold.游客, 'get', {nickname: this.workorder.nickname}).then(data =>{
                    this.customers = data;
                    select.querySelector(".el-icon-caret-top").click();
                })
            },
            uploadSuccess(res,file){
                this.uploadSuccess_mixin(res);
                let data = {
                  name:file.name,
                  url:res.url,
                  size:file.size
                };
                this.workorder.uploads.push(data)
            },
        },
        computed: {
            tag2(){
                let tag ;
                for(let i in this.ctags){
                    if(this.ctags[i].id == this.workorder.tag1){
                        tag = this.ctags[i].child;
                        break;
                    }
                }
                return tag;
            },
            show: {  
                get:function() {
                    this.workorder=this.initWorkOrder();
                    if(this.tags.length>0){
                        this.ctags = this.tags;
                    }else{
                        this.initTags();
                    }
                    
                    return this.value; 
                },  
                set:function(val) {  
                    this.$emit('input', val); 
                }  
            }  
        },
        components:{
            upload
        }
    }
</script>

<style lang="scss">
    $color1:#1f89f6;
    #create_work_order{    
        .upload {
          margin-bottom:22px;
          .upload_text{
            color:$color1;
          }
          small {color:#cdd4d8;}
          .file {
            border:1px solid #eff5f8;
            background:#f7fafc;
            position:relative;
            padding:0 10px;
            color:#8b99a7;
            font-size: 14px;
            & > * {vertical-align:middle;display:inline-block; line-height:25px;;}
            .name{width:220px; overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;}
            .upload_text {width:40px; text-align:center;}
            .close {font-size:28px;line-height:24px; }
            .progress{position:absolute;top:0; left:0; height:100%; background:lighten(yellow,15%); }
          }
        }
    }
    $headSize: 26px;
    .el-select-dropdown__item{
        padding: 6px 10px;
    }
    .customer-select{
        width: 100%;
    }
    .customer-head{
        width: $headSize;
        height: $headSize;
        background: white;
        border-radius: 50%;
    }
    .customer-search{
        position: absolute;
        z-index: 10;
    }
</style>