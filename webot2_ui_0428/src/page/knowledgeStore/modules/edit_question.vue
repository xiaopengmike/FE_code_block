<template>
	<div class="_edit_question">

		<my-modals v-model="currentValue">
			<span slot="title">
				{{title[ctype]}}&emsp;&emsp;
				<span v-if="ctype=='edit'" class="pull-right similar-question-check">&emsp;相似问题检测&emsp;
		          	<!--<el-switch v-model="问题检测" @change="clear问题推荐()" on-text="" off-text="" width="40"></el-switch>-->
		          	<i-switch v-model="问题检测" @on-change="clear问题推荐()" size="small"></i-switch>
		        </span>
			</span>
			<div slot="content">
				<ul class="tabs tabs-2" :class="'active'+AUX.tab_index">
					<li class="tab" @click="AUX.tab_index = 0">普通选项</li>
					<li class="tab" @click="AUX.tab_index = 1">高级选项</li>
				</ul>
				<br />
				<el-form :model="question" :rules="question_rules"  ref="question" class="small_modals">
					<div v-show="AUX.tab_index==0">
						<el-form-item label="标准问题" prop="question" >
							<el-input v-model="question.question" placeholder="填写访客可能出现的问题" @blur="get标准问题推荐()" ></el-input>
						</el-form-item>
						<div>
							<div v-if="问题检测&&ctype=='edit'" v-show="问题推荐index==-1 && 标准问题推荐list.length>0">
								<span class="ps">推荐相似问题</span>
								 <ul>
					                <li class="similarQuestionArrItem" v-for="(item,i) in 标准问题推荐list" v-if="i<5">
					                    {{item.question}}
					                    <span class="pull-right similarQRecomButton pointer" @click="associateToQuestion(item)">关联</span>&nbsp;
					                </li>
				                </ul>
							</div>
						</div>
						<el-form-item label="分类" prop="tag1" class="question-tag">
							<el-select v-model="question.tag1" placeholder="" @visible-change="selectTag1">
								<el-option v-for="op in ctags" v-if="op.id!==''" :value="op.id" :label="op.name"></el-option>
							</el-select>
							<el-select v-model="question.tag2" placeholder="">
								<el-option :value="null" label="未分类"></el-option>
								<el-option v-for="op2 in tag2List"  :value="op2.id" :label="op2.name"></el-option>
							</el-select>
						</el-form-item>
						<template v-for="(val,index) in question.similar_question">
							<el-form-item :prop="'similar_question.'+index" :label="index==0?'相似问题':''" :rules="question_rules.similar_question" class="similar-question ">
								<el-col  :span="22">
									<el-input  v-model="question.similar_question[index]" @blur="get相似问题推荐(index)" placeholder="填写此问题的其他问法"></el-input>
								</el-col>
								<el-col :span="1" :offset="1">
									<i class="el-icon-close pointer" @click="question.similar_question.splice(index,1);"></i>
								</el-col>
							</el-form-item>
							<div  v-if="问题检测&&ctype=='edit'" v-show="问题推荐index==index && 标准问题推荐list.length>0">
								<span class="ps">更多相似问题</span>
								<span class="pull-right pointer similarQRecomButton" @click="标准问题推荐list=[]">关闭推荐</span>
								<ul>
					                <li class="similarQuestionArrItem" v-for="(item,i) in 标准问题推荐list" v-if="i<5">
					                    {{item.question}}
					                    <span class="pull-right similarQRecomButton pointer" @click="associateToQuestion(item)">
					                      关联
					                    </span>&nbsp;
					                </li>
				                </ul>
							</div>
						</template  >
						<span class="pointer add-similar" @click="question.similar_question.push('');" ><i class="fa fa-plus"></i>&thinsp;添加相似问题</span>
						
						<el-tabs type="card" v-model="questionTabs">
							<el-tab-pane label="普通答案" name="normal_answer" class="normal-answer">
								<!--<div class="answer-title">标准回答</div>-->
								<el-form-item v-for=" (val,index) in question.answer"  :label="index==0?'标准回答':''" :prop="'answer.'+index" :rules="question_rules.answer">
									<el-col :span="22">
										<el-input type="textarea" v-model="question.answer[index]" placeholder="请输入标准答案"></el-input>
									</el-col>
									<el-col :span="1" :offset="1">
										<i v-if="question.answer.length!=1" class="el-icon-close pointer" @click="question.answer.splice(index,1)"></i>
									</el-col>
								</el-form-item>
								<span class="pointer add-similar" @click="question.answer.push('')" ><i class="fa fa-plus"></i>&thinsp;添加标准回答</span>
							</el-tab-pane>

		    				<el-tab-pane label="富媒体答案" name="rich_answer">
								<div class="rich-answer">
									<div class="choose-type">
										
										<el-popover ref="popover1" placement="top" trigger="hover"  popper-class=" black">
											<p>最大2M，并播放长度不超过60s，支持MP3格式</p>
										</el-popover>
										<el-popover ref="popover2" placement="top" trigger="hover"  popper-class=" black">
											<p>最大10M，支持MP4格式</p>
										</el-popover>
										<el-popover ref="popover3" placement="top" trigger="hover"  popper-class=" black">
											<p>最大2M，支持PNG、JPG、JPEG、GIF格式</p>
										</el-popover>
										
										<div :class="rich_index == 0? 'active_':''" @click="richChoose(0)"  class="rich-text">
											<i class="fa fa-font" aria-hidden="true"></i>
											<p>文字</p>
										</div>
										<div :class="rich_index == 1? 'active_':''" @click="richChoose(1)">
											<upload v-popover:popover3 :action="$uri.upload.file" :type="'post'" accept="PNG|JPG|JPEG|GIF" size="2m" :before="beforeUpload" :success="answerUploadSuccess" :error="uploadError_mixin" :progress="uploading">

										    	<div :title="'请上传'+upload.type+'文件'" class="text-center">

										    	</div>
										    	<p><i class="fa fa-picture-o" aria-hidden="true"></i> 图片</p>
										    </upload>
										</div>
										<div :class="rich_index == 2? 'active_':''" @click="richChoose(2)">

											<!--
											<div @click="beforeAnswerUpload('audio')">before</div>
											<div @click="answerUploadSuccess(test.res, test.file)">语音</div>
											 -->
											<upload v-popover:popover1 :action="$uri.upload.file" :before="beforeUploadAudio"  :success="answerUploadSuccess" :error="uploadError_mixin" accept="MP3" size="2m" :progress="uploading">
												<p><i class="fa fa-microphone" aria-hidden="true"></i> 语音</p>
											</upload>

										</div>
										<div :class="rich_index == 3? 'active_':''" @click="richChoose(3)">

											<!--
											<div @click="beforeAnswerUpload('video')">before</div>
											<div @click="answerUploadSuccess(test.res, test.file)">视频</div>
											-->
											<upload v-popover:popover2 :action="$uri.upload.file" :before="beforeUpload" :success="answerUploadSuccess" :error="uploadError_mixin" accept="MP4" size="10m" :progress="uploading">
												<p><i class="fa fa-video-camera" aria-hidden="true"></i> 视频</p>
											</upload>
										</div>
									</div><br />
								</div>
								<!--<transition-group name="list" tag="ul">-->
									<el-form-item class="rich-answer-show" v-for=" (val,index) in question.rich_answer" :prop="'rich_answer.'+index" :key="index" :rules="question_rules.richAnswer">
										<el-col :span="22">
											<div >
												<div v-if="val.type=='text'" class="media-text">
													<el-input type="textarea" v-model="val.text"></el-input>
													<!--
													<el-input type="textarea" v-model="val.text" :disabled="val.disabled" @blur="val.disabled=val.text==''?false:true"></el-input>
													<el-button type="text" v-show="val.disabled" @click="input_focus(val, $event)">修改</el-button>
													 -->
												</div>
												<div class="media media-image" v-else-if="val.type=='image'">
													<img :src="val.url" alt="">
													<el-tooltip class="item" effect="dark" :content="val.name"  popper-class="black" :open-delay="400" placement="top-start">
														<p>{{val.name}}</p>
													</el-tooltip>
													<p class="media-size">{{getMediaSize(val.size)}}</p>
													<i class="progress-line" :style="{width: val.percent + '%'}" v-show="val.percent"></i>
                                                    <div class="btn-box">
                                                        <el-button type="text" @click="showBig(val)">查看</el-button>
                                                        <el-button type="text" @click="$api.downloadFromService(val.name, val.url)">下载</el-button>
                                                    </div>
												</div>
												<div class="media media-audio" v-else-if="val.type=='audio'" >
													<audio :src="val.url" @ended="playOver"></audio>
													<el-tooltip class="item" effect="dark" :content="val.name"  popper-class="black" :open-delay="400" placement="top-start">
														<p>{{val.name}}</p>
													</el-tooltip>
													<div class="bg-wrap" @click="playTaggle"><i class="image-vioce"></i></div>
                                                    <div class="btn-box">
                                                        <el-button type="text" @click="playMedia">播放</el-button>
                                                        <el-button type="text" @click="$api.downloadFromService(val.name, val.url)">下载</el-button>
                                                    </div>
													<i class="progress-line" :style="{width: val.percent + '%'}" v-show="val.percent"></i>
												</div>
												<div class="media media-video" v-else-if="val.type=='video'">
													<div class="video-wrap"><video :src="val.url"></video></div>
													<div class="bg-wrap"><i class="fa fa-play" aria-hidden="true"></i></div>
													<el-tooltip class="item" effect="dark" :content="val.name" popper-class="black" :open-delay="400" placement="top-start">
														<p>{{val.name}}</p>
													</el-tooltip>
													<p class="media-size">{{getMediaSize(val.size)}}</p>
                                                    <div class="btn-box">
                                                        <el-button type="text" @click="showBig(val)">播放</el-button>
                                                        <el-button type="text" @click="$api.downloadFromService(val.name, val.url)">下载</el-button>
                                                    </div>
													<i class="progress-line" :style="{width: val.percent + '%'}" v-show="val.percent"></i>
													<!-- <a :href="val.url" target="_blank">播放</a> -->
												</div>
												<div class="media media-video" v-else-if="val.type=='file'">
													<img :src="val.url" alt="">
													<el-tooltip class="item" effect="dark" :content="val.name" popper-class="black" :open-delay="400" placement="top-start">
														<p>{{val.name}}</p>
													</el-tooltip>
													<p class="media-size">{{getMediaSize(val.size)}}</p>
													<el-button type="text">查看</el-button>
													<i class="progress-line" :style="{width: val.percent + '%'}" v-show="val.percent"></i>
												</div>
											</div>

										</el-col>
										<el-col :span="1" :offset="1" class="delete-media">
											<i class="el-icon-close pointer" @click="question.rich_answer.splice(index,1)"></i>
										</el-col>
									</el-form-item>
								<!--</transition-group>-->
		    				</el-tab-pane>
						</el-tabs>
						<el-form-item label="知识点" >
							<a class="my-btn my-btn-info-o font12" @click="AUX.show_select_point=true">添加所属知识点</a>
						</el-form-item>
						<ul class="list">
							<li class="item" v-for="(p,i) in question.points" v-if="points[p]&&points[p].title">
								<span class="text" :title="points[p].title">{{i+1}}.{{points[p].title}}</span>
								<b class="close" @click="question.points.splice(i,1)">×</b>
							</li>
						</ul>
					</div>
					<div v-show="AUX.tab_index==1">
						<small class="explain">高级选项暂时无法配置</small>
						<el-form-item label="定时启用" :rule="{ required:question.advanced_options.start_switch?true:false , message: '请输入邮箱地址', trigger: 'blur' }">
							<el-col :span="12">
								<el-date-picker v-model="question.advanced_options.valid_start" type="datetime" format="yyyy年M月d日  HH:mm" :picker-options="pickerOptions3"></el-date-picker>
							</el-col>
							<el-col :span="12">
								<el-switch v-model="question.advanced_options.start_switch" on-color="#0f86ff" off-color="#ccc" on-text="" off-text="" class="pull-right"> </el-switch>
							</el-col>
						</el-form-item>
						<el-form-item label="定时禁用" >
							<el-col :span="12">
								<el-date-picker v-model="question.advanced_options.valid_end" type="datetime" format="yyyy年M月d日  HH:mm" :picker-options="pickerOptions4"></el-date-picker>
							</el-col>
							<el-col :span="12">
								<el-switch v-model="question.advanced_options.end_switch" on-color="#0f86ff" off-color="#ccc" on-text="" off-text="" class="pull-right"> </el-switch>
							</el-col>
						</el-form-item>
						<el-form-item label="优先级" >
							<div class="switch">
								<span :class="question.advanced_options.priority==1?'color3':''" @click="question.advanced_options.priority=1">低
								</span><span :class="question.advanced_options.priority==2?'color4':''" @click="question.advanced_options.priority=2">中
								</span><span :class="question.advanced_options.priority==3?'color5':''" @click="question.advanced_options.priority=3">高</span>
							</div>
						</el-form-item>
						<el-form-item label="关键词模式" >
							<el-switch v-model="question.advanced_options.keyword_switch" on-color="#0f86ff" off-color="#ccc" on-text="" off-text=""> </el-switch>
						</el-form-item>
						<el-form-item label="触发警报" >
							<el-switch v-model="question.advanced_options.warning_switch" on-color="#0f86ff" off-color="#ccc" on-text="" off-text=""> </el-switch>
						</el-form-item>
					</div>
				</el-form>

			</div>
			<div slot="foot">
				<button class="my-btn my-btn-transparent " @click="currentValue=false">&emsp;取消&emsp;</button>&emsp;&emsp;
				<button class="my-btn my-btn-info-f" :class="{'my-btn-disabled':question.rich_answer.some(val=>val.percent<100)}" :disabled="question.rich_answer.some(val=>val.percent<100)" @click="submit(question)">&emsp;确定&emsp;</button>
			</div>
		</my-modals>
		<selectPoint :ids="question.points" @update:ids="val=>question.points=val" v-model="AUX.show_select_point"></selectPoint>
	</div>
