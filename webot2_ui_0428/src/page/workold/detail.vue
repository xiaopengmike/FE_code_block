<template>
	<div class="work_order_detail">
		<div class="section">
			<header class="work-nav">
				<h1 class="page_title noBorder">工单详情</h1>
				<el-breadcrumb class="paths">
					  <el-breadcrumb-item v-for="(p,i) in paths.filter(val=>val.name!=='')" :to="{ path: p.path }">{{p.name}}</el-breadcrumb-item>
				</el-breadcrumb>
				<button class="my-btn my-btn-info-o" @click="showUserDetail=true">更多详情</button>
			</header>
			<article class="work-info">
				<section>
					<h2>
						<p>
							<span>#{{workOrder.work_id}}</span>
							<span>{{workOrder.title}}</span>
							<span class="status-tag" :class="'status-'+workOrder.status">{{workstatus[workOrder.status]}}</span>
						</p>
					</h2>
					<p class="work-time">
						<span>创建于</span>
						<span>{{workOrder.created}}</span>
					</p>
					<div class="to-operate">
						<button class="my-btn my-btn-info-o" @click="workAction('申领', {'status': 1})" v-if="workOrder.status==0">接单</button>
						<!-- <Button type="ghost" @click="" v-if="workOrder.status==0">指派</Button> -->
						<!-- <Button type="ghost" v-if="workOrder.status==1">转交</Button> -->
						<button class="my-btn my-btn-info-o" v-if="workOrder.status==1" @click="workAction('完成', {'status': 2})" >已解决</button>
						<button class="my-btn my-btn-info-o" @click="workAction('激活', {'status': 1})" v-if="workOrder.status==2">重新打开</button>
					</div>	
				</section>
				<div class="to-select clearfix">
					<div class="select-tag">
						<span>分类：</span>
					    <el-cascader :options="tags" :props="options" v-model="tag" change-on-select @change="selectTag" placeholder="请选择分类"></el-cascader>
					</div>
					<div class="select-user">
						<span>受理人：</span>
					    <el-select v-model="user_id" placeholder="请选择受理人">
					    	<el-option  v-for="user in users" :value="user.id" :label="user.username"> </el-option>
					    </el-select>
					</div>
				</div>
				<bar wrapper="work-content">
					<p>{{workOrder.content}}</p>
					<ul>
						<li v-for="file in workOrder.uploads">
							<Card class="attachment-card clearfix" dis-hover>
								<div class="card-left">
									<i class="fa fa-file-text font14"></i>&ensp;
									{{file.name}}
								</div>
								<div class="card-right">
									<!-- <Button type="text">查看</Button> -->
									<Button type="text" @click="$api.downloadFromService(file.name, file.url)">下载</Button>
								</div>
				            </Card>
						</li>
					</ul>
				</bar>
			</article>
			<article class="work-log">
				<header>
					<h2>工单服务记录</h2>
				</header>
				<div　class="log-list">
					<bar wrapper="timeline-wrapper">
						<Timeline>
							<TimelineItem :class="'item-'+ACTION[log.action]" v-for="log in logs">
								<p class="log-time">{{log.created}}</p>
								<!-- 非回复模块-->
								<div  class="no-files"  v-if="log.action!='回复'">
									<span class="status-tag">{{log.action}}</span>
									<i class="color-line" :class="'status-'+ACTION[log.action]"></i>
									<div>
										<span class="user-1" v-if="users[log.user_id]">{{users[log.user_id].username}}</span>
										<span class="user-do" v-if="log.action=='分类'">{{'将'+log.action+'修改为'}}</span>
										<span class="user-do" v-else-if="log.action!='指派'&&log.action!='转交'">{{log.action+'了工单'}}</span>
										<span class="user-do" v-else>{{'将工单'+log.action+'给了'}}</span>
										<span class="user-2" v-if="log.action=='分类'" v-for="logTag in [getTagObj(log.tag2?log.tag2:log.tag1)]">
											<span v-if="logTag[0]">{{logTag[0].name}}</span>
						            		<span v-if="logTag[1]&&logTag[1].name">{{'-' + logTag[1].name}}</span>
										</span>
										<span class="user-2" v-else-if="users[log.to_user]">{{users[log.to_user].username}}</span>
										
									</div>
								</div>
								<!-- 回复模块 -->
								<div class="files" v-else>
									<span class="status-tag">{{log.action}}</span>
									<i class="color-line status-open"></i>
									<img :src="users[log.user_id].head" alt="" class="head-img" v-if="users[log.user_id] && users[log.user_id].head">
									<span class="user-name" v-if="users[log.user_id]">{{users[log.user_id].username}}</span>
									<div class="files-right">
										<span class="user-leave-msg" v-if="log.content">{{log.content}}</span>
										<Card  class="attachment-card clearfix" dis-hover v-for="file in log.files">
											<el-tooltip class="item" effect="dark" :content="file.name" placement="top-start"  popper-class="black" :open-delay="400">
												<div class="card-left font12">
													<i class="fa fa-file-text font14"></i>&ensp;
													{{file.name}}
												</div>
											</el-tooltip>
											<div class="card-right">
												<span class="file-size font12">{{getMediaSize(file.size)}}</span>
												<!-- <Button type="text">查看</Button> -->
												<a class=" font12" @click="$api.downloadFromService(file.name, file.url)">下载</a>
											</div>
							            </Card>
									</div>
								</div>
							</TimelineItem>
	
						</Timeline>
	
					</bar>
				</div>
				<footer>
					<!-- 内容及上传附件 -->
					<div class="save-log">
						<div class="upload-msg">
							<upload :action="$uri.upload.file" size="20m" :success="uploadSuccess" :error="uploadError_mixin" :before="beforeUpload" :progress="uploading">
						        <Button type="ghost" icon="paperclip">上传附件</Button>
						    </upload>
						    <span>(单个附件不可超过20M, 最多可上传5个附件)</span>
						</div>
						<Input v-model="reply.text" type="textarea" placeholder="请输入你的处理意见" @on-change="checkEdit"></Input>
					</div>
					<!-- 附件列表最多5个 -->
					<Card  class="attachment-card clearfix" dis-hover v-for="file in reply.files">
						<el-tooltip class="item" effect="dark" :content="file.name" placement="top-start"  popper-class="black" :open-delay="400">
							<div class="card-left font12">
								<i class="fa fa-file-text font14"></i>&ensp;
								{{file.name}}
							</div>
						</el-tooltip>
						<div class="card-right">
							<span class="file-size font12">{{getMediaSize(file.size)}}</span>
							<!-- <Button type="text">查看</Button> -->
							<a class=" font12" @click="$api.downloadFromService(file.name, file.url)">下载</a>
						</div>
						<div @click="delUploads(file)">
							<Icon type="close-round" ></Icon>
						</div>
						<i class="progress-line" :style="{width: file.percent + '%'}" v-show="file.percent&&file.percent<101"></i>	
		            </Card>
				</footer>
			</article>
			<footer class="clearfix submit" v-show="isEditing">
				<button class="my-btn my-btn-info-o" @click="clearReply">取消</button>&emsp;
				<button class="my-btn my-btn-info-f" @click="workAction('回复')">提交</button>
			</footer>
				
		</div>

		<user-detail :workOrder="workDetail" :session="session" v-model="showUserDetail" :tags="tags"></user-detail>
		
	</div>
