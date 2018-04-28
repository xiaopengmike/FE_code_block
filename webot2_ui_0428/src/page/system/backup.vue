<template>
	<div class="backup">
		<h1 class="page_title">
			数据备份
		</h1>
		<div class="table_wrap">
			<div class="table4 simulate_table">
				<ul class="thead">
					<li class="tr">
						<div class="th">备份名称</div>
						<div class="th">实例名称</div>
						<div class="th">备份大小</div>
						<div class="th">类型</div>
						<div class="th">备份时间</div>
						<div class="th">状态</div>
					</li>
				</ul>
				<ul class="tbody">
					<li class="tr" v-for="(item,index) in list">
						<div class="td" :title="item.备份名称">{{item.备份名称}}</div>
						<div class="td" :title="item.实例名称">{{item.实例名称}}</div>
						<div class="td">{{item.备份大小}}</div>
						<div class="td">{{item.类型}}</div>
						<div class="td">{{$api.dateFormat('yyyy-MM-dd hh:mm',item.备份时间)}}</div>
						<div class="td">{{item.状态}}</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				list:[],
				page:{
					type:'backup',
					date:'',
				}
			}
		},
		created(){
			this.searchs();
		},
		computed:{

		},
		methods:{
			searchs(){
				let v = this;
				v.$api.ajax("/chat_stat",'get')
				.then(data=>{
					data.forEach((val,i)=>{
						data[i] = JSON.parse(val)
					})
					v.list = data;
				})
			}
		}
	}
</script>

<style lang="scss">
  @import '../../assets/scss/api.scss';
  $th_widths: ( 0.23, 0.27, 0.1, 0.12, 0.16, 0.12 );
	.backup {
		.simulate_table {
      @include simulateTableThWidth($th_widths);
		}
	}
</style>
