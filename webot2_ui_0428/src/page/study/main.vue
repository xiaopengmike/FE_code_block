<template>
	<div>
		<router-view></router-view>
		
	</div>
</template>
<script>
	import subNav from '../module/subNav'
	
	export default {
		props:{},
		data(){
			return {
				
			}
		},
		methods:{
			
		},
		components:{
			subNav,
		}
	}
</script>
<style>
	
	.qs_table .search_wrap {margin:20px; text-align:right;}
	
	.qs_table input[type=checkbox], input[type=radio] {margin:0;}
	.qs_table {min-height:750px;border-radius:7px; margin:25px 20px 37px;; overflow:hidden; background:#fff; box-shadow:-1px 0px 15px #eee,1px 0px 10px #eee,0px -1px 15px #eee,0px 1px 15px #eee;}
	.qs_table > div{ border-top:4px solid #2bb3f3;}
	.qs_table table {}
	.qs_table td:last-child span:hover {color:#13A0E3; font-weight:bold;}
	.qs_table .check-btn{font-size:16px;}
	.qs_table .check-btn.glyphicon-check{ color:#d1c0a5}
	.qs_table .btn-success {background:#d1c0a5; color:#535353; border:none;}
	.qs_table .btn-success:hover {background:#c3b59f; color:#535353;}
	.qs_table label {-webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none;}
	
	.checkbox {width:15px; max-height:15px;} 
	.question_list {height:600px;}
	.question_list aside,.question_list section {display:inline-block; vertical-align:top;}
	.question_list aside {width:140px; }
	.question_list .wrapper {max-height:100%;}
	
	.question_list section {width:690px; position:relative; z-index:10; background:#fff;;}
	.question_list .search_wrap {text-align:right; position:relative; }
	.question_list .search_wrap input {border-radius:5px; border:1px solid #ccc; padding:3px; margin-top:10px; }
	.question_list .search_wrap input + span {position:absolute; top:16px; right:3px;}
	.question_list .table td,.question_list .table th {border:none;}
	.question_list .table th { color:#2bb3f3; font-size:14px; font-weight:normal;}
	.question_list .table tbody tr:nth-child(odd) {background:#f8fbfc;}
	.question_list .table tbody tr:hover {background:#C6E2FF;}
	.question_list .table td a:hover {text-decoration:none; color:#1675d8;}
	.tables td:last-child span {display:inline-block;}
</style>
