<template>
	<ul class="tags">
		<li class="tag" :class="{active:''===active}">
			<div class="item" @click="change('')">
				全部标签
			</div>
		</li>
		<template v-for="(t,i) in reverTags">
			<li v-if="!t.edit" :class="{active:t.id===active}" class="tag clearfix">
				<div class="item" @click="change(t.id)">
					{{t.name}}
				</div>
				<i v-if="t.edit!==undefined" class="fa fa-trash" @click="remove(t,tags.length-i-1)"></i>
				<i v-if="t.edit!==undefined" class="fa fa-pencil" @click="t.edit=!t.edit"></i>
			</li>
			<li v-else :class="{active:t.id===active}" class="tag ">
				<input class="input" v-model="t.copy"  v-focus="t.edit" maxlength="6" @keydown.13="update(t)" />
				<i class="fa fa-times" @click="cancelEdit(t,tags.length-i-1)"></i>
				<i class="fa fa-check" v-show="t.copy.trim()!==''" @click="update(t)"></i>
			</li>
		</template>
		
	</ul>
</template>

<script>
	export default {
		props:{
			tags:{
				default:()=>{return [];}
			}
		},
		data(){
			return {
				active:'',
			}
		},
		created(){
			
		},
		computed:{
			reverTags(){
				let len = this.tags.length;
				let reverse = new Array(len);
				this.tags.forEach((val,i)=>{
					reverse[len-i-1] = val;
				})
				return reverse;
			},
		},
		methods:{
			change(id){
				this.$emit('change',id);
				this.active = id;
			},
			update(t){
				this.$emit('update',t)
			},
			remove(t,index){
				let v = this;
				this.$confirm('确定要删除标签“'+t.name+'”?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			    }).then(() => {
			    	this.$emit('remove',t.id,index);
			    })
			},
			cancelEdit(item,i){
				if(item.id!==''){
					item.copy=item.name;
					item.edit = false;
				} else{
					this.tags.splice(i,1);
				}
			}
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	$tag-height:25px;
	$base-color:#8ba1ad;
	$tag-width:60%;
	.tags{
		height:100%;
		.wrapper{
			height:calc(100% - 120px);
		}
		.tag {
			height:$tag-height;
			padding-left:20px;
			margin:10px 0;
			&:hover {
				
				& >i{
					opacity:1;
				}
			}
			&.active{
				color:#fff;
				input {}
				.item {background:rgba($base-color,1);}
			}
			.item,.add{
				display:inline-block;
				max-width:$tag-width;
				line-height:$tag-height;
				max-height:$tag-height;
				padding-left:20px;
				padding-right:5px;
				border-radius:4px;
				cursor:pointer;
				i {position:absolute; top:6px;}
			}
			.item{
				padding-left:5px;
				overflow:hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;
				position:relative;
				border:1px solid transparent;
				background:rgba($base-color,0.3);
				i {right:5px; }
				&.active{
					color:#fff;
					background:$base-color;
				}
			}
			.add{
				color:#8b99a7;
				line-height:$tag-height;
				padding-right:5px;
				position:relative;
				border:1px dashed #b1bcc1;
				
				i {left:5px; }
			}
			& > i {
				float:right; 
				color:$base-color;
				width:20px; height:20px; text-align:center; line-height:20px; 
				border-radius: 50%;
				margin-left:8px;
				margin-top:#{($tag-height - 20px)/2};
				opacity: 0;
				background:rgba($base-color,0.4);
				&:hover {color:darken($base-color,10%);}
			}
			.input {
				width:$tag-width; color:#666; outline:none; padding:3px 5px; border-radius:4px;  box-shadow: none;
			}
		}
		
		i {cursor:pointer;}
	}
</style>