</template>

<script>
	import upload from '../../module/upload'
	import handler from '../mixin.js'
	import upload_mixin from '../../module/upload_mixin.js'
	import selectPoint from './select_point'
	export default {
		props:{
			value:{
				type:Boolean,
				default:false,
			},
			type:{
				type:String,
				default:'edit',					 //edit编辑问题，merge问题合并
			},
			title:{
				type:Object,
				default:()=>{
					return {
						edit:'编辑问题',
						merge:'合并问题'//
					}
				},
			},
			tags:{
				required:false,
				default:()=>{return []},
			},
			question:{
				required:true,
				type:Object,
			},
			cover:{
				ype:Boolean,
        		default:false,
			}
		},
		mixins: [handler, upload_mixin],
		data(){
			var validate1 = (rule, value, callback) => {
				if(value && value.indexOf('$') != -1) {
					callback();
				} else {
					callback();
				}
			};
			/*var validate2 = (rule, value, callback) => {
		  		let isObjEmpty = function(obj){
	  				for(let i in obj) return false;
	  				return true;
	  			}
		  		if(isObjEmpty(this.question.rich_answer)&&!value){
	  				callback(new Error("请输入标准答案"));
	  			}else{
	  				callback();
	  			}
		  	};*/
            var validate2 = (rule, value, callback) => {
                let ok = true
                if (this.questionTabs === 'normal_answer') {
                    if (value.trim() === '' && this.question.rich_answer.length === 0) {
                        callback(new Error("请输入标准答案"))
                    }
                }
                if (ok) {
                    callback()
                }
            };
            var validate3 = (rule, value, callback) => {
                let ok = true
                if (this.questionTabs === 'rich_answer') {
                    if (value.type === 'text') {
                        if (value.text.trim() === '') {
                            callback(new Error("请输入文字"))
                            ok = false
                        }
                    }
                }
                if (ok) {
                    callback()
                }
            };
			return {
				标准问题推荐list: [],
				问题推荐index:'',
		        value1: true,

				Clists: [{
					name: '全部分类',
					id: ""
				}, {
					name: '未分类',
					id: 0
				}],
				ctags:[],
				ctype:'',
				upload: {
					type: '|xls|xlsx',
				},
				nowTag1: "",
				question_rules: {
					question: [{ required: true, message: '请输入标准问题', trigger: 'blur' }],
					similar_question: [{ validator: validate1 }, ],
                    answer: [
                        { validator: validate2}
                    ],
                    richAnswer: [
                        { validator: validate3}
                    ],
				},
				questionTabs: "normal_answer",
				rich_index: 0,
				// answer_model: "",

				points:{},             //obj

				AUX:{
					file_name:{},
					tab_index:0,
					show_select_point:false,
				}
			}
		},
		created(){
			this.ctype=this.type;
		},
		methods:{
			clear问题推荐(data){
				if(!data){
					this.标准问题推荐list = [];
				}
			},
			associateToQuestion(item){
				let v= this;
				item = v.$api.deepCopy(item);
				v.ctype = 'merge';
				if(v.question.id){
					v.question.merge_ids.push(v.question.id);
					v.question.id="";
				}
				v.question.merge_ids.push(item.id);
				v.question.similar_question.push(item.question);

				//兼容老数据
				let need_merge = ['similar_question','answer','rich_answer'];
				need_merge.forEach(val=>{
					if(typeof item[val]  == 'string'){
						try{
							item[val]  = JSON.parse(item[val]);
						}catch(e){
							console.log(e)
						}
					}
					if(typeof item[val] == 'string'){
						item[val] = [item[val]];
					}
				})
				//合并
				item.similar_question.forEach(val=>{
					if(val.trim()!=='')
						v.question.similar_question.push(val);
				});
				item.answer.forEach(val=>{
					if(val.trim()!=='')
						v.question.answer.push(val);
				});
				item.rich_answer.forEach(val=>{
					v.question.rich_answer.push(val);
				});

				//清除空问题和答案
				need_merge.forEach(val=>{
					for(let i=0;i<v.question[val].length;i++){
						if(v.question[val][i]===''){
							v.question[val].splice(i,1);
						}
					}
				});
				//去重复
				v.question.similar_question = [...new Set(v.question.similar_question)];
				v.question.answer = [...new Set(v.question.answer)];
		    },

		    hideQRecom(index){
		        this.标准问题推荐list=[];
		    },
			get问题推荐(data){
				let v = this;
				return new Promise((resolve,reject)=>{
					v.$api.ajaxNoLoading(v.$uri.knowledgeStore.knowledge.标准问题检测, 'post', data)
					.then(result => {
						if(v.question.id)            //如果有id即编辑问题--》去掉自己相同的问题
							result = result.filter(val=>v.question.question!=val.question);
						resolve(result);
					}).catch(err=>{
						reject(err);
					})
				});
			},
		    get标准问题推荐() {
		    	let v =this;
		        if(v.问题检测){
		        	v.标准问题推荐list = [];
		          	let data={
		          		question:v.question.question
		          	};
		          	v.get问题推荐(data)
		          	.then(result => {
		            	v.标准问题推荐list = result;
		            	v.问题推荐index=-1;
		          	});
		        }

		    },
		    get相似问题推荐(i){
		    	let v =this;
		    	if(v.问题检测){
		        	v.标准问题推荐list = [];
		          	let data={
		          		question:v.question.similar_question[i]
		          	};
		          	v.get问题推荐(data)
		          	.then(result => {
		          		v.标准问题推荐list = result;
		            	v.问题推荐index=i;
		          	});
		        }
		    },


			selectTag1(val){
				if(val){
					return this.nowTag1 = this.question.tag1;
				}
				if(this.nowTag1 != this.question.tag1){
					this.question.tag2 = null;
				}
			},
			getTags(){
				let v = this;
				v.$api.ajax(v.$uri.knowledgeStore.knowledge.tags,'get')
				.then(data=>{
					v.ctags = v.Clists.concat(data);
				})
			},
			getPoints(ids){
				let v = this;
				v.$api.ajaxNoLoading(v.$uri.knowledgeStore.point.list,'get',{ids:ids})
				.then(data=>{
					v.points = {};
					data.list.forEach(val=>{
						v.points[val.id] = val;
					});
				})
			},
			richChoose(index){
		  		this.rich_index = index;
		  		var len =  this.question.rich_answer.length
		  		var last_answer = this.question.rich_answer[len-1]
		  		console.log("last_answer -->",last_answer)
		  		// 如果最后一栏为
		  		if(index == 0){
		  			this.question.rich_answer.push({
		  				"type": "text",
		  				"url": "",
		  				"text": "",
		  				"name": "",
		  				"description": "",
		  				// "disabled": false,
		  				"size": "",
		  				"id": Date.now()
		  			})
		  		}
		  		if(!last_answer) return ;
		  		if(last_answer && last_answer.type == "text" && last_answer.text == ""){
		  			this.question.rich_answer.pop()
		  		}
		  	},
		  	genRichAnswer(type, url, size, name){
				return {
					"type": type,
					"url": url,
					"text": "",
					"name": name,
					"description": "",
					"size": size,
					"id": Date.now(),
					"percent": 0,
				}
			},
			getMediaSize(size){
		  		if(size >> 20 > 0) return (size/Math.pow(2,20)).toFixed(2)+"MB";
		  		if(size >> 10 > 0) return (size/Math.pow(2,10)).toFixed(2)+"KB";
		  		return size+"B"
		  	},
		  	showBig(val){
		  		let w = 600;
		  		let h = 400;
		  		let pw = (document.body.clientWidth-w)/2
		  		let ph = (document.body.clientHeight-h)/2
		  		// console.log(document.body.clientWidth, document.body.clientHeight)
		  		// document.creatElement("a")
		  		let new_html_size = "width="+w+",height="+h+",top="+ph+",left="+pw;
		  		let new_html_url = "/#/showMedia?type="+val.type+"&url="+val.url;
		  		window.open(new_html_url, "test", new_html_size);
		  	},
		  	beforeUpload(file){
		  		let type = file.type.split("/")[0]
		  		let temp_media = this.genRichAnswer(type, "", file.size, "")
				let index = this.question.rich_answer.length
				this.question.rich_answer.push(temp_media)
				return index;
		  	},
		  	beforeUploadAudio(file){
		  		let v = this;
		  		return new Promise((resolve, reject)=>{
			  		let audios = document.createElement('audio'),
			  			  uri = v.$api.createObjectURL(file);
			  		audios.oncanplaythrough = function(e){   
			  			if(e.target.duration>60){
			  				v.$api.warn('语音播放长度不能超过60s ！')
			  				reject('语音播放长度不能超过60s ！');
			  			}else{
			  				let index = v.beforeUpload(file);
			  				resolve(index);
			  			}
			  			audios = undefined;
			  		}
			  		audios.onerror = (err)=>{   
			  			v.$api.warn('文件已损坏！无法上传！')
			  			reject('文件已损坏！无法上传！');
			  			audios = undefined;
			  		}
			  		audios.src = uri;
		  		})
		  	},
		  	uploading( percent,index,实例){    console.log(arguments)
		  		let rich_answer = this.question.rich_answer[index]
		  		rich_answer.percent = percent*100;
		  		console.log("upload", percent);
		  	},
			answerUploadSuccess(res, file, index){
				let type = file.type.split("/")[0]
		  		let rich_answer = this.question.rich_answer[index];
		  		delete rich_answer.percent;
				rich_answer.url = res.url;
				rich_answer.name = res.filename;
				this.uploadSuccess_mixin("添加成功");
				// this.question.answer
			},
			playMedia(ev){
		  		let parent = ev.target.parentElement.parentElement
		  		// 播放声音
		  		let audio = parent.getElementsByTagName("audio")[0];
		  		audio.play();
		  		// 添加播放状态
		  		let voice_img = parent.getElementsByClassName("image-vioce")[0];
		  		if(voice_img.className.indexOf("play") < 0){
		  			voice_img.className = voice_img.className+" play";
		  		}
		  	},
		  	playTaggle(ev){
		  		let parent = ev.target.parentElement
		  		let audio = parent.getElementsByTagName("audio")[0];
		  		console.log(parent, audio)
		  		let voice_img = parent.getElementsByClassName("image-vioce")[0];
		  		if(voice_img.className.indexOf("play") < 0){ // 没有播放
		  			audio.play();
		  			voice_img.className = voice_img.className+" play";
		  		}else{ // 正在播放
		  			voice_img.className = voice_img.className.replace(" play","");
		  			audio.pause();
		  			audio.currentTime = 0;
		  		}

		  	},
		  	playOver(ev){
		  		console.error("audio over -->", ev)
		  		let parent = ev.target.parentElement
		  		let voice_img = parent.getElementsByClassName("image-vioce")[0];
		  		voice_img.className = voice_img.className.replace(" play","");

		  	},
			drop(i){
		    	console.error("use drop")
		    	let v = this;
		        let answer = this.question.rich_answer;
		        if(answer[i].type == "text" && answer[i].disabled != true){
		        	return ;
		        }
		        answer.splice(v.dragging.index,1);
		        answer.splice(i,0,v.dragging.media);
	     	},
	     	drag(i){
				console.error("use drag")
		        let v = this;
		        v.dragging.index = i;
		        v.dragging.media = v.question.rich_answer[i];
		    },
		   //  getMediaName(url){
		  	// 	console.log(url)
		  	// 	let matchs = url.split("/")
		  	// 	name = matchs[matchs.length-1]
		  	// 	if(name.startsWith("kf-")){
		  	// 		return name.slice(3,)
		  	// 	}
		  	// 	return name
		  	// },
		  	
			// submit(event){
			// 	this.currentValue = false;
			// 	this.successHandler(event);
			// },
			beforeSubmit(cquestion){
		  		let v = this;
		  		return new Promise( (resolve, reject)=>{
		  			this.$refs.question.validate((valid) => {
		          		if (valid) {
					  		let question = v.$api.deepCopy(cquestion);
					  		//去重复
							question.similar_question = [...new Set(question.similar_question)];
							question.answer = [...new Set(question.answer)];
					  		delete question.advanced_options;                                                   //暂时
					  		for(var i=0;i<question.similar_question.length;i++){
					  			if(question.similar_question[i].trim()==""){
					  				question.similar_question.splice(i,1);
					  				i--;
					  			}
					  		}
					  		// 删除普通答案的空白条
					  		for(var i=0;i<question.answer.length;i++){
					  			if(question.answer[i].trim()==""){
					  				question.answer.splice(i,1);
					  				i--;
					  			}
					  		}
					  		// 删除富媒体答案的多余字段
					  		for(var i=0;i<question.rich_answer.length;i++){
					  			console.log(i)
					  			let rich_answer = question.rich_answer[i]
					  			if(rich_answer.type=="text" && rich_answer.text==""){
					  				question.rich_answer.splice(i,1);
					  				i--;
					  				continue;
					  			}
					  			delete rich_answer["id"]
					  		}
	
					  		for(var i in question.rich_answer){  
					  			let val = question.rich_answer[i];
					  			console.log("val....",val)
					  			if(val.percent && val.percent != 100){
					  				v.$api.error('提交失败!还有文件正在上传!');
									reject('提交失败!还有文件正在上传!')
					  			}
					  		}
	
					  		if(question.rich_answer.length==0&&question.answer.length==0){
					  			v.$api.error('答案不允许为空');
								reject('答案不允许为空');
					  		}
	
							if(!question.id) {
								delete question.updated;
								resolve(question);
							} else {
								resolve(question);
							}
						}else{
							v.$api.error('请确认数据输入无误');
							reject('请确认数据输入无误')
						}
					});
		  		} )
			},
			
			async submit(cquestion){
				let v = this;
				let [err, question] = await v.$api.to(v.beforeSubmit(cquestion));
				if(question){
					v.send(question)
					.then(data=>{
						v.currentValue=false;
					}).catch(err=>{
						//reject(err);
					})
				}
			},
			
			send(question){
				let v = this;
				return new Promise((resolve, reject)=>{
					//合并？
					if( question.merge_ids && question.merge_ids.length>0 ){
						v.$api.ajax(v.$uri.knowledgeStore.knowledge.问题合并,'post',question)
						.then(r=>{
							v.$api.success('合并成功!');
							v.$emit('successHandler',r);
							resolve(r)
						}).catch(err=>{
							reject(err);
						})
					}else{
						if(!question.id){
							delete question.updated;
							this.$api.ajax(v.$uri.knowledgeStore.knowledge.list, 'post', question)
							.then(function(r) {
								v.$api.success('新增成功!');
								v.$emit('successHandler',r);
								resolve(r)
							}).catch(err=>{
								reject(err);
							})
						}else{
							this.$api.ajax(v.$uri.knowledgeStore.knowledge.list+'/'+question.id, 'put', question)
							.then(function(r) {
								v.$api.success('修改成功!');
								v.$emit('successHandler',r);
								resolve(r)
							}).catch(err=>{
								reject(err);
							})
						}
					}
				})
			}
		},
		computed: {
			tag2List: function() {
				var list;
				for(var i = 0; i < this.ctags.length; i++) {
					if(this.ctags[i].id == this.question.tag1) {
						list = this.ctags[i].child;
						break;
					}
				}
				return list;
			},
			问题检测:{
				get(){  
					return Boolean(this.$store.state.global.问题检测);
				},
				set(val){
					this.$store.dispatch('set问题检测',val);  
				}
			},
			currentValue: {
	            // 动态计算currentValue的值
	            get:function() {
	            	if(this.tags.length==0)
						this.getTags();
					else
						this.ctags = this.tags;
	              	return this.value; // 将props中的value赋值给currentValue
	            },
	            set:function(val) {
	            	if(!val){
	            		this.clear问题推荐(false);
	            		this.ctype = this.type;
	            	}
	            	this.AUX.tab_index = 0;
	              	this.$emit('input', val); // 通过$emit触发父组件
	            }
	       },
	       pickerOptions3() {
	       		return {
	       			disabledDate: (time) => {
	       				if(this.question.end != '')
	       					return time.getTime() > new Date(this.question.end).getTime();
	       			}
	       		}
			},
			pickerOptions4() {
				return {
					disabledDate: (time) => {
						if(this.question.start != '')
							return time.getTime() < new Date(this.question.start).getTime();
					}
				}
			}
		},
		components:{
			upload,
			selectPoint,
		},
		watch:{
			'question.id'(n,o){
				if(this.ctype == 'merge' && n!==''){             
					this.ctype = 'edit';
				}
				this.标准问题推荐list=[];
			},
			'question.points':{
				handler(n){
					if(n&&n.length>0)
					this.getPoints(n);
				},deep:true,
			},
		},
        filters: {
		    // 文件后缀
            suffix (val) {
                if (typeof val === 'string') {
                    let arr = val.split('.')
                    return arr[arr.length - 1]
                } else {
                    return ''
                }
            }
        }
	}