</template>

<script>
	import upload from '../module/upload'
	import upload_mixin from '../module/upload_mixin.js'
	import session_mixin from '../servicer/mixin/sessions.js'
	import bar from '../module/自定义滚动条.vue'
	import {mapGetters,mapActions} from 'vuex'
	import userDetail from './modules/work_user_detail.vue'
	export default {
		mixins: [upload_mixin,session_mixin],
		data(){
			return {
				ACTION:{
					"创建": "create",
					"指派": "deliver",
					"申领": "receive",
					"完成": "over",
					"激活": "open",
					"转交": "transfer",
					"回复": "reply",
					"分类": "change-tag"
				},
				workstatus:{
					0: "未受理",
					1: "已受理",
					2: "已解决"
				},
				paths:[],
				tags: [],
				logs: [],
				users: {},
				groups:{},
				reply: {
					"text": "",
					"files": []
				},
				showUserDetail: false,
				workOrder: {
					user_id: "",
					user_name: "",
					tag1: "",
					tag2: "",
					status: 0,
					title: "",
					content: ""
				},
				tag:[],
				options:{
					label:'name',
					value:'id',
					children:'child',
				},
				session:{
					session_id:'',
					scroll:{bottom:100,distance_top:false},
					historys:[],
				},
				isEditing: false,

			}
		},
		computed:{
		    ...mapGetters(['getKfs']),
		    workDetail: {
                // 动态计算currentValue的值
                get:function() {
                	let work = this.$api.deepCopy(this.workOrder);
            		work.creator = "";
            		work.handler = "";
                	if(this.workOrder.creator_id&&this.users){
                		if(this.users[this.workOrder.creator_id])
                			work.creator = this.users[this.workOrder.creator_id].username;
                		if(this.users[this.workOrder.user_id])
                			work.handler = this.users[this.workOrder.user_id].username;
                	}
                	if(this.tag1){
                		work.tag1 = this.tag1.name;
                		work.tag2 = this.tag2.name;
                	}
                    return work; // 将props中的value赋值给currentValue
                }
           },
           user_id:{
           		get(){
           			return this.workOrder.user_id;
           		},
           		set(val){
           			this.workOrder.user_id = val;
           			this.selectUser(val);
           		}
           }
		},
		created(){
			this.mixin_初始化会话(this.session);
			/*delete this.session.scroll;*/
			this.handlerPaths();
			this.getUsers();
			this.getGroups();
			this.getTags();
			this.getLogs();
			this.getDetail();
		},
		 mounted () {
            this.showUserDetail = window.innerWidth > 1280
            window.addEventListener('resize', () => {
                this.showUserDetail = window.innerWidth > 1280
            })
        },
		methods:{
			handlerPaths(){
				this.paths = [];
				this.$router.history.current.matched.forEach(val=>{
					this.paths.push(val)
				})
			},
			getLogs(){
				let getUrl = this.$uri.workold.actionLog + "?id=" + this.$route.query.id;
				this.$api.ajax(getUrl,'get').then(data=>{
					for(let i in data){
						data[i].created = this.timeToFormat(data[i].created);
					}
					this.logs = data;
				})
			},
			checkEdit(){
				console.log("checking....")
				if(this.reply.text!=''||this.reply.files.length>0){
					return this.isEditing = true;
				}
				return this.isEditing = false;
			},
			getTags(){
				this.$api.ajax(this.$uri.workold.tags,'get').then(data=>{
					data.forEach(val=>{
						if(val.child && val.child.length==0){
							delete val.child;
						}
					})
					this.tags = data;
				})
			},
			getUsers(){
				let _format = function(users){
					let u_s = {};
					for(let i in users){
						u_s[users[i].id] = users[i];
					}
					return u_s
				}
				// let users = this.$store.state.service.kfs;
				let users=null
				if(!users){
					this.$api.ajax(this.$uri.user.getUsers,'get').then(data=>{
						this.users = _format(data.list);
						// console.log("users....",this.users);
					})
				}else{
					this.users = _format(users);
				}
			},
			getGroups(){
				this.$api.ajax(this.$uri.user.getGroups,'get')
				.then(data=>{
					data.forEach(val=>{
						this.groups[val.id] = val.name;
					})
				})
			},
			getDetail(){
				let v = this;
				let wid = v.$route.query.id;
				let query_url = v.$uri.workold.detail.replace('id',wid);
				v.$api.ajax(query_url,'get').then(data=>{
					v.workOrder = data;
					if(v.workOrder.uid){
						this.mixin_初始化会话(this.session);
						v.getSessionHistory(v.workOrder.uid);
					}
					
					v.tag = [v.workOrder.tag1,v.workOrder.tag2];
				});
			},
			getSessionHistory(id){   
				let v = this;
				
				if(!id) return false;
				v.session.session_id = id;
				v.mixin_会话历史(v.session)
			},
			putDetail(data, fun_success){
				let v = this;
				let wid = v.$route.query.id;
				let query_url = v.$uri.workold.detail.replace('id',wid);
				v.$api.ajax(query_url, 'put', data).then(data=>{
					this.getLogs();
					v.$message({
						type: 'success',
						message: '修改成功'
					});
				})
			},
			clearReply(){
				this.reply.files = [];
				this.reply.text = "";
			},
			workAction(action, put_data=null){
				let v = this;
				let query_url = v.$uri.workold.action;
				let data = {
					"wid": v.$route.query.id,
					"action": action
				}
				if(action == "回复"){
					data["content"] = v.reply.text.trim();
					data["files"] = v.reply.files;
					if(!data["content"] && data["files"].length < 1){
						this.$message({
							type: 'error',
							message: "回复不能为空"
						});
						return ;
					}
				}else{
					for(let key in put_data){
						data[key] = put_data[key]
					}
				}
				v.$api.ajax(query_url, 'put', data).then(data=>{
					this.getLogs();
					this.$message({
						type: 'success',
						message: action+"成功"
					});
					if(action=="回复"){
						this.reply.text = "";
						this.reply.files = [];
					}
					else if(action == "申领"){
						this.workOrder.user_id = this.$store.state.global.user.id;
						this.workOrder.status = put_data.status;
					}
					else if(action == "转交" || action == "指派"){
						this.workOrder.user_id = put_data.to_user;
						this.workOrder.status = 1;
					}else{
						this.workOrder.status = put_data.status;
					}
				})
			},
			timeToFormat(timeStr){
				return timeStr.slice(5,-3).replace("-", ".");
			},
			// statusToStr(status){
			// 	return {
			// 		0: "未受理",
			// 		1: "已受理",
			// 		2: "已完成"
			// 	}[status]
			// },
			userIdToName(user_id){
				return "user_name"
			},
			delUploads(obj){
				for(let i in this.reply.files){
					console.log(obj, this.reply.files[i])
					if(obj === this.reply.files[i]){
						this.reply.files.splice(i,1)
						break;
					}
				}
				this.checkEdit();
			},
			getTagObj(tag_id){  
				let tag1 = null;
				let tag2 = {name: null};
				for(let i=0; i<this.tags.length; i++){
					tag1 = this.tags[i];
					console.info("getTagObj", tag_id)
					if(tag_id == tag1.id) break;
					if(!tag1.child) continue;
					for(let j=0; j<tag1.child.length; j++){
						let _tag2 = tag1.child[j];
						if(tag_id == _tag2.id){
							tag2 = _tag2;
							break;
						}
					}
					if(tag2.name!=null) break;
				}
				// console.info("tag1-tag2", tag1, tag2);
				return [tag1, tag2];
			},
			selectTag(tag_id){   
				let tags = this.getTagObj(tag_id);
				this.tag1 = tags[0];
				this.tag2 = tags[1];
				let data = {"tag1": tags[0].id}
				data["tag2"] = tags[1]?tags[1].id:0;
				data["action"] = "分类";
				this.putDetail(data);
				// this.
			},
			selectUser(user_id){
				console.log("user_id", user_id)
				let user = this.users[user_id]
				// this.workOrder.user_id = user.id;
				if(this.workOrder.status == 0){
					this.workAction("指派", {"to_user": user_id, status: 1})
				}
				else if(this.workOrder.status == 1){
					this.workAction("转交", {"to_user": user_id})
				}
				// this.putDetail({"user_id": user.id});
			},
			getMediaSize(size){
		  		if(size >> 20 > 0) return (size/Math.pow(2,20)).toFixed(2)+"MB";
		  		if(size >> 10 > 0) return (size/Math.pow(2,10)).toFixed(2)+"KB";
		  		return size+"B"
		  	},
			uploadSuccess(res, file, index){
				this.reply.files[index].url = res.url;
				this.checkEdit();
			},
			uploading( percent,index){   
				let file = this.reply.files[index];
				file.percent = percent*100;
				if(file.percent == '100'){
					setTimeout(file.percent='101',1000)
				}
			},
			beforeUpload(file){
				if(this.reply.files.length>=5){
					this.uploadError_mixin("一次性只能上传5个文件");
					return false;
				}
				let index = this.reply.files.length;
				let _file = {
					type: file.type.split("/")[0],
					name: file.name,
					size: file.size,
					percent: null,
					url: ""
				}
				// console.log("file", file, data)
				this.reply.files.push(_file);
				return index;
			},

		},
		components:{
			upload,
			bar,
			mapGetters,
			mapActions,
			userDetail,
		},
		watch:{
			path(){           
				this.handlerPaths();	
			}
		}
	}
