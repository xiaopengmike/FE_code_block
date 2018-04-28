<template>
	<div class="konwledgestore similarWord">
		<div>
			<h1 class="page_title">同义词库</h1>
			<div class="input-group search_wrap clearfix">
			    <Input v-model="page.q" size="small" @on-enter.prevent='searchs(1)' placeholder="请输入搜索内容">
				    <!--<Select v-model="page.q_filed" slot="prepend" style="width: 80px" placeholder="全部">
				        <Option v-for="f in AUX.filterKeys" :value="f.value">{{f.label}}</Option>
				    </Select>-->
				    <Button slot="append" icon="search" @click="searchs(1)"></Button>
			    </Input>
			    <button v-authority="'训练模型'" class="my-btn my-btn-info-f pull-right" @click="()=>{if($root.$children[0].训练模型信息.status==0) $root.$children[0].训练模型();}" v-html="$root.$children[0].训练模型信息.text[$root.$children[0].训练模型信息.status]" :class="'test'+$root.$children[0].训练模型信息.status"></button>
			    <button @click="AUX.show_upload=true" class="my-btn my-btn-info-o pull-right">批量上传</button>
			    <button @click="edit(0)" class="my-btn my-btn-info-o pull-right" v-authority="'机器人知识库-同义词-增加'">添加新同义词</button>
		    </div>
			<div class="table_wrap">
				<div class="table4 simulate_table table_select">
					<ul class="thead">
						<li class="tr">
							<div class="th"></div>
							<div class="th">标准词&ensp;<sort @click="changeFilterSort" akey="word" :active="page.sort_filed=='word'" :status="page.sort"></sort></div>
							<div class="th">同义词&ensp;<sort @click="changeFilterSort" akey="similar_word" :active="page.sort_filed=='similar_word'" :status="page.sort"></sort></div>
							<div class="th">创建时间&ensp;<sort @click="changeFilterSort" akey="created" :active="page.sort_filed=='created'" :status="page.sort"></sort></div>
							<div class="th">更新时间&ensp;<sort @click="changeFilterSort" akey="updated" :active="page.sort_filed=='updated'" :status="page.sort"></sort></div>
							<div class="th">操作</div>
						</li>
					</ul>
					<ul class="tbody">
						<li class="tr" v-for="item in list" :key="item.id" :class="{selected:选中.indexOf(item.id)!=-1}" v-tap="()=>{if(选中.indexOf(item.id)==-1) edit(item.id);}">
							<div class="td" @mousedown.stop>
								<span class="el-checkbox__input" :class="{'is-checked':选中.indexOf(item.id)!=-1}" @click.stop.prevent="()=>{if(选中.indexOf(item.id)!=-1){选中.splice(选中.indexOf(item.id),1)}else{ 选中.push(item.id)}}">
									<span class="el-checkbox__inner"></span>
								</span>
							</div>
							<div class="td">
								<span class="has_check" :title="item.word" v-html="$api.filterSerachStringAndLimitNum(item.word,prev_q,300)"></span>
							</div>
							<div class="td">
								<el-tooltip  popper-class="black html" :open-delay="400">
									<div slot="content" v-html="$api.filterSerachStringAndLimitNum(item.similar_word,prev_q,300)"></div>
									<p class="text" v-html="$api.filterSerachStringAndLimitNum(item.similar_word,prev_q,300)"></p>
								</el-tooltip>
							</div>
							<div class="td" :title="item.created">{{$api.dateFormat('yyyy-MM-dd',item.created) }}</div>
							<div class="td" :title="item.updated">{{$api.dateFormat('yyyy-MM-dd',item.updated) }}</div>
							<div class="td" @mousedown.stop>
								<p class="operate">
									<span class="operate-edit pointer" @click.stop="edit(item.id)">编辑</span>&nbsp;
									<span class="operate-remove pointer" @click.stop="del(item)">删除</span>
								</p>
							</div>
						</li>
					</ul>
					<ul class="tfoot" v-if="total>0">
						<li class="tr">
							<div class="td">
								<span @click="全选()" class="el-checkbox__input" :class="{'is-checked':选中.length==list.length}">
									<span class="el-checkbox__inner"></span>
								</span>
								<span @click="全选()" class="check-txt pointer unselect">全选</span>
								<button v-if="选中.length>0" @click="del(false)" class="my-btn my-btn-primary my-btn-small">删除</button>
							</div>
						</li>
					</ul>
				</div>
			</div><br />
			<div class="pagination_wrap text-center" v-if="total>0">
				<!--<pagination :page="page" :total="total" :searchString="prev_q" @pageTurn="pageTurn"></pagination>-->
				<el-pagination class="my_pagination" :total="total" :current-page.sync="page.page" :page-size="page.size" @current-change="pageTurn" layout="total, prev, pager, next, jumper"></el-pagination>
			</div>
		</div>
	
		<modal v-model="show_modal_info" size="md" :backdrop='false'>
			<div slot="header">
			    <h4 class="modal-title">
			      	<b>同义词编辑</b>
			    </h4>
			</div>
			<div slot="default" class="modal-body">
				<el-form :model="word" :rules="word_rules"  label-width="100px"  ref="word">
					<el-form-item label="填入标准词" prop="word" >
						<el-input v-model="word.word"></el-input>
					</el-form-item>
					<el-form-item v-for="(val,index) in word.similar_word"  :prop="'similar_word.'+index" :label="index==0?'同义词':''" :rules="word_rules.similar_word" >
							<el-col :span="22">
								<el-input v-model="word.similar_word[index]"></el-input>
							</el-col>
							<el-col :span="1" :offset="1">
								<i v-if="word.similar_word.length>1" class="el-icon-close pointer" @click="word.similar_word.splice(index,1)"></i>
							</el-col>
					</el-form-item>
					<el-form-item  :label="word.similar_word.length!=0?'':'同义词'">
						<span class="text-info col-sm-offset-3 pointer" @click="word.similar_word.push('')" >添加同义词</span>
					</el-form-item>
				</el-form>
				<!--<form class="form-horizontal" role="form" >
					<div class="form-group">
						<label class="col-sm-2">标准词<span class="red">&emsp;*</span></label>
						<div class="col-sm-9">
							<input class="form-control" placeholder="填入标准词"  v-model="word.word" @change="word.word.trim()==''?required++:required--"  />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2">同义词</label>
						<div class="col-sm-10">
							<div class="form-group-special" v-for=" (value,index) in word.similar_word">
								<input v-model="word.similar_word[index]" @keydown="((e)=>{if(e.keyCode==13){word.similar_word.splice(index,0,'')}})" class="form-control input-special-90" placeholder="填入同义词"  /> 
								<span class="glyphicon glyphicon-remove remove-similarWord" @click="word.similar_word.splice(index,1)"></span>
							</div>
						</div>
						<a class="text-info col-sm-offset-3" @click="word.similar_word.push('')" href="javascript:void()">添加同义词</a>
					</div>
				</form>		-->
			</div>
			<div slot="footer" class="">
			    <button type="button" class="my-btn my-btn-transparent" @click="show_modal_info = false">取消</button>
			    <button type="button" class="my-btn my-btn-info-f" @click="submit">提交</button>
			</div>
		</modal>
		<!--上传和模板-->
		<el-dialog title="上传文件" v-model="AUX.show_upload" size="" >
				<div class="upload_dialog_list">
					<span @click="$api.downloadFromService('同义词库导入模板.xlsx',$uri.静态文件baseurl+'/知识库同义词上传模板.xlsx')" class="displayIB">
				  		<i class="glyphicon glyphicon-download font50" ></i><br />
				  		下载模板
				  	</span>
		    		<upload :action="$uri.similarWord.postfile" :type="'post'" :accept="upload.type" :success="uploadSuccess" :error="uploadError_mixin" :before="beforeUpload_mixin">
				    	<div :title="'请上传'+upload.type+'文件'" class="text-center">
				    		<i class="glyphicon glyphicon-upload font50"></i><br />
				    	</div>
				    	<p>导入</p>
				    </upload>
				</div>	  
		</el-dialog>	
		
	</div>
