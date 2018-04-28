<template>
	<el-date-picker class="_my-date-picker" v-model="currentValue" :picker-options="options" :clearable="clearable" :size="size" :type="type" :format="format" :placeholder="placeholder" @change="change"> </el-date-picker>
</template>
<script>
	import options_list from './通用配置'
	export default {
		props:{
			value:{
				required:true,
				type:Array,
			},
			maxTime:{
				type:Number,
				default:0,
			},
			minTime:{
				type:Number,
				default:0,
			},
			/*
			通用配置列表索引，默认第一个
			#index==0 : 快捷可选今天，最近一周=今天+过去的6天，最近一个月以此类似
			#index==1 : 快捷不可选今天，过去一周=过去的7天，最近一个月以此类似
			*/
			optionIndex:{              
				default:0,
			},
			type:{
				type:String,
				default:'daterange',
			},
			format:{
				type:String,
				default:'yyyy年MM月dd日',
			},
			clearable:{
				type:Boolean,
				default:false,
			},
			size:{
				type:String,
				default:'small',
			},
			defaultOptions:{
				required:false,
				type:Object
			},
			placeholder:{
				type:String,
				default:'',
			},
		},
		data(){
			return {
				pickerOptions: {
					shortcuts: [ ],
			        disabledDate:'',
		        },
			}
		},
		created(){
		},
		computed:{
			currentValue: {  
		        get:function() {  
		          return this.value;
		        },  
		        set:function(val) {  
		          this.$emit('input', val); 
		        }  
		    },
		    options(){
		    	if(this.defaultOptions){
		    		return this.defaultOptions;
		    	}else{
		    		this.pickerOptions.shortcuts = options_list[this.optionIndex];
		    		this.pickerOptions.disabledDate=(time)=>{
						let able = false;
		          		if(this.maxTime){
		          			able = time.getTime() > new Date(this.maxTime).getTime();
		          		}
		          		if(this.minTime){
		          			able = time.getTime() < new Date(this.maxTime).getTime();
		          		}
		          		return able;
		         	}
		    		return this.pickerOptions;
		    	}
		    },
		},
		methods:{
			change(){
				this.$emit('change',this.currentValue);
			}
		}
	}
</script>
<style>
	._my-date-picker.el-date-editor--datetimerange.el-input{
		width:335px;
	}
</style>