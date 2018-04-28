<template>
    <div id="set-role">
        <el-row class="action">
            <!-- 角色筛选 -->
            <el-col :span="12" class="select">
                <el-select v-model="page.q" @change="searchs()" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            
            <!-- 添加角色按钮 -->
            <el-col :span="12" class="add">
                <button v-authority="'修改用户'" class="btn btn-info pull-right" @click="edit()">添加角色</button>
            </el-col>
        </el-row>
        
        <div>
            <!-- 表单 -->
            <div>
                <table class="tables">
                    <tr>
                        <th>角色名称</th>
                        <th>角色类型</th>
                        <th>描述</th>
                        <th>操作</th>
                    </tr>
                    <tbody>
                        <tr v-for="(item,index) in roles">
                            <td>{{item.name}}</td>
                            <td>{{item.role}}</td>
                            <td>{{item.describe}}</td>
                            <td>
                                <span v-if="item.id!=1" @click="edit(item)"  v-authority="'修改用户'" class="glyphicon glyphicon-pencil"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 分页 -->
            <div class="pagination_wrap">
                <pagination :page="page" :total="total" v-on:pageTurn="pageTurn"></pagination>
            </div>
        </div>
        
        <!-- 编辑表单 -->
        <modal v-model="show_modal" size="md" :backdrop='false'>
            <div slot="title" >
                <h4 class="modal-title">
                    <b>用户编辑</b>
                </h4>
            </div>
            <div slot="default" class="modal-body">
                <form class="form-horizontal" role="form" >
                    <div class="form-group">
                        <label class="col-sm-2">角色类型<span class="red">&emsp;*</span></label>
                        <div class="col-sm-9" v-show="true">
                            <input v-model="role.role" readonly="readonly" class="form-control" placeholder="" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2">角色名称</label>
                        <div class="col-sm-9">
                            <input v-model="role.name" class="form-control" placeholder="" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2">角色描述</label>
                        <div class="col-sm-9">
                            <textarea v-model="role.describe"></textarea>
                        </div>
                    </div>
                </form>     
            </div>
            <div slot="footer" class="">
                <button type="button" class="btn btn-default" @click="show_modal = false">取消</button>
                <button type="button" class="btn btn-success" @click="submit">提交</button>
            </div>
        </modal>

    </div>
</template>

<script>
    import pagination from '../module/pagination'
    import Vue from 'vue'
    import {Modal} from 'uiv'
    import {mapGetters} from 'vuex'
    import userMessage from '../../Validation/userMessage'
    export default{
        data(){
            return {
                show_modal:false,
                List:[],
                page:{
                    page:1,
                    size:14,
                    q:'',
                },
                total:0,
                // account:{
                //     id:'',
                //     username:"",
                //     password:'',
                //     role:3,
                //     enabled:1,
                //     edit_pwd:0,
                // },
                role:{
                    id: '',
                    name: '',
                    role: '',
                    describe: '',
                },
                roles:[this.role],
                enums:{},
                // 筛选用户下拉列表
                options: [{
                    value: '',
                    label: ''
                }],
                value: ''
                
            }
        },
        created(){
            this.searchs();
            // this.getOptions();
            this.enums = this.getEnums();
            this.getRoles();
        },
        computed:{
            
        },
        methods:{
            ...mapGetters([
                'getEnums'
            ]),
            searchs(first){
                var v = this;
                if(arguments.length>1) 
                    v.page.q = arguments[1];
                if(first) 
                    v.page.page = 1;
                v.$api.ajax('/role','get',v.page)
                .then(data=>{
                    v.roles = this.formatRoles(data.list);
                    v.total = data.total;
                })
            },
            pageTurn(){
                this.searchs();
            },

            myAjax(url, method, data, msg){
                this.$api.ajax(
                        url,
                        method, 
                        data
                    ).then(data=>{
                        this.$message({
                            type: 'success',
                            message: msg
                        })
                        // refresh
                        this.searchs()
                    })
            },
            formatRoles(datas){
                var _list = [];
                datas.forEach((role, index)=>{
                    _list.push({
                        'id': role.id,
                        'name': role.name,
                        'role': role.name,
                        'describe': ''
                    });
                });
                return _list;
            },
            getRoles(){
                this.$api.ajax(
                    '/role',
                    'get',
                    {'page': 1, 'size':1000}
                ).then(data=>{
                    var datas = data.list;
                    this.roles = this.formatRoles(datas);
                    console.info("用户角色",this.roles)
                    this.setOptions(datas);
                })
            },
            setOptions(datas){
                var _list = [{"value": "", "label":"所有类型"}];
                datas.forEach((role, index)=>{
                    _list.push({
                        "value": role.id, 
                        "label": role.name
                    })
                })
                console.info("选项",datas);
                this.options = _list;
            },
            editRole(roleId){

            },
            edit(item){
                this.role = item;
                this.show_modal = true;
            },
            submit(){
                var [x,y] = this.$api.validate(userMessage,this.account);
                if(!x){
                    alert(y,'danger');
                    return false;
                }
                var v = this;
                if(v.account.id){
                    v.$api.ajax('/users/'+v.account.id,'put',v.account)
                    .then(data=>{
                        alert('提交成功');
                        v.show_modal = false;
                        v.searchs();
                    })
                }else{
                    v.$api.ajax('/users','post',v.account)
                    .then(data=>{
                        alert('提交成功');
                        v.show_modal = false;
                        v.searchs();
                    })
                }
            },
        },
        components:{
            pagination,
            Modal,
            mapGetters,
        },
    }
</script>

<style>
    #set-role {padding: 20px}
    #set-role th, 
    #set-role td {padding: 0 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100px}
    #set-role .tables {width:98%; margin:1%;}
    #set-role input[type='radio'] {margin:0;}
    #set-role .action {margin: 15px 15px 0;}
    #set-role .modal-body textarea { width: 100%; height: 10rem }
</style>
