<template>
	<div class="user_info">
		<article>
			<h5 class="title">
				<i class="fa fa-user"></i>&nbsp;个人信息
			</h5>
			<section class="info">
				<div class="text-center avater">
					<template v-if="info.head">
						<img :src="info.head" />
					</template>
					<template v-else-if="info.session_id">
						<span class="icon">{{info.session_id.slice(-2)}}</span>
					</template>
					<template v-else>
						<img src="../../../assets/img/user_header.png"  />
					</template>
				</div>
				<Row>
					<Col span="10">姓名：</Col>
					<Col span="14">{{info.nickname}}</Col>
				</Row>
				<Row>
					<Col span="10">手机：</Col>
					<Col span="14">{{info.mobile}}</Col>
				</Row>
				<Row>
					<Col span="10">邮箱：</Col>
					<Col span="14">{{info.email}}</Col>
				</Row>
				<Row>
					<Col span="10">地址：</Col>
					<Col span="14">{{info.address}}</Col>
				</Row>
				<Row>
					<Col span="10">来源终端：</Col>
					<Col span="14">
						<span v-if="info.source=='h5'">浏览器</span>
						<span v-if="info.source=='weixin'">微信</span>
					</Col>
				</Row>
			</section>
			<h5 class="title">
				<i class="fa fa-question-circle"></i>&nbsp;问题解决状态
			</h5>
			<section class="solve">
				<span @click="detail.question_status=0; send();" :class="info.question_status===0?'on':''">未解决</span>
				<span @click="detail.question_status=1; send();" :class="info.question_status===1?'on':''">已解决</span>
			</section>
			<h5 class="title">
				<i class="fa fa-th-large"></i>&nbsp;咨询分类
			</h5>
			<section class="tags" v-if="ctags.length>0">
				<el-cascader
				    :options="ctags"
				    v-model="tag"
				    :props="options"
				    :change-on-select="true"
				    @change="tagChange">
				</el-cascader>
			</section>
			<h5 class="title">
				<i class="fa fa-file-text"></i>&nbsp;添加备注
			</h5>
			<section>
				<Input v-model="detail.remark_info" type="textarea" :rows="4" @on-blur="changeMark"></Input>
			</section>
		</article>
	</div>
</template>

<script>
	export default {
		props:{
			info:{
				required:true,
				type:Object
			},
			tags:{
				type:Array,
				default:()=>{return [];}
			}
		},
		data(){
			return {
				session_id:'',
				options:{
					value:'id',
					label:'name',
					children:'child',
				},
				detail:{
					question_status:'',
					tag1:'',
					tag2:'',
					remark_info:'',
				},
				ctags:[],
				tag:[],
			}
		},
		created(){
			if(!this.tags||this.tags.length==0){
				this.getClassifyList();
			}else{
				this.ctags = this.tags;
				this.clearEmptyChild(this.ctags);
			}
		},
		computed:{
		},
		methods:{
			getClassifyList(){
		  		let v = this;
		  		this.$api.ajaxNoLoading(v.$uri.knowledgeStore.knowledge.tags,'get').then((r)=>{
					v.ctags = r;   
					this.clearEmptyChild(v.ctags);
				})
		  	},
		  	clearEmptyChild(arr){
		  		arr.forEach(item=>{
		  			if(item.child) {
		  				if(item.child.length==0){
		  					delete item.child;
		  				}else{
		  					this.clearEmptyChild(item.child);
		  				}
		  			}
		  		})
		  	},
		  	tagChange(arr){
		  		let v = this;
		  		this.detail.tag1 = arr[0];
		  		this.detail.tag2 = arr[1];
		  		v.send();
		  	},
		  	changeMark(){
		  		let v = this;														
		  		if(!(v.detail.remark_info==v.info.remark_info||(v.detail.remark_info==null&&v.info.remark_info=='')||(v.detail.remark_info==''&&v.info.remark_info==null)))
					v.send();
		  	},
		  	send(){
		  		var v = this;
		  		let detail = v.$api.deepCopy(v.detail);
		  		detail.session_id = v.info.session_id;
		  		this.$api.ajaxNoLoading('/chats/mark','put',detail).then(function (r) {
				   	v.info.tag1 = detail.tag1;
				   	v.info.tag2 = detail.tag2;
				   	v.info.question_status = detail.question_status;
				   	v.info.remark_info = detail.remark_info;
				}).catch(err=>{
					detail.tag1 = v.info.tag1;
				   	detail.tag2 = v.info.tag2;
				   	detail.question_status = v.info.question_status;
				   	detail.remark_info = v.info.remark_info;
				});
		  	},
		},
		watch:{
			info:{
				handler(n){    
					for(let i in this.detail){  
						this.detail[i] = n[i];
						this.tag = [n.tag1,n.tag2];
					}               
				},deep:true,
			},
			tags:{
				handler(n){
					if(n&&n.length>0){
						this.ctags = n;
					}
				},deep:true,
			}
		}
	}
</script>

<style lang="scss">
	@import './userInfo.scss';
</style>