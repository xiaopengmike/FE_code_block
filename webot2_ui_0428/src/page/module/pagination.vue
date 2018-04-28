<template>
	<div class="_pagination_wrap">
		<span class="pagination_info">
			<span v-show="searchString">搜索到包含"{{searchString}}"的条目</span>共{{total}}条
		</span>
		<ul>
			<li @click="turn(page.page-1>0?page.page-1:1)" :data-page="page.page-1>0?page.page-1:1">
				<a >&laquo;</a>
			</li>
			<li v-for="n in pages" :class="n==page.page?'active':''" @click="turn(n)" :data-page="n">
				<a>{{n}}</a>
			</li>
		    <li @click="turn(page.page+1>Math.ceil(total/page.size)?page.page:page.page+1)" :data-page="page.page+1>Math.ceil(total/page.size)?page.page:page.page+1" >
		    	<a >&raquo;</a>
		    </li>
		</ul>
		<span class="go">
	    	<input v-onlynum='{min:"1",max:Math.ceil(total/page.size)}' type="number" min="1" :max="Math.ceil(total/page.size)" v-model="toTurn"/>
	    	<b>/{{Math.ceil(total/page.size)}}页</b>
	    	<button @click="turn(toTurn)" class="btn">Go</button>
		</span>
	</div>
</template>
<script>
	export default {
		props:{
				page:{
					type:Object,
				},
				total:{
					type:Number,
				},
				pageTurn:{
					type:Function,
				},
				searchString:{
					type:String,
					required:false,
					default:'',
				},
			},
		data(){
			return {
				toTurn:'',
			}
		},
		computed:{
			pages:function(){
		  		var self = this;
		  		var pages=[];
		  		var len = Math.ceil(self.total/self.page.size);
		  		var start=1,end=1,index=self.page.page;
				if(len<=5){
					end=len;
				}else{
					if(index<=3){
						end=5;
					}else{
						if(index>len-2){
							end=len;
							start=len-4;
						}else{
							end=index+2;
							start = index-2;
						}
					}
				}
				for(var i=start;i<=end;i++)
					pages.push(i)
		  		return pages;
		    },
		},
		methods:{
			turn(index=0){		
				if(!index) return;
				this.page.page = Number(index);    
				this.toTurn = '';
				this.$emit('pageTurn');
			}
		},
		directives:{
			onlynum:{
				update:function(el,binding){
					el.value=el.value.replace(/\D/g,'');
					if(el.value!=""&& el.value<binding.value.min)
						el.value = binding.value.min;
					if(el.value!=""&& el.value>binding.value.max)
						el.value = binding.value.max;
					el.dispatchEvent(new Event('input'))
				}
			}
		},
	}
</script>
<style lang="scss">
	$pageColor:#4a6876;
	._pagination_wrap{
		&>*{
			display:inline-block;
			vertical-align:top;
		}
		ul {
			font-size:0;
			li {
				display:inline-block; line-height:26px;min-width:26px; height:26px;  vertical-align:top;
				border-color:#b8c9d3;
				border-width:1px 1px 1px 0;
				border-style:solid;
				&:first-child {border-left-width:1px;}
				a {
					display:block; width:100%; height:100%;
					font-size:14px; color:$pageColor;
				}
				&.active {
					border-color:#0f86ff;
					a {background-color:#0f86ff; color:#fff;}
				}
			}
		}
		.pagination_info {color:#a3afb7; line-height:31px; padding-right:30px;;}
		.go{
			input {width:40px; line-height:22px; padding:0 3px;  margin-left:10px;}
			.btn {height:28px; padding:0 5px; background-color:#d9e6ed; color:#4a6876;}
		}
		
	}
	

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button{
	    -webkit-appearance: none !important;
	    margin: 0; 
	}
	input[type="number"]{-moz-appearance:textfield;}
</style>