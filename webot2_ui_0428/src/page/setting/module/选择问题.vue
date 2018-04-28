<template>
	<div class="__select-question">
    	<div class="tree">
    		<bar :wrapper="'wrapper'">
    			<tree :list="classifys" :option='tree_options' @changeTag="changeTag"></tree>
    		</bar>
    	</div>
    	<div class="list">
    		<bar :wrapper="'wrapper'">
	    		<table class="tables">
	    			<tr>
	    				<th>标准问题</th>
	    			</tr>
	    			<tbody>
	    				<tr v-for="(item,i) in list">
	    					<td :class="{'no-click': (!isExist(item) && selectedList.length>9)}"  @click="selected(item)">
	    						<i class="glyphicon" :class="'glyphicon-'+getClass(item)"></i>
	    						<!-- <i @click="selected(item)" v-else class="glyphicon glyphicon-check"></i> -->
	    						{{item.question}}
	    					</td>
	    				</tr>
	    			</tbody>
	    		</table>
    		</bar>
    	</div>
    	<div class="text-center pagination">
			<pagination :page="page" :total="total" @pageTurn="searchs"></pagination>
		</div>
	</div>
</template>

<script>
	import tree from '../../module/tree.vue'
	import bar from '../../module/自定义滚动条.vue'
	import pagination from '../../module/pagination.vue'
	export default{
		props:{
			selectedList:{
				required:true,
				type:Array,
			},
			pageSize:{
				type:Number,
				default:10,
			}
		},
		data(){
			return {
				classifys:[{id:'',name:'全部分类',noEdit:true},{id:0,name:'未分类',noEdit:true}],
				page:{
					page:1,
					size:this.pageSize,
					tag1:'',
					tag2:'',
					q:'',
				},
				list:[],
				total:0,
				
				tree_options:{
					addChild:false,
				}
			}
		},
		created(){    
			this.getClassifys();
			this.searchs();
		},
		mounted(){
			console.info('问题列表：',this.selectedList)
		},
		computed:{
			
		},
		methods:{
			getClassifys(){
				let v = this;
				v.$api.ajax(v.$uri.questions.tag.get,'get')
				.then(data=>{
					v.classifys = v.classifys.concat(data);   
				})
			},
			searchs(index=undefined){
				let v = this;
				if(index) v.page.page = index;
				v.$api.ajax(v.$uri.questions.get,'get',v.page)
				.then(data=>{
					v.list = data.list;
					v.total = data.total;
				})
			},
			changeTag(i,j=''){   
				let v = this;
				v.page.tag1 = i;
				v.page.tag2 = j;
				v.searchs(1);
			},
			getClass(item){
				if(this.isExist(item)!==false){
					return "check"
				}
				return "unchecked"
			},
			isExist(item){
				var sl = this.selectedList;
				for(var i in sl){
					if(sl[i].id == item.id) return i;
				}
				return false;
			},
			selected(item){
				if(this.selectedList.length > 9) return;
				var index = this.isExist(item)
				if(index === false){
					this.selectedList.push(item)
				}else{
					this.selectedList.splice(index,1);
				}
			}
		},
		components:{
			pagination,tree,bar
		},
		watch:{
			
		},
		directives:{
			
		},
		filters:{
			
		},
	}
</script>

<style lang="scss" scoped="">
	.__select-question {
		width:100%; height:100%; font-size:0;
		& > * {display:inline-block; font-size:14px; height:calc(100% - 70px); vertical-align:top;}
		.tree {
			width:180px;
			border-right:1px solid #ccc;
			.wrapper {height:100%;}
		}
		.list {
			width:calc(100% - 180px;);
			.wrapper {height:100%;}
	
			.no-click{
				pointer-events: none;
				color: #ccc;
			}
			td:hover{
				background: #f2f2f2;
				cursor: pointer;
			}
		}
		.pagination {
			display:block;  height:auto; 
		}
	}
</style>
