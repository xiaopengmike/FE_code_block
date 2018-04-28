<template>
	<div class="systemlogs recycle">
		<h1 class="page_title">
			回收站
		</h1>
		<div class="input-group serach_wrap clearfix">
		  	<span class="input-group-btn">
		    	<dropdown v-model="show_dropdown">
				  <button @click="show_dropdown=!show_dropdown" data-role="trigger" class="btn dropdown-toggle" type="button">
				    <span>{{page.q_name||'全部'}}</span>
				    <span class="caret"></span>
				  </button>
				  <template slot="dropdown" class="dropdown-menu">
				    <li @click="page.q_filed='';page.q_name='全部';searchs();">全部</li>
				    <li @click="page.q_filed='action';page.q_name='操作';searchs();">操作</li>
				    <li @click="page.q_filed='username';page.q_name='操作者';searchs();">操作者</li>
				    <li @click="page.q_filed='content';page.q_name='操作结果';searchs();">操作结果</li>
				    <li @click="page.q_filed='created';page.q_name='操作时间';searchs();">操作时间</li>
				  </template>
				</dropdown>
		  </span>
		  <input v-model="page.q" @keydown="e=>{if(e.keyCode==13) searchs(true);}" class="form-control" placeholder="请输入搜索关键字" />
		  	<span class="pointer" @click="page.q=''"><img src="../../assets/img/remove_icon.png" /> </span>
		    <span class="btns-search pointer"><span class="glyphicon glyphicon-search" @click="searchs()"></span> </span>
		     
		</div>
		<div class="table_wrap">
			<div class="table4 simulate_table">
				<ul class="thead">
					<li class="tr">
						<div class="th">操作者&ensp;<sort akey="action" :active="page.sort_filed=='action'" :status="page.sort" @click="changeFilterSort"></sort></div>
						<div class="th">操作&ensp;<sort akey="username" :active="page.sort_filed=='username'" :status="page.sort" @click="changeFilterSort"></sort></div>
						<div class="th">操作时间&ensp;<sort akey="created" :active="page.sort_filed=='created'" :status="page.sort" @click="changeFilterSort"></sort></div>
						<div class="th">操作结果&ensp;<sort akey="content" :active="page.sort_filed=='content'" :status="page.sort" @click="changeFilterSort"></sort></div>
						<div class="th">操作</div>
					</li>
				</ul>
				<ul class="tbody">
					<li class="tr" v-for="(item,index) in List">
						<div class="td">{{item.username}}</div>
						<div class="td">{{item.action}}</div>
						<div class="td">{{item.created}}</div>
						<div class="td">{{item.content}}</div>
						<div class="td">
							<span @click="recover(item)" class="pointer recover">恢复</span>
						</div>
					</li>
				</ul>
			</div>
		</div><br />
		<div class="pagination_wrap text-center">
			<!--<pagination :page="page" :total="total" v-on:pageTurn="pageTurn"></pagination>-->
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
		</div><br />
	</div>
	
</template>

<script>
	import pagination from '../module/pagination'
	import sort from '../module/表排序箭头'
	import {Dropdown} from 'uiv'
	export default{
		data(){
			return {
				page:{
					page:1,
					size:14,
					type:'recycle',
					q:'',
					q_name:'',
					q_filed:'',
					sort_filed:'created',
					sort:-1,
				},
				prev_page:'',
				List:[],
				total:0,
				show_dropdown:false,
				
				AUX:{
					actions:{
						合并问题:'revert_cluster',
						删除问题:'revert',
					}
				},
			}
		},
		created(){
			this.searchs();
		},
		methods:{
			searchs(first){
				var v = this;
				if(first) v.page.page=1;
				v.$api.ajax('/logs','get',v.page)
				.then(data=>{
					v.List = data.list;
					v.total = data.total;
				})
			},
			changeFilterSort(akey,isactive,sort){
				this.page.sort_filed = akey;
				this.page.sort = 0-this.page.sort;
				this.searchs();
			},
			pageTurn(){
				this.searchs();
			},
			recover(item){
				let v = this;
				let data ={
					id:item.id,
					action:v.AUX.actions[item.action] || 'revert',
				};
				v.$api.ajax('/questions/batch','get',data)
				.then(data=>{
					v.$message({
			            type: 'success',
			            message: '恢复成功!'
			        });
			        v.searchs()
				});
			}
		},
		components:{
			pagination,
			Dropdown,
			sort,
		},
	}
</script>

<style lang="scss">
	.recycle {
		.simulate_table {
			.th,.td {
				&:nth-child(1) {width: 10%;}
				&:nth-child(2) {width: 30%;}
				&:nth-child(3) {width: 20%;}
				&:nth-child(4) {width: 30%;}
				&:nth-child(5) {width: 10%;}
			}
		}
	}
</style>