</script>

<style lang="scss">
	@import '../servicer/modules/userInfo.scss';
	$color_status_0: #ffbf5e;
	$color_status_1: #c9ced0;
	$color_status_2: #54ca52;
	$color_status_open: #7e7ffc;
	$color_status_over: #54ca52;
	$color_status_reply: #67d6da ;
	$color_status_transfer: #aa80e3;
	$color_status_receive: #ffbf5e;
	$color_status_deliver: #f28e8e;
	$color_status_create: #1f89f6;
	$color_status_change_tag: #c3ab94;

	$color_font_button: #2d8cf0;
	$color_font_button_hover: #5cadff;

	$action_list: (0, 1, 2, open, over, reply, transfer, receive, deliver, create, change-tag);
	$action_colors:	(#ffbf5e, #c9ced0, #54ca52, #7e7ffc, #54ca52, #67d6da , #aa80e3, #ffbf5e, #f28e8e, #1f89f6, #c3ab94);

	$color_card: #f7fafc;
	$color_nav_border: #e7eff3;
	$color_border: #eff5f8;
	$height_card: 24px;
	$color_font_0_7: #93a0ad;
	$color_font_0_5: #cdd4d8;

	$cotent_margin_right: 96px;
	$contentCardH: 22px;
	.work_order_detail {
		height:100%;
		display:flex;
		.slot{
			padding: 0 0 10px 0;
		}
		.ivu-card-body{
			padding: 0;
		}
		.select-user{
			.ivu-select-dropdown{
				overflow-y: auto;
				height: 200px;
			}
		}
		.section{
			flex:1;
			width:calc(100% - 380px);
			max-height:100%;
		}
		.work-nav{
			position: relative;
			height: 50px;
			margin-right: $cotent_margin_right;
			button{
				position: absolute;
				right: 0px;
				bottom: 5px;
			}
		}
		font-size: 14px;
		textarea{
			resize:none;
		}
		h2 {
			font-weight: 700;
			font-size: 16px;
			.status-tag{
				font-size: 14px;
				font-weight: 400;
			}
		}
		article {
			padding-top:28px;
			margin-right: $cotent_margin_right;
		}
 
		@each $name, $color in zip($action_list, $action_colors) {
			.status-#{$name} {
				background-color: $color;
			}
		}

		.status-tag {
			display: inline-block;
			border-radius: 10px;
			padding: 2px 5px;
			color: white;
		}

		.drop-disabled {
			pointer-events: none;
			button{
				border-color: transparent;
			}
			.ivu-icon{
				display: none;
			}
			.ivu-select-dropdown{
				display: none !important;
			}
		}
		.attachment-card {
			background-color: $color_card;
			height: $height_card;
			padding: 0 0 0 10px;
			border-color: $color_border;
			box-sizing: border-box;
			color: $color_font_0_7;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			.ivu-card-body {
				padding:0 40px 0 0;
				line-hight: $height_card;
			}
			.file-size{
				margin-right: 12px;
			}
			button{
				padding: 0;
				height: $height_card;
				color: $color_font_button;
			}
			button:hover{
				color: $color_font_button_hover;
			}
			.card-left {
				overflow: hidden;
				width: calc(100% - 80px);
				line-height: $height_card;
				text-overflow: ellipsis;
			}
			.card-right {
				position: absolute;
				top:0px;
				right: 2px;
				line-height:23px;
				margin-right: 40px;
				a {
					display:inline-block;
				}
				.ivu-btn span{
					top: 0;
				}
			}
			&.ivu-card:hover{
				border-color: $color_border;
			}
			&before{
				content: "";
				height: 14px;
				width: 12px;
				left: 10px;
				top: 0;
				bottom: 0;
				margin: auto 0;
				position: absolute;
				background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAWCAYAAAAmaHdCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4YTc4MzE0My1iZmRiLWY1NDEtOTVhZS1mZmEwOWFkNjJkMjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODM3MTNEOUJFNzE5MTFFN0FFQUZCRUZDQ0JDQzdBNEQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODM3MTNEOUFFNzE5MTFFN0FFQUZCRUZDQ0JDQzdBNEQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N2NjNjExNDAtODNiZi1mZjQwLWI3ZjItNWYzYWYzMzVjNTM3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZDM5YzI0ZjUtZDY4Ni0xMWU3LTllYzgtZTM4ZjFjMjJkMTNjIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VTvtCQAAAOdJREFUeNpiXLH1YCEDA0MdELMB8X8G7IAFiM+/eP58fX5yeBe6JBMQVwOxABBzATE3DswOxBa/fv1qmb5kQzA2Q7gYiAR///5l/f7t2/zpi9cHoBvyj4EEAHQN7/cfPxYCDfJGNoRk8OvnT74fP34snrFkgysswMgCP3/+FPzz58+GCXNW5JBkiKKSEroQKDwDMAxxszVh4ORgx2nQ9x8/GXYdPoMs5I1hCJoCYsBvJgbKwV9qGMJAjTBhoEaYMFDFO6NhQkNDKDWICWTANwoN+Q4K2DZoQc2Kp6DGBhiB+AcQtwIEGABNvlZha4nU/gAAAABJRU5ErkJggg==") no-repeat;
			}
		}
		.work-info {

			&>section{
				position: relative;
			}
			.to-operate {
				position: absolute;
				right: 0;
				bottom: 0;

				Button {
					&:nth-child(n-2) {
						margin-left: 12px;
					}
				}
			}
			.work-time {
				color: $color_font_0_7;
				font-size: 12px;
				margin-top: 6px;
			}
		}
		.work-log {
			$width_log: 78px;
			margin-bottom: 12px;
			header{
				margin-bottom: 14px;
			}
			.head-img{
				width: 30px;
				height: 30px;
				border-radius: 50%;
			}
			.log-time{
				display: inline-block;
				position: absolute;
				left: -1*$width_log;
				padding: 0 6px;
				font-size: 12px;
				color: $color_font_0_7;
			}
			.ivu-input-wrapper{
				padding-top: 30px;
				border: solid 1px $color_border;
				border-color: $color_border;
				border-top-color: transparent;
			}
			.log-list{
				.ivu-card-body {
					position: relative;
					.card-right{
						margin-right: 8px;				
					}
				}
			}
			textarea{
				border: none;
				height: 70px;
			}
			.status-tag{
				padding: 0 5px;
			}
			.save-log{
				position: relative;
			}
			.upload-msg{
				position: absolute;
				height: 30px;
				z-index: 100;
				&>span{
					color: $color_font_0_5;
					font-size: 12px;
				}
			}
			.ivu-btn{
				border: none;
				.ivu-icon{
					font-size: 20px;
					transform: rotate(35deg);
				}
				span{
					position: relative;
					margin: 0;
					top: -2px;
					font-size: 14px;
				}
			}
			.ivu-upload{
				.ivu-btn{
					padding: 6px 5px; 
				}
				display: inline-block;
			}
			.ivu-input:focus{
				box-shadow: none; 
			}
			.files, .no-files {
				position: relative;
				&>div{
					display: inline-block;
				}
			}
			.files {
				.user-name {
					line-height: 30px;
					margin: 0 6px;
				}
				&>img, .user-name, .files-right{
					position: relative;
					top: -5px;
					vertical-align: top;
				}
			}
			.status-tag{
				position: absolute;
				z-index: 10;
				left: 0;
			}
			.timeline-wrapper{
				padding: 16px;
				border: 1px solid $color_border;
				height: 210px;
				overflow: hidden;
				.ivu-card{
					font-size:12px;
					max-width: 624px;
					margin-top: 4px;
				}
			}
			.ivu-timeline-item{
				padding: 0 0 12px $width_log;
				.user-do{
					color: $color_font_0_7;
				}
				.files-right{
					max-width: 70%;
				}
				.user-leave-msg{
					padding: 8px 12px;
					line-height: 14px;
					border-radius: 20px;
					background: #eef0f1;
					word-break:normal;
					white-space:pre-wrap;
					word-wrap: break-word;
					overflow: hidden;
					display: inline-block;
					max-width: 100%;
				}
			}
			.ivu-timeline-item-content{
				font-size: 14px;
			}
			.ivu-timeline-item-tail{
				left: $width_log+6;
			}
			.color-line{
				vertical-align: top;
				display: inline-block;
				height: 1px;
				width: 120px;
				position: relative;
				top: 10px;
			}
			@each $name, $color in zip($action_list, $action_colors) {
				.item-#{$name} {
					.ivu-timeline-item-head-blue{
						border: 2px solid;
						border-color: $color;
					}
					.status-tag{
						background-color: $color;
					}
					.color-line{
						background-color: $color;
					}
				}
			}
			footer {
				.ivu-card{
					border-radius: 0;
					border-top-color: transparent;
					.ivu-card-body {
						padding-right:80px;
					}
					.ivu-icon-close-round{
						height: 24px;
						line-height: 24px;
						width: $height_card;
						text-align: center;
						position: absolute;
						right: 0;
						top: 0;
						font-size: 13px;
						cursor: pointer;
						color:#ced9df;
						&:hover {color:#b8c2c7;}
					}
					.progress-line{
						position: absolute;
						display: block;
						height: 1px;
						width: 0;
						bottom: 0px;
						left: 0;
						background: #19be6b;
						transition: width 0.5s;
					}
				}
			}
		}
		.to-select > div {
			float: left;
			margin-top: 8px;
		}
		.select-tag {
			margin-right: 58px;
		}
		.work-content{
			padding: 15px;
			margin-top: 10px;
			border: 1px solid $color_border;
			height: 168px;
			&>p {
				font-size: 14px;
				margin-bottom: 8px;
			}
			li:nth-child(n+2){
				.attachment-card{
					border-top: none;
				}
			}
		}
		.submit{
			text-align: right;
			margin-right: $cotent_margin_right;
		}
		> footer{
			margin-bottom: 20px;
			button{
				float: right;
				padding: 6px 30px;
				&.ivu-btn-info{
					background: $color_font_button;
					&:hover{
						background: $color_font_button_hover;
					}
				}
				&:nth-child(1){
					margin-left: 10px;
				}
			}
		}
	}
	@media screen and (min-width: 992px) {
		.work_order_detail .work-log .ivu-timeline-item .files-right{
			width: 60%;
		}
	}
	@media screen and (min-width: 1300px) {
		.work_order_detail .work-log .ivu-timeline-item .files-right{
			width: 70%;
		}
	}
	@media screen and (max-width: 1160px) {
		.work_order_detail .work-log .ivu-timeline .ivu-card{
			width: 100%;
		}
	}
	@media screen and (min-width: 1280px) {
        .work-nav {
            button.my-btn{
                display: none;
            }
        }
        .work-user-detail {
            width: 380px;
            margin-right: -20px;

            ._my-modals-wrap ._my-modals-box {
                box-shadow: none;
                background-color: #fbfcfe;
                border-left: 1px solid #e7f2f7;
            }
            .close {
                display: none;
            }
        }
    }
</style>