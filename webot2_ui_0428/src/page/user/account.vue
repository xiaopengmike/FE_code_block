<template>
	<div class="accountadmin allAccount">
		<h1 class="page_title noBorder">用户</h1>
		<el-row class="action" style="padding-bottom:10px;">
			<el-col :span="10" class="select">
						<el-select v-model="page.q" @change="searchs()" size="small" placeholder="角色">
						    <el-option  v-for="item in options" :key="item.value"  :label="item.label" :value="item.value"></el-option>
					 	</el-select>
					 	&emsp;
						<el-select v-model="page.online" @change="searchs()" size="small" placeholder="请选择" style="width:80px;">
						    <el-option :key="-1"  :label="'全部'" :value="-1"></el-option>
						    <el-option :key="1"  :label="'在线'" :value="1"></el-option>
						    <el-option :key="0"  :label="'离线'" :value="0"></el-option>
					 	</el-select>
					 	&emsp;
						<el-select v-model="page.enabled" @change="searchs()" size="small" placeholder="请选择" style="width:80px;">
						    <el-option :key="-1"  :label="'全部'" :value="-1"></el-option>
						    <el-option :key="1"  :label="'启用'" :value="1"></el-option>
						    <el-option :key="0"  :label="'禁用'" :value="0"></el-option>
					 	</el-select>
			</el-col>
			<el-col :span="14" class="add">
				<button v-authority="'用户管理-增加'" size="small" class="my-btn my-btn-info-o pull-right" @click="edit(), isAdd=1">添加用户</button>
				<div class="font14 pull-right" style="line-height:32px;">当前在线客服人数：{{online_num}}&emsp;&emsp;&emsp;</div>
			</el-col>
		</el-row>
		<div>
			<div class="table_wrap">
				<div class="table4 simulate_table">
					<ul class="thead">
						<li class="tr">
							<div class="th">账号</div>
							<div class="th">昵称</div>
							<div class="th">用户名</div>
							<div class="th">角色</div>
							<div class="th">是否可用</div>
							<div class="th">创建时间</div>
							<div class="th" authority="'下线客服'">强制下线</div>
							<div class="th">操作</div>
						</li>
					</ul>
					<ul class="tbody">
						<li class="tr" v-for="(item,index) in List">
							<div class="td" :title="item.account">
								<b class="cycl" :class="item.status==1?'online':''"></b>&emsp;{{$api.截取字段(item.account,10)}}
							</div>
							<div class="td" :title="item.nickname">{{$api.截取字段(item.nickname,10)||'--'}}</div>
							<div class="td">{{item.username||'--'}}</div>
							<div class="td">{{$store.state.global.enums.user_role[item.role].name}}</div>
							<div class="td">{{item.enabled  | enums('user_enable')}}</div>
							<div class="td">{{$api.dateFormat('yyyy-MM-dd',item.created)}}</div>
							<div class="td">
								<span v-if="item.status==1&&$store.state.global.enums.user_role[item.role].weight<$store.state.global.enums.user_role[$store.state.global.user.role].weight" @click="offline(item.id)"  authority="'下线客服'" class="hover_c_13a0e3 pointer">下线</span>
							</div>
							<div class="td">
								<span v-if="$store.state.global.enums.user_role[item.role].weight<$store.state.global.enums.user_role[$store.state.global.user.role].weight" @click="edit(item.id), isAdd=0"  v-authority="'用户管理-修改'" class="operate-edit pointer">编辑</span>
							</div>
						</li>
					</ul>
				</div><br />
			</div>
			<div class="pagination_wrap text-center" v-if="total>0">
				<!--<pagination :page="page" :total="total" v-on:pageTurn="pageTurn"></pagination>-->
				<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
			</div>
		</div>
		
		<my-modals v-model="show_modal">
	      	<span slot="title">
	      		<span v-show="account.id">修改用户</span>
	      		<span v-show="!account.id">添加用户</span>
	      	</span>
	      	<div slot="content">
	        	<el-form :model="account" :rules="account_rules"  ref="account" class="small_modals">
					<el-form-item label="账号" prop="account" >
						<el-input v-model="account.account"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" >
						<a @click="account.edit_pwd=1;" v-show="account.id && !account.edit_pwd" class="pointer font13">重设密码</a>
						<el-input v-show="!account.id || account.edit_pwd"  v-model="account.password"></el-input>
					</el-form-item>
					<el-form-item label="用户名" prop="username" >
						<el-input v-model="account.username"></el-input>
					</el-form-item>
					<el-form-item label="昵称" prop="nickname" >
						<el-input v-model="account.nickname"></el-input>
					</el-form-item>
					<el-form-item label="角色" prop="role" >
						<el-select v-model="account.role" placeholder="">
							<el-option v-for="item2 in options2" v-if="item2.label!='超级管理员'" :value="Number(item2.value)" :label="item2.label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否可用" prop="enabled" >
						<el-radio-group v-model="account.enabled">
						      <el-radio v-for="(value,key) in enums['user_enable']" :label="key.toString()" >{{value}}</el-radio>
					    </el-radio-group>
					</el-form-item>
				</el-form>
	      	</div>
	      	<div slot="foot">
	        	<button class="btn btn-default" @click="show_modal=false">&emsp;取消&emsp;</button>&emsp;&emsp;
	        	<button class="btn btn-info" @click="submit">&emsp;确定&emsp;</button>
	      	</div>
	    </my-modals>
		<!--<modal v-model="show_modal" size="md" :backdrop='false'>
			<div slot="title" >
			    <h4 class="modal-title">
			      	<b>用户编辑</b>
			    </h4>
			</div>
			<div slot="default" class="modal-body">
				<el-form :model="account" :rules="account_rules"  label-width="100px"  ref="account">
					<el-form-item label="账号" prop="account" >
						<el-input v-model="account.account"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" >
						<span @click="account.edit_pwd=1;" v-show="account.id && !account.edit_pwd" class="pointer font13">重设密码</span>
						<el-input v-show="!account.id || account.edit_pwd"  v-model="account.password"></el-input>
					</el-form-item>
					<el-form-item label="用户名" prop="username" >
						<el-input v-model="account.username"></el-input>
					</el-form-item>
					<el-form-item label="昵称" prop="nickname" >
						<el-input v-model="account.nickname"></el-input>
					</el-form-item>
					<el-form-item label="角色" prop="role" >
						<el-select v-model="account.role" placeholder="">
							<el-option v-for="item2 in options2" v-if="item2.label!='超级管理员'" :value="Number(item2.value)" :label="item2.label"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否可用" prop="enabled" >
						<el-radio-group v-model="account.enabled">
						      <el-radio v-for="(value,key) in enums['user_enable']" :label="key">{{value}}</el-radio>
					    </el-radio-group>
					</el-form-item>
				</el-form>
				
			</div>
			<div slot="footer" class="">
			    <button type="button" class="btn btn-default" @click="show_modal = false">取消</button>
			    <button type="button" class="btn btn-success" @click="submit">提交</button>
			</div>
		</modal>-->
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
				isAdd: 0,
				page:{
					page:1,
					size:16,
					q:'',
					online:-1,
					enabled: -1,
				},
				total:0,
				online_num:0,
				account:{
					id:'',
					account: '',
					username: '',
					nickname: '',
					password: '',
					role:null,
					enabled:'1',
					edit_pwd:0,
				},
				account_rules:{
					account:[{required:true,message:'请输入账号',trigger:'blur'}],
					username:[{required:true,message:'请输入用户名',trigger:'blur'}],
					nickname: [{required:true,message:'请输入昵称',trigger:'blur'}],
					password: [{required:false,message:'请输入密码',trigger:'blur'}],
					role: [{type: 'number',required:true,message:'请选择角色',trigger:'blur'}],
				},
				enums:{},
				// 筛选用户下拉列表
				options: [{
			        value: '',
			        label: '全部'
		        }],
		        options2: [],
		        value: ''
				
			}
		},
		created(){
			this.searchs();
			this.getOptions()
			this.enums = this.getEnums();
		},
		computed:{
			
		},
		methods:{
			...mapGetters([
				'getEnums'
			]),
			searchs(first){
				var v = this;
				if(first) v.page.page = 1;
				v.$api.ajax('/users','get',v.page)
				.then(data=>{
					v.List = data.list;
					v.total = data.total;
					v.online_num = data.online_num;
				})
			},
			pageTurn(){
				this.searchs();
			},
			getOptions(){
				let v = this;
				v.$api.ajax('/role','get').then(data=>{
					let key;
					let datas = [];
					let dl = data.list
					for (key in dl){
						let item = {
							"value": dl[key].id, 
							"label": dl[key].name
						};
						v.options.push(item);
						v.options2.push(item);
					};
				})
				// console.info(v.options2)
			},
			edit(id){
				let v = this;
				if(!id){
					v.account = {
						id:'',
						account:"",
						password:'',
						role:null,
						enabled:'1',
					}
					v.show_modal = true;
				}else{
					v.$api.ajax('/users/'+id,"get")
					.then(data=>{
						data.edit_pwd = 0;
						v.account = data;
						v.account.enabled = v.account.enabled.toString();
						v.show_modal = true;
					})
				}
			},
			submit(){
				let v = this;
				this.$refs.account.validate((valid) => {
          			if (valid) {
          				userMessage.password.required = this.isAdd;
						if(v.account.id){
							v.$api.ajax('/users/'+v.account.id,'put',v.account)
							.then(data=>{
								v.$message({
					  				type: 'success',
						            message: '提交成功'
						         });
								v.show_modal = false;
								v.searchs();
							})
						}else{
							v.$api.ajax('/users','post',v.account)
							.then(data=>{
								v.$message({
					  				type: 'success',
						            message: '提交成功'
						         });
								v.show_modal = false;
								v.searchs();
							})
						}
          			}
          		});
			},
			offline(id){
				let v = this;
				v.$api.ajax(`${v.$uri.user.kfStatus}/${id}`,'put', {"status": "0"})
				.then(data=>{
					v.searchs();
				})
			},
		},
		components:{
			pagination,
			Modal,
			mapGetters,
		},
		watch:{
			account:{
				handler(n){
					if(!n.id || n.edit_pwd){
						this.account_rules.password[0].required = true;
					}else{
						this.account_rules.password[0].required = false;
					}
				},deep:true
			}
		}
	}
</script>

<style lang="scss">
	$th_widths:(15%,15%,15%,10%,12%,15%,10%,8%);
	.allAccount {
		.simulate_table {
			.th,.td {
				@for $i from 1 through length($th_widths) {
					&:nth-child(#{$i}) {width:nth($th_widths,$i)}
				}
			}
		}
	}
	#account {padding: 20px}
	#account th, 
	#account td {padding: 0 10px;}
	#account td .cycl {display:inline-block; width:10px; height:10px; border-radius:10px; background:#c7c7c7;}
	#account td .cycl.online {background:#5ad845;}
	#account .tables {width:98%; margin:1%;}
	#account input[type='radio'] {margin:0;}
	#account .action {margin: 15px 15px 0;}
	.hover_c_13a0e3:hover {color:#13a0e3;}
</style>
