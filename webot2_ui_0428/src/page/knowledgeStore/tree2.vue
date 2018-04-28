<template>
	<div class="__tree __tree2">
		<ul>
			<li v-for="(li,i) in list"> 
				<template>
					<div @click="childShow(i,!li.show);" :class="{ active: li[options.child].find(val=>val[options.id]==active[0])}">
						<span class="unselect pointer fa fa-caret-right font15" v-if="li[options.child]&&li[options.child].length>0"
							 :class="li[options.child]&&li[options.child].length>0?(li.show?' turn':' '):' opacity'"></span>
						<p :title="li[options.name]"><b>{{li[options.name]}}</b></p>	 
						<i v-if="li[options.child]!=undefined && li.addChild!=false" @click.stop="addTag(i)" class="glyphicon glyphicon-plus pointer"></i>
					</div>
					<ol v-if="li.child&&li[options.child].length>0" v-show="li.show">
						<li v-for="(child,j) in li[options.child]" :class="{active: active[0]==child[options.id]}" @click.stop="changeTag(child[options.id]);" class="pointer">
							<div :class="{active: active[0]==child[options.id]}">
								<p :title="child[options.name]">
									<b class="name">{{child[options.name]}}</b>
									<i class="fa fa-trash"  @click.stop="deleteTag(child[options.id])"></i>
									<i class="fa fa-pencil" @click.stop="editTag(child[options.id])"></i>
									<i class="fa fa-copy" @click.stop="copyTag(child[options.id])"></i>
								</p>
								<p class="time" :title="$api.dateFormat('yyyy年M月d日',child.start)+'-'+$api.dateFormat('yyyy年M月d日',child.end)">{{$api.dateFormat('M/d',child.start)}}-{{$api.dateFormat('M/d',child.end)}}</p>
							</div>
						</li>
					</ol>
				</template>
				
			</li>
		</ul>
	</div>
</template>

<script>
	
	export default{
		props:{
			list:{
				type:Array,
				required:true
			},
			active:{
				required:true
			},
			option:{
				type:Object,
				default:()=>{
					return {};
				}
			},
			series:{
				type:Number,
				default:2,
			},
		},
		data(){
			return {
				options:{
					id:this.option.id||'id',
					name:this.option.name||'name',
					copy:this.option.copy||'copy',
					child:this.option.child||'child',
				},
				show:{
					tag1:'',
				},
			}
		},
		created(){ 
			
		},
		computed:{
			
		},
		methods:{
			itemShow(id1){
				this.show.tag1=id1;
			},
			childShow(i,b){ 
				this.$set(this.list[i],'show',b);
				//this.list[i].show = b;
			},
			changeTag(id){
				this.$emit('changeTag',id);
			},
			deleteTag(id){
				this.$emit('deleteTag',id);
			},
			editTag(id){
				this.$emit('beforeEditTag',id);
			},
			addTag(i){
				this.childShow(i,true);
				this.$emit('addTag',i);
			},
			copyTag(id){
				this.$emit('copyTag',id);
			},
			
		},
		components:{
			
		},
		watch:{
			'list':{
				handler:function(n){
					if(!this.show.tag1){
						for(let i=0;i<3;i++){
							if(this.list[i].child.length>0){
								this.show.tag1 = this.list[i].id;
								this.show.tag2 = this.list[i].child[0].id;
								break;
							}
						}
					}
				},deep:true
			}
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style lang="scss">
	$base-color:#8ba1ad;
	$tag-width:60%;
	$color1:#13a0e3;
	.__tree2{
		ul li{
			div{
				b{bottom:auto;}
			}
		}
	}
	.__tree {
		position:relative; 
		margin-right: 6px ;
			li { 
				position:relative; height:auto;
				div{
					padding:0; position:relative; 
					span {width:15px; height:15px;position:absolute; top:0; bottom:0; margin:auto; }
					span {
						left:7px; transition: all 0.5s; 
						&:hover {color:#31B0D5;}
						&.opcity {opacity:0;}
					}
					p{ padding-top:10px; padding-bottom:10px;}
					&.active {
						p{color:$color1; }
					}
				}
				ol {
					li {
						padding:15px 0;
						&:hover {background: #fff;}
						div {
							 height:auto; line-height:15px;
							
							label {color:#84dc95; font-size:15px; font-family:"微软雅黑"; vertical-align:top; position:relative; left:30px;}
							p {
								padding:0 0 0 25px;
								& + p {color:#ccc;}
								.name {
									max-width:52%;
									display:inline-block;overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis; 
								}
							}
							.time { color:#a6b7c1; }
						}
						&:hover{
							i {opacity: 1;}
						}
						i {
							float:right; 
							color:$base-color;
							width:20px; height:20px; text-align:center; line-height:20px; 
							border-radius: 50%;
							margin-right: 5px;
							margin-top: 5px;
							opacity: 1;
							background:rgba($base-color,0.4);
							&:hover {
								color:darken($base-color,10%);
							}
							&:first-child { margin-right: 8px;}
						}
					}
				}
				p {
					padding:0 0 0 20px;
					&:hover {color:#31B0D5; cursor:pointer;}
					input {line-height:28px; height:28px;}
				}
				&:first-child {
					span {
						font-weight:100;
						&::hover {color:#ffc156;}
					}
				}
			
			.turn {
				transform:rotate(90deg);
				transform-origin:25% 50%;
			}
		}
		
	}
	
</style>