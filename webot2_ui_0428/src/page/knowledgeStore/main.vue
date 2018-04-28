<template>
	<div class="knowledgestores">
		<router-view ></router-view>
		
	</div>
</template>
<script>
	
	export default {
		props:{},
		data(){
			return {
				
			}
		},
		methods:{
			
		},
		components:{
		}
	}
</script>
<style lang="scss">
	.knowledgestores {
		padding-left:0 !important;
		padding-right:0 !important;
	}
	.knowledgestore {
		.page_title_special {
			font-size:16px;
			color:#343f4b;
			line-height:70px;
			padding-left:30px;
			background:#d9e6ed;
		}
	}
	
	
	$color1:#1f89f6;
	$color2:#ccc;
	$color3:#4cd23a;$color4:#f8ba43;$color5:#f06869;
	$color6:#feb312;
	.test-btn {color:#fff; background:#2CB8EB;  border-radius:5px; border:1px solid #fff;}
	/*公共部分*/
	.knowledgestore{
		.flex-left{
			.wrapper {height:calc(100% - 90px);}
			.addTag {
				margin-top:10px;
				 height:40px; margin:auto; color:$color1;line-height:47px; font-size:14px; cursor:pointer; padding-left:15px;
				&:hover {color:darken($color1,10%);}
				i{display:iinline-block; border-radius:50%; width:18px; line-height:19px; height:18px; text-align:center; background:rgba($color1,0.2); margin-right:3px;}
			}
		}
		.flex-right{
			overflow-y: auto;
			padding:0 20px;;
		}
	}
	.classify-table{
		display:flex;
		.classify_part{
			height:100%;
			flex-shrink:1;
			padding-top:10px;
			width:180px; overflow:hidden;height:100%; display:inline-block; vertical-align:top; 
			.wrapper {height:calc(100% - 50px);}
			.addTag {
				
				width:78%; height:30px; margin:auto; color:#bbb;line-height:27px; border:1px solid #ccc ; text-align:center; font-size:30px; cursor:pointer;
				&:hover {color:$color1; border-color:$color1;}
			}
		}
		.table_part{
			flex:1; 
			padding-left:10px;
			padding-right:42px;
			height:100%;
			overflow-y: auto;
		}
	}
	.question_table {min-height:100%;border-radius:7px; margin:20px; overflow:hidden; position:relative; background:#fff; box-shadow:-1px 0px 15px #eee,1px 0px 10px #eee,0px -1px 15px #eee,0px 1px 15px #eee;}
	.question_table { border-top:4px solid #2bb3f3; margin-left:0;}
	.switch {
		span {
			display:inline-block; width:60px; line-height:25px; text-align:center; border:1px solid #eee;
			cursor:pointer; user-select:none;
			&+span {border-left:0px;}
		}
		.color1{
			background:$color1; color:#fff;
		}
		.color2{
			background:$color2; color:#fff;
		}
		.color3{
			background:$color3; color:#fff;
		}
		.color4{
			background:$color4; color:#fff;
		}
		.color5{
			background:$color5; color:#fff;
		}
	}
	.c1 {color:$color6;}
</style>
