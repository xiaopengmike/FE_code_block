<template>
	<div>
		<h1 class="page_title">日志总览</h1>
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
				<table class="table4">
					<thead>
						<tr>
							<th width="35%">操作&ensp;<sort akey="action" :active="page.sort_filed=='action'" :status="page.sort" @click="changeFilterSort"></sort></th>
							<th width="30%">操作者&ensp;<sort akey="username" :active="page.sort_filed=='username'" :status="page.sort" @click="changeFilterSort"></sort></th>
							
							<th width="20%">操作时间&ensp;<sort akey="created" :active="page.sort_filed=='created'" :status="page.sort" @click="changeFilterSort"></sort></th>
							<th width="15%">操作结果&ensp;<sort akey="content" :active="page.sort_filed=='content'" :status="page.sort" @click="changeFilterSort"></sort></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,index) in List">
							<td>{{item.action}}</td>
							<td>{{item.username}}</td>
							<td>{{item.created}}</td>
							<td>
								<p v-html="icon(item.content,item.action)"></p>
							</td>
						</tr>
					</tbody>
				</table>
		</div><br />
		<div class="pagination_wrap text-center">
			<!--<pagination :page="page" :total="total" :searchString="prev_page.q" @pageTurn="pageTurn"></pagination>-->
			<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
		</div><br />
	</div>
</template>

<script>
	import pagination from '../module/pagination'
	import operateIcon from './operate-icon.js'
	import sort from '../module/表排序箭头'
	import {Dropdown} from 'uiv'
	export default{
		data(){
			return {
				page:{
					page:1,
					size:14,
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
			}
		},
		created(){
			this.searchs();
		},
		conputed:{
		},
		methods:{
			searchs(first){
				var v = this;
				if(first) v.page.page=1;
				v.$api.ajax('/logs','get',v.page)
				.then(data=>{
					v.List = data.list;
					v.total = data.total;
					//记录本次的搜索条件
					v.prev_page = v.$api.deepCopy(v.page);
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
			icon(value,op){
				for(var i=1;i<operateIcon.length;i++){
					for(var j=0;j<operateIcon[i].operate.length;j++){
						if(op.indexOf(operateIcon[i].operate[j])!=-1){
							if(operateIcon[i].icon)
								return "<img :src="+operateIcon[i].icon+'" />&emsp;'+value;
							else
								return "<span class='"+operateIcon[i].icon_class+"' style='color:"+operateIcon[i].color+"'></span>&emsp;"+value;
						}
					}
				}
				if(operateIcon[0].icon)
					return "<img :src="+operateIcon[0].icon+'" />&emsp;'+value;
				else
					return "<span class='"+operateIcon[0].icon_class+"' style='color:"+operateIcon[0].color+"'></span>&emsp;"+value;
			},
		},
		components:{
			pagination,
			Dropdown,
			sort,
		}
	}
</script>

<style>
	
</style>