</script>

<style lang="scss">
.rich-answer-show .media { border: 1px solid #bfcbd9; height: 70px; border-radius: 4px; padding: 5px; background: #f6f6f6; font-size: 14px; position: relative;}
.rich-answer-show p {text-overflow: ellipsis}
.rich-answer-show .media-text {position: relative;}
.rich-answer-show .media-text button,
.rich-answer-show .media a,
.rich-answer-show .media .btn-box {
    position: absolute;
    right: 20px;
    top: 0;
    bottom: 0;
    line-height: 68px;
    button{
        color: #1f89f6;
    }
}
	$color1:#1f89f6;
	._edit_question{
		.rich-answer{
			p {display: inline-block;}
			.fa {font-size: 18px;}
			.choose-type {
				color: #a4afbc;
				p {font-size: 14px;}
				&>div{width: 70px; display: inline-block; height: 40px; line-height: 40px; cursor: pointer;}
				.active,& >div:hover {color: #383d42;}

			}
			.modal-body{
				padding:0;
				margin:0;
				.el-form-item__content{ line-height: normal; }
			}
			.normal-answer .title,.rich-answer .title{
				width: 100px; text-align: right; padding: 11px 12px 11px 0; float: left; font-size: 14px; display: none;
				&:before {content: '*'; color: #ff4949; margin-right: 4px;}
			}
		}
		.el-form-item{
			position:relative;
			.el-form-item__content {position:initial;}
			.el-switch {position:absolute; top:0; right:0; margin:0;}
			.pull-right {position:relative; top:10px;}
		}
		.el-form-item__label{
			margin:0;
			line-height:22px;
		}
		.add-similar {
			color:$color1; font-size:14px; cursor:pointer; padding-bottom:25px; display:inline-block;
			&:hover {color:darken($color1,10%);}
			i{display:iinline-block; border-radius:50%; width:18px; line-height:19px; height:18px; text-align:center; background:rgba($color1,0.2); margin-right:3px;}
		}
		.el-tabs__item{
			color:#b8c9d3;
			&.is-active {color:#666;}
		}
		.answer-title {
			margin-bottom:2px;
		}

		.el-icon-close {
			color:#d0dee6;
			&:hover {color:#bcccd6;}
		}
	}

.rich-answer-show .media-video .video-wrap,
.rich-answer-show .media-image img{float: left; height: 58px; width: 58px; overflow: hidden;}

.rich-answer-show .media-video video {height: 100%; width: 100%}
.rich-answer-show .media a{line-height: 68px; color: #a4afbc;  text-decoration:none;}
.rich-answer-show .media a:hover{ color: #0079f5}
.rich-answer-show .media-video p,
.rich-answer-show .media-image p{line-height: 20px; text-indent: 8px; height:20px}

.normal-answer .el-textarea__inner,
.rich-answer-show .el-textarea__inner{height: 90px; line-height: 20px;}
.rich-answer-show .el-textarea.is-disabled .el-textarea__inner{ cursor: default; background: #f6f6f6; }
.rich-answer-show .media-video p+p,
.rich-answer-show .media-image p+p{margin-top: 20px;}

.rich-answer-show .media-audio p{line-height: 26px; height: 26px; white-space: nowrap;}
.rich-answer-show .media-audio .bg-wrap{height: 32px; width: 130px; display: block; background: #d9dbde; border-radius: 10px; cursor: pointer;}
.rich-answer-show .media-audio .fa {font-size: 18px; transform: rotate(45deg); position: relative; left: 12px; color: #b3b8c0;}
.rich-answer-show .media-video video{ background: black; }
.rich-answer-show .media-video .bg-wrap{content: ""; display: block; height: 58px; width: 58px; position: absolute; background: rgba(0,0,0,.3)}
.rich-answer-show .media-video .fa{ position: absolute; top: 0; bottom: 0; height: 15.5px; left: 25px; margin: auto; font-size: 16px; color: white;}

.rich-answer{
	.choose-type{
		padding: 0;
	}
}

.delete-media {position: absolute; right: 2px; top: 0; bottom: 0; margin: auto; height: 32px;}
.media button span,
.media-text button span {pointer-events: none;}

.media p{
	width: 120px;
	overflow: hidden;
}

.media p,
.media-text textarea{
    color: #858a8f;
}
.media .media-size{
    color: #acb1b8;
    font-size: 12px;
}
.media .progress-line{
	position: absolute;
	display: block;
	height: 1px;
	width: 0;
	bottom: 1px;
	left: 0;
	background: #19be6b;
	transition: width 0.5s;
}

.question-tag{
	.el-select{
		width: 50%;
		float: left;
		&:nth-child(1){
			padding-right: 5px;
		}
		&:nth-child(2){
			padding-left: 5px;
		}
	}
}



/* width=border-size*2 */
/* 声音播放图标 */
.image-vioce::before {
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #b3b8c0;
    position: absolute;
    box-sizing: border-box;
}

.image-vioce::before,
.image-vioce::after{
    content: "";
    display: block;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
.image-vioce{width: 32px; height: 32px; display: block; position: relative;}
.image-vioce::after{width: 80%; height: 80%; display: block; position: absolute;}

.image-vioce,
.image-vioce::after,
.border-circle {
    border: #b3b8c0 4px solid;
    border-radius: 50%;
    border-bottom-color: transparent;
    border-top-color: transparent;
    border-left-color: transparent;
}
.image-vioce.play{
    border-right-color: transparent;
    animation: playAudio2 2s linear 0s infinite;
}
.image-vioce.play::after{
    border-right-color: transparent;
    animation: playAudio1 2s linear 0s infinite;
}
@keyframes playAudio2
{
    0% {border-right-color: transparent;};
    26% {border-right-color: transparent;};
    62% {border-right-color: #b3b8c0};
    78% {border-right-color: #b3b8c0};
    100% {border-right-color: transparent;};
}
@keyframes playAudio1
{
    0% {border-right-color: transparent;};
    26% {border-right-color: #b3b8c0};
    62% {border-right-color: #b3b8c0};
    78% {border-right-color: #b3b8c0};
    100% {border-right-color: transparent};
}
.similar-question-check{
  font-size: 12px;
  color:#8b99a7;
  font-weight:normal;
}
.similarQRecomButton{
  color: #2993FF;
  font-size: 12px;
}

.similarQuestionArrItem{
  font-size: 12px;
  margin: 5px;
}

</style>
