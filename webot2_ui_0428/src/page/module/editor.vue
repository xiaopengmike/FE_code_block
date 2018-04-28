<template>
	<quill-editor v-model="content" :options="defaultOptions" ref="editor" class="_my-quill-editor">
		<div id="toolbar" slot="toolbar">
			<template v-for="(option,i) in options">
				<template v-for="(op,j) in option">
					<span class="ql-formats" v-if="judgeType(op) == 'string'">
						<button type="button" :class="'ql-'+op"></button>
					</span>
					<template v-else-if="judgeType(op) == 'object'">
						<!--图片，视屏-->
							<upload v-if="Object.keys(op)[0] == 'image'" class="ql-formats"
								:action="Object.values(op)[0].url" 
								:type="Object.values(op)[0].url.type || 'post'" 
								accept="|png|jpg|gif|icon"
								:header="Object.values(op)[0].url.header || {}" 
								:data="Object.values(op)[0].url.data || {}" 
								:success="imageSuccess" 
								:error="uploadError_mixin"
								:before="beforeUpload_mixin">
								<button type="button" >
									<svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
								</button>
							</upload>
							<upload v-else-if="Object.keys(op)[0] == 'video'" class="ql-formats"
								:action="Object.values(op)[0].url" 
								:type="Object.values(op)[0].url.type || 'post'" 
								accept="|mp4|avi|rmvb"
								:header="Object.values(op)[0].url.header || {}" 
								:data="Object.values(op)[0].url.data || {}" 
								:success="imageSuccess" 
								:error="uploadError_mixin"
								:before="beforeUpload_mixin" >
								<button type="button" >
									<svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect> <rect class="ql-fill" height="12" width="1" x="5" y="3"></rect> <rect class="ql-fill" height="12" width="1" x="12" y="3"></rect> <rect class="ql-fill" height="2" width="8" x="5" y="8"></rect> <rect class="ql-fill" height="1" width="3" x="3" y="5"></rect> <rect class="ql-fill" height="1" width="3" x="3" y="7"></rect> <rect class="ql-fill" height="1" width="3" x="3" y="10"></rect> <rect class="ql-fill" height="1" width="3" x="3" y="12"></rect> <rect class="ql-fill" height="1" width="3" x="12" y="5"></rect> <rect class="ql-fill" height="1" width="3" x="12" y="7"></rect> <rect class="ql-fill" height="1" width="3" x="12" y="10"></rect> <rect class="ql-fill" height="1" width="3" x="12" y="12"></rect> </svg>
								</button>
							</upload>
						<!--图片，视屏-->
						<span class="ql-formats" v-else-if="judgeType(Object.values(op)[0])=='string'">
							<button type="button" :class="'ql-'+Object.keys(op)[0]" :value="Object.values(op)[0]"></button>
						</span>
						<span class="ql-formats" v-else>
							<span class="ql-label" ></span>
							<select :class="'ql-'+Object.keys(op)[0]">
								<template v-for="(se,x) in Object.values(op)[0]">
									<option v-if="se===false" selected="selected"></option>
									<option v-else :value="se"></option>
								</template>
							</select>
						</span>
					</template>
				</template>
			</template>
			
			
		</div>
	</quill-editor>
</template>

<script>
	import { quillEditor } from 'vue-quill-editor'
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'
	import upload from './upload'
	import upload_mixin from './upload_mixin.js'
	export default {
		mixins:[upload_mixin],
		props:{
			value:{
				type:String,
				required:true,
			},
			placeholder:{
				type:String,
				default: '请输入...'
			},
			options:{
				type:Array,
				default:()=>{
					return [
						['bold', 'italic','underline','strike','blockquote','code-block',{header:'1'},{header:'2'},{list:'ordered'},{list:'bullet'},{script:'sub'},{script:'super'},{indent:'-1'},{index:'+1'},{direction:'rtl'}],
						[{size:['small',false,'large','huge']}],
						[{header:[1,2,3,4,5,6,false]}],
						[{color:[]}],
						[{background:[]}],
						[{font:[false,'serif','monospace']}],
						[{align:[false,'center','right','justify']}],
						['link'],
						[{image:{
							url:'/upload',
							type:'post',
							header:{},
							size:'5M',
							data:{},
						}}],
						[{video:{
							url:'/upload',
							type:'post',
							header:{},
							size:'5M',
							data:{},
						}}],
					]
				}
			}
		},
		data(){
			var colors = ["#000000","#e60000",false];
			var background=["#000000","#e60000",false];
			return {
				defaultOptions:{
					placeholder:this.placeholder||'',
					modules: {
						toolbar: '#toolbar'
					}
				}
			}
		},
		created(){
			this.handlerColorAndBackground();
		},
		computed:{
			content:{
				set(val){
					this.$emit('input',val);
				},
				get(){
					return this.value;
				}
			},
			editor(){
				return this.$refs.editor.quill;
			}
		},
		methods:{
			judgeType(item){
				if(item==='image' || item == 'video'){
					return item;
				}else{
					return typeof item;
				}
			},
			handlerColorAndBackground(){
				for(let i=0;i<this.options.length;i++){
					let op = this.options[i]
					if(typeof op[0] == 'object'){
						if(op[0].color!==undefined && op[0].color.length!=0){
							op[0].color = this.color;
						}
						if(op[0].background!==undefined && op[0].background.length!=0){
							op[0].background = this.background;
						}
					}
				}
			},
			imageSuccess(res,file){
				this.uploadSuccess_mixin(res);
				this.editor.focus();
				this.editor.insertEmbed(this.editor.getSelection().index, 'image', res.url);
			},
		},
		components:{
			quillEditor,
			upload,
		},
		watch:{
			options:{
				handler(n){
					this.handlerColorAndBackground();
				},deep:true,
			}
		}
	}
</script>

<style lang="scss">
	._my-quill-editor{
		.ql-snow{
			&.ql-toolbar {
				border-radius:3px;
				padding:0; line-height:30px;
				.ql-picker{
					height:30px;
				}
				.ql-formats{
					margin-right:0;
				}
			}
			&.ql-container{
				.ql-tooltip{
					left:0 !important;
					z-index:20;
				}
			}
		}
	}
</style>