</template>
<script>
	import upload from '../module/upload'
	import pagination from '../module/pagination'
	import sort from '../module/表排序箭头'
	import validateWord from '../../Validation/similarWord'
	import upload_mixin from '../module/upload_mixin.js'
	import handler from './mixin.js'
	export default {
		mixins:[upload_mixin,handler],
		data(){
			var validate1 = (rule, value, callback) => {
				let reg = new RegExp("^([`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_])",'gi');
				if(value&&reg.test(value)){
					callback(new Error("不允许包含特殊字符"));
				}else{
					callback();
				}
		   	};
			return {
				show_modal_info:false,
				show_alert:true,
				alert_info:{
					type:'info',
					title:'提示',
					content:'提示信息',
				},
				required:1,
				page:{
					page:1,
					size:16,
					sort_filed:'updated',
					sort:-1,
					q:'',
				},
				prev_q:'',
				list:[],
				total:0,
				word:{
					id:'',
					word:'',
					similar_word:['']
				},
				word_rules:{
					word:[{required:true,message:'请输入标准词', trigger: 'blur'},{ validator: validate1}],
					similar_word:[{ validator: validate1 },],
				},
				upload:{
					type:'|xls|xlsx',
				},
				选中:[],
				//辅助显示
				AUX:{
					show_upload:false,
					filterKeys:[
						{label:'标准词',value:'word'},
						{label:'相似词',value:'similar_word'},
					]
				},
			}
		},
		created(){
			this.searchs()
		},
		methods:{
			beforeSearchs(){
				this.选中=[];
			},
			searchs(firstPage=false){    
				var v = this;
				v.beforeSearchs();
				if(!firstPage) v.page.page = 1;
				this.$api.ajax('/entities','get',v.page)
				.then(function(data){
					v.list = data.list;
					v.total = data.total;
					v.prev_q = v.page.q;
				});
			},
			changeFilterSort(akey,isactive,status){
				this.page.sort_filed = akey;
				this.page.sort = 0-this.page.sort;
				this.searchs();
			},
			pageTurn(){
				this.searchs(true);
			},
			edit(id){
				var v = this;
				if(id){;
					this.$api.ajax('/entities/'+id,'get')
					.then(function(data){;
						v.word = data;
						v.show_modal_info =true;
					});
				}else{
					v.word = {
						id:'',
						word:'',
						similar_word:['']
					};
					v.show_modal_info =true;
				}
			},
			submit(){ 
				this.$refs.word.validate((valid) => {
          			if (valid) {
          				var v = this;
          				for(var i=0;i<v.word.similar_word.length;i++){
          					if(v.word.similar_word[i].trim()==""){
          						v.word.similar_word.splice(i,1);
          						i--;
          					}
          				}
          				if(!v.word.id){
          					this.$api.ajax('/entities','post',v.word)
          					.then(function(data){
          						v.$message({
          							type: 'success',
          				            message: '新增成功'
          						});
          						v.searchs(true);
          						v.show_modal_info =false;
          					});
          				}else{
          					this.$api.ajax('/entities/'+v.word.id,'put',v.word)
          					.then(function(data){
          						v.$message({
          							type: 'success',
          				            message: '修改成功'
          						});
          						v.searchs(true);
          						v.show_modal_info =false;
          					});
          				}
          			}
          		});
				
			},
			del(item){
				var v = this;
				let info = item?`确定要删除同义词"${item.word}"吗?`:`确定要删除选中同义词吗?`;
  				let uri = item?'/entities/'+item.id:'/entities';
				this.$confirm(info,'提示',{
					confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
				}).then(()=>{
				v.$api.ajax(uri,'delete',{data:{ids:v.选中}}).then(function (r) {
		  				v.$message({
				            type: 'success',
				            message: '删除成功!'
				          });
					 	v.searchs(true);
					});
				})
			},
			全选(){
				let v = this;
				if(v.选中.length!==v.list.length){
					v.选中=[];
					v.选中 = v.list.map((val)=>{
						return val.id;
					})
				}else{
					v.选中=[];
				}
			},
			uploadSuccess(res){
				this.uploadSuccess_mixin(res);
				this.AUX.show_upload = false;
				this.page.sort_filed='updated',
	      		this.page.sort=-1,
				this.searchs();
			}
		},
		components:{
			sort,
			pagination,upload,
		}
	}
</script>
<style lang="scss">
	@import '../../assets/scss/api.scss';
	$th_widths:(0.3,0.3,0.15,0.15,0.1);
	.similarWord {
		padding:0 42px;
		.simulate_table {
			@include simulateTableThWidth($th_widths,true);
		}
	}
	.serach_wrap.input-group  input.form-control { }
	
	
	.word_table {min-height:750px;border-radius:7px; margin:25px 0px 37px; overflow:hidden; background:#fff; box-shadow:-1px 0px 15px #eee,1px 0px 10px #eee,0px -1px 15px #eee,0px 1px 15px #eee;}
	.word_table { border-top:4px solid #2bb3f3;}
	.word_table table {width:96%; background:#fff; margin:0% 2% 0 2%;}
	
</style>