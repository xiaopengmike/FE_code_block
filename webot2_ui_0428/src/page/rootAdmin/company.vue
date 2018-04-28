<template>
    <div id="root-company">
<!--        <div id="subNav">
            <button v-authority="'修改用户'" class="btn btn-info pull-right" @click="edit()">添加用户</button>
        </div>   -->    
        
        <aside>
            <ul>
                <li>公司列表</li>
                <li v-for="(cp, idx) in companys" @click="choiseCompany(idx)">{{cp.name}}</li>
            </ul>
        </aside>        

        <div class="detail">
            <div class="right-btn">

            </div>
            <ul>
                <li>
                    <el-row>
                        <el-col :span="12">公司名称</el-col>
                        <el-col :span="12">{{companys[index].name}}</el-col>
                    </el-row>
                </li>
                <li>
                    <el-row>
                        <el-col :span="12">联系人</el-col>
                        <el-col :span="12">{{companys[index].username}}</el-col>
                    </el-row>
                </li>
                <li>
                    <el-row>
                        <el-col :span="12">电子邮件</el-col>
                        <el-col :span="12">{{companys[index].email}}</el-col>
                    </el-row>
                </li>
                <li>
                    <el-row>
                        <el-col :span="12">电话</el-col>
                        <el-col :span="12">{{companys[index].mobile}}</el-col>
                    </el-row>
                </li>
                <li>
                    <el-row>
                        <el-col :span="12">机器人地址</el-col>
                        <el-col :span="12">{{companys[index].bot_url}}</el-col>
                    </el-row>
                </li>
                <li>
                    <el-row>
                        <el-col :span="12">域名</el-col>
                        <el-col :span="12">{{companys[index].domain}}</el-col>
                    </el-row>
                </li>
                <li>
                    <el-row>
                        <el-col :span="12">密码</el-col>
                        <el-col :span="12">{{companys[index].password}}</el-col>
                    </el-row>
                </li>
            </ul>
            <div class="right-btn">
                <el-button @click="showTable=true,tableName='新建公司',temp_company=copyObject(new_company)">新建</el-button>
                <el-button @click="toChange(index)">修改</el-button>
                <el-button @click="$api.downloadFromService('知识库.xlsx','/api/export?type=question&cid='+companys[index].id)">导出知识库</el-button>
                <el-button @click="$api.downloadFromService('知识库.xlsx','/api/export?type=entity&cid='+companys[index].id)">导出相似词</el-button>
            </div>
        </div>        
    
        <modal size="md" v-model="showTable" :backdrop='false'>
            <div slot="title" >
                <h4 class="modal-title">
                    <b>{{tableName}}</b>
                </h4>
            </div>
            <el-form :label-position="'right'" label-width="100px" :model="temp_company">
                <el-form-item label="公司名称">
                    <el-input v-model="temp_company.name"></el-input>
                </el-form-item>
                <el-form-item label="联系人">
                    <el-input v-model="temp_company.username"></el-input>
                </el-form-item>
                <el-form-item label="电子邮件">
                    <el-input v-model="temp_company.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="temp_company.mobile"></el-input>
                </el-form-item> 
                <el-form-item label="机器人地址">
                    <el-input v-model="temp_company.bot_url"></el-input>
                </el-form-item>
                <el-form-item class="domain" label="域名">
                    <el-input v-model="temp_company.domain"></el-input>
                    <span>{{company_postfix}}</span>
                </el-form-item>      
                <el-form-item label="密码">
                    <el-input type="password" v-model="temp_company.password"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="">
                <button type="button" class="btn btn-default" @click="showTable = false">取消</button>
                <button type="button" class="btn btn-success" @click="submit">提交</button>
            </div>
        </modal>
    </div>
</template>

