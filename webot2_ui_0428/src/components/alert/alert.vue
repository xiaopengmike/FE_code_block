<template>
	<div class="alert_wrap">
		<div :class="type">
			<div>{{title}}</div>
			<p>{{content}}</p>
		</div>
		<span class="glyphicon glyphicon-remove closedd" @click="show=false"></span>
	</div>
</template>

<script>
	export default {
		porps:['type','title','content','show'],
		methods:{
			
		}
	}
</script>

<style>
	.alert_wrap {position:fixed; top:100px; left:0; width:100%; text-align:center;}
	.alert_wrap > div {display:inline-block;}
	.alert_wrap > div div {border-bottom:1px solid #ccc;}
	.success {background:#dff0d8;    color: #3c763d;}
	.danger {    color: #a94442;background-color: #f2dede;}
	.info {    color: #31708f;
		    background-color: #d9edf7;
		    border-color: #bce8f1;
		}
	.warning {
		color: #8a6d3b;
	    background-color: #fcf8e3;
	    border-color: #faebcc;
	}
	.closedd {position:absolute; right:0; top:0;}
</style>