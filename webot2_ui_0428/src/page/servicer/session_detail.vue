<template>
	<div id="session_detail">
		<div class="tabs text-center">
			<div :class="aside.show=='info'?'':''"><span @click="aside.show='info'" class="pointer">用户信息状态</span></div>
			<!--<div :class="aside.show=='history'?'on':''"><span @click="aside.show='history'" class="pointer">历史查询</span></div>-->
		</div>
		<div v-show="aside.show=='info'" class="user_info">
			<p><i class="glyphicon glyphicon-user c_c1cfdf"></i>&nbsp;个人信息</p>
			<div class="detail">
				<div>
					<p class="text-center avater">
						<span>
							<img v-if="session.head" :src="session.head" />
							<img v-else src="../../assets/img/user_header.png" />
						</span>
					</p>
					<el-row>
						<el-col :span="8">姓名</el-col><el-col :span="16" class="">{{session.nickname}}&nbsp;</el-col>
						<el-col :span="8">手机</el-col><el-col :span="16" class="">{{session.mobile}}&nbsp;</el-col>
						<el-col :span="8">邮箱</el-col><el-col :span="16" class="">{{session.email}}&nbsp;</el-col>
						<el-col :span="8">地址</el-col><el-col :span="16" class="">{{session.address}}&nbsp;</el-col>
						<el-col :span="8">来源终端</el-col><el-col :span="16" class="">
							<span v-if="session.source=='h5'">浏览器</span><span v-if="session.source=='weixin'">微信</span>&nbsp;
						</el-col>
					</el-row>
				</div>
			</div>
			<p><i class="glyphicon glyphicon-question-sign c_c1cfdf"></i>&nbsp;问题解决状态</p>
			<div class="resolve">
				<span @click="detail.question_status=0; send();" :class="session.question_status===0?'on':''">未解决</span>
				<span @click="detail.question_status=1; send();" :class="session.question_status===1?'on':''">已解决</span>
			</div>
			<p><i class="glyphicon glyphicon-th-large c_c1cfdf"></i>&nbsp;咨询分类</p>
			<div class="classify" v-if="tags.length>0">
				<el-select placeholder="一级分类" v-model="detail.tag1" @change="changeTag1">
				    <el-option v-for="t1 in tags" :key="t1.name" :label="t1.name" :value="t1.id.toString()"></el-option>
				</el-select>
				<el-select v-model="detail.tag2" placeholder="二级分类" @change="changeTag2">
				    <el-option v-for="t2 in Tag2" :key="t2.name" :label="t2.name" :value="t2.id.toString()"></el-option>
				</el-select>
			</div>
			<p><i class="glyphicon glyphicon-pencil c_c1cfdf"></i>&nbsp;添加备注</p>
			<div class="remark">
				<textarea rows="5" v-model="detail.remark_info" @change="changeMark"></textarea>
			</div>
		</div>
		<div v-show="aside.show=='history'" class="history">
			<p><i class="glyphicon glyphicon-time c_c1cfdf"></i>&nbsp;历史咨询</p>
			<div>
				<!--<el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions0"></el-date-picker>
				<el-cascader :options="options" v-model="selectedOptions" @change="handleChange"></el-cascader>-->
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		props:['session','tags'],
		data(){
			return {
				session_id:'',
				aside:{
					show:'info', //history
				},
				detail:{
					question_status:'',
					tag1:'',
					tag2:'',
					remark_info:'',
				},
			}
		},
		created(){
		},
		computed:{
			Tag2(){
				let v= this,tag2=[];
				if(v.detail.tag1!==''){
					for(let i=0;i<v.tags.length;i++){
						if(v.tags[i].id==v.detail.tag1){
							tag2 = v.tags[i].child;
							break;
						}
					}
				}
				return tag2;
			}
		},
		methods:{
			
		  	changeTag1(){ 
		  		let v= this;                              
				if(!(v.detail.tag1==v.session.tag1||(v.detail.tag1==null&&v.session.tag1=='')||(v.detail.tag1==''&&v.session.tag1==null))){
					v.send();
					v.detail.tag2='';
				}	
		  	},
		  	changeTag2(){
		  		let v= this;
		  		if(!(v.detail.tag2==v.session.tag2||(v.detail.tag2==null&&v.session.tag2=='')||(v.detail.tag2==''&&v.session.tag2==null)))
					v.send();
		  	},
		  	changeMark(){
		  		let v = this;														
		  		if(!(v.detail.remark_info==v.session.remark_info||(v.detail.remark_info==null&&v.session.remark_info=='')||(v.detail.remark_info==''&&v.session.remark_info==null)))
					v.send();
		  	},
		  	send(){
		  		var v = this;
		  		let detail = v.$api.deepCopy(v.detail);
		  		detail.session_id = this.session.session_id;
		  		this.$api.ajax('/chats/mark','put',detail).then(function (r) {
				   	v.session.tag1 = detail.tag1;
				   	v.session.tag2 = detail.tag2;
				   	v.session.question_status = detail.question_status;
				   	v.session.remark_info = detail.remark_info;
				}).catch(err=>{
					detail.tag1 = v.session.tag1;
				   	detail.tag2 = v.session.tag2;
				   	detail.question_status = v.session.question_status;
				   	detail.remark_info = v.session.remark_info;
				});
		  	},
		},
		components:{
			
		},
		watch:{
			'session':{
				handler:function(n){  console.log(n)
					this.session_id=this.session.session_id;
						this.detail.tag1=this.session.tag1?this.session.tag1+'':'';
						this.detail.tag2=this.session.tag2?this.session.tag2+'':'';
						this.detail.question_status = this.session.question_status;
						this.detail.remark_info = this.session.remark_info;
					
				}
			},deep:true,
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style>
	#session_detail {font-size:14px;}
	#session_detail .tabs{width:100%; font-size:0; border-bottom:1px solid #d3e1f0;  background:#fff;}
	#session_detail .tabs > div {display:inline-block; font-size:14px; line-height:42px; width:50%; padding:0;}
	#session_detail .tabs > div.on span {display:inline-block; padding:0 10px; border-bottom:3px solid #0190FE;}
	#session_detail .user_info .detail > div { padding:10px 5% 15px 5%; border:0.5px solid #06A2EB; background:#f7fbff;}
	#session_detail .user_info .detail .el-col {margin-top:10px;}
	#session_detail .user_info .detail .avater span {display:inline-block; line-height:80px; width:80px; height:80px; border-radius:50px; margin-bottom:5px;;}
	#session_detail .user_info .detail .avater span img {width:80px; border-radius:50px;;}
	#session_detail .user_info >div,
	#session_detail .history >div {padding: 10px 5%; width:100%; margin-bottom:10px;}
	#session_detail > div > p {margin-top:30px; padding-left:4%;}
	#session_detail .user_info .resolve span {width:40%; margin:0 4%; line-height:30px; text-align:center; user-select:none; cursor:pointer; display:inline-block; border:1px solid #c9d5e3;}
	#session_detail .user_info .resolve span.on {background:#13a0e3; color:#fff;}
	#session_detail .user_info .classify .el-cascader,
	#session_detail .user_info .classify .el-select {width:100%;}
	#session_detail .user_info .classify .el-select + .el-select {margin-top:10px;}
	#session_detail .user_info .remark textarea {max-width:100%; width:100%; padding:5px; border-color:#c9d5e3;}
</style>