<script>
    import pagination from '../module/pagination'
    import validate from '../../Validation/rootAdmin.js'
    import Vue from 'vue'
    import {Modal} from 'uiv'
    import {mapGetters} from 'vuex'
    import userMessage from '../../Validation/userMessage'
    export default{
        data(){
            return {
                q: "",
                index: "0",
                company_postfix: "",
                showTable: false,
                tableName: "",
                temp_company: {},
                new_company: {
                    id: "",
                    domain: "",
                    name: "",
                    username: "",
                    mobile: "",
                    email: "",
                    robotUrl: "",
                    bot_url: ""
                },          
                companys:[{
                    id:"",
                    bot_url: "",
                    domain: "test",
                    username: "",
                    name: "test",
                    mobile: "10086",
                    email: "112@qq.com",
                    robotUrl: "www.test.com"
                }],
                // 筛选用户下拉列表
                options: [{
                    value: '1',
                    label: '公司1'
                }],
            }
        },
        created(){
            this.company_postfix = this.getEnums.company_postfix;
            this.getCompanys()
            // this.getOptions()
        },
        computed:mapGetters([
            'getEnums',
        ]),
        methods:{
            toChange(index){
                this.showTable=true;
                this.tableName='修改公司';
                this.temp_company=this.copyObject(this.companys[index]);
                this.temp_company.domain = this.temp_company.domain.replace(this.getEnums.company_postfix, "");
            },
            getCompanys(){
                this.$api.ajax('/admin/company','get').then(data=>{
                    this.companys=data;
                })
                this.showTable = false;
            },
            genPost(data){
                let _data = {};
                for(var key in data){
                    if(key == "domain"){
                        _data.domain = data.domain + this.company_postfix;
                    }else if(key == 'bot_url'){
                        _data.bot_url = data.bot_url.replace(/\/$/, "");
                    }else{
                        _data[key] = data[key]
                    }
                }
                return _data;
            },
            newCompany(){
                var [isOk, msg] = this.$api.validate(validate, this.temp_company)
                if(!isOk) {
                    this.$message({
                        type: "error",
                        message: msg
                    })
                    return;
                }
                this.$api.ajax('/admin/company','post', this.genPost(this.temp_company)).then(data=>{
                    this.showTable = false;
                    this.companys.push(this.temp_company);
                    this.index = this.companys.length-1;
                })
            },
            changeCompany(){
                var changeValidate = JSON.parse(JSON.stringify(validate))
                console.info(changeValidate)
                changeValidate.password.required=0;
                var [isOk, msg] = this.$api.validate(changeValidate, this.temp_company)
                if(!isOk) {
                    this.$message({
                        type: "error",
                        message: msg
                    })
                    return;
                }
                this.$api.ajax('/admin/company/'+this.temp_company.id,'put', this.genPost(this.temp_company)).then(data=>{
                    this.getCompanys();
                })
            },
            submit(){
                if(this.tableName == "修改公司"){
                    this.changeCompany();
                }
                else if(this.tableName == "新建公司"){
                    this.newCompany();
                }
            },
            exportExcel(name){
                if(name == "knowlege"){
                    var args = {"type": "question"}
                    this.$api.ajax('/export', 'get', args).then(data=>{
                        this.$api.downloadFromService("知识库.xlsx", '/export');
                    })
                }
            },
            choiseCompany(idx){
                this.index  = idx;
            },
            copyObject(obj){
                return Object.assign({}, obj);
            },
        //     pageTurn(){
        //         this.searchs();
        //     },
        //     getOptions(){
        //         var v = this;
        //         v.$api.ajax('/role','get').then(data=>{
        //             var key;
        //             var datas = [];
        //             var dl = data.list
        //             for (key in dl){
        //                 var item = {
        //                     "value": dl[key].id, 
        //                     "label": dl[key].name
        //                 };
        //                 datas.push(item);
        //             };
        //             console.info(datas);
        //             v.options = datas;
        //         })
        //     },
        //     edit(id){
        //         var v = this;
        //         if(!id){
        //             v.account = {
        //                 id:'',
        //                 username:"",
        //                 password:'',
        //                 role:3,
        //                 enabled:1,
        //             }
        //             v.show_modal = true;
        //         }else{
        //             v.$api.ajax('/users/'+id,"get")
        //             .then(data=>{
        //                 data.edit_pwd = 0;
        //                 v.account = data;
        //                 v.show_modal = true;
        //             })
        //         }
        //     },
        //     submit(){
        //         var [x,y] = this.$api.validate(userMessage,this.account);
        //         if(!x){
        //             alert(y,'danger');
        //             return false;
        //         }
        //         var v = this;
        //         if(v.account.id){
        //             v.$api.ajax('/users/'+v.account.id,'put',v.account)
        //             .then(data=>{
        //                 alert('提交成功');
        //                 v.show_modal = false;
        //                 v.searchs();
        //             })
        //         }else{
        //             v.$api.ajax('/users','post',v.account)
        //             .then(data=>{
        //                 alert('提交成功');
        //                 v.show_modal = false;
        //                 v.searchs();
        //             })
        //         }
        //     },
        // },
        },
        components:{
            pagination,
            Modal,
            mapGetters,
        },
    }
</script>

<style>
    #root-company {height: calc(100vh - 70px); overflow-y: auto; position: relative;}
    #root-company aside { padding: 20px 0 0;overflow: auto }
    #root-company .detail{
        padding: 20px 0 0 20px;
    }
    #root-company aside li { padding: 10px 0 10px 20px; cursor: pointer;}
    #root-company aside li:nth-child(1):hover { background: inherit; }
    #root-company aside li:hover { background: #ccc; }
    #root-company aside {height: 100%; position: absolute; width: 180px; border-right: solid 1px;}
    #root-company .right-btn { text-align: right; }
    #root-company .detail {margin-left: 180px; max-width: 1000px; padding-right: 20px}
    #root-company .detail ul {margin: 20px 0;}
    #root-company .detail li .el-col{ padding: 15px;}
    #root-company .detail li .el-col:nth-child(1) {border-right: solid 2px #fff;}
    #root-company .detail li:nth-child(2n+1) {background:#C0CCDA; border: solid 1px #fff;}
    #root-company .detail li:nth-child(2n+2) {background: #E5E9F2; border: solid 1px #fff;}
    #root-company .domain .el-input {width: auto}
</style>
