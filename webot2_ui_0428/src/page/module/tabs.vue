<template>
	<div class="_my_tabs">
		<ul v-if="tabs.length>0" class="_my_tabs-title" :class="'tabs-'+tabs.length+' active'+currentValue">
			<li class="_my_tabs-tab" v-for="(t,i) in tabs" :class="{active:i==currentValue}" @click="currentValue = i" v-html="t"></li>
		</ul>
		<div :class="tabs.length>0 ? '_my_tabs-items' : '_my_tabs-items-100'" >
			<transition name="fades" mode="out-in">
				<div v-show="currentValue==0" class="_my_tabs-item">
					<slot name="tab0"></slot>
				</div>
			</transition>
			<transition name="fades" mode="out-in">
				<div v-show="currentValue==1" class="_my_tabs-item">
					<slot name="tab1"></slot>
				</div>
			</transition>
			<transition v-if="body_length>=3" name="fades" mode="out-in">
				<div v-show="currentValue==2" class="_my_tabs-item">
					<slot name="tab2"></slot>
				</div>
			</transition>
			<transition v-if="body_length>=4" name="fades" mode="out-in">
				<div v-show="currentValue==3" class="_my_tabs-item">
					<slot name="tab3"></slot>
				</div>
			</transition>
			<transition v-if="body_length>=5" name="fades" mode="out-in">
				<div v-show="currentValue==4" class="_my_tabs-item">
					<slot name="tab4"></slot>
				</div>
			</transition>
			<transition v-if="body_length>=6" name="fades" mode="out-in">
				<div v-show="currentValue==5" class="_my_tabs-item">
					<slot name="tab5"></slot>
				</div>
			</transition>
			<transition v-if="body_length>=7" name="fades" mode="out-in">
				<div v-show="currentValue==6" class="_my_tabs-item">
					<slot name="tab6"></slot>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			tabs:{
				type:Array,
				default:()=>[],
			},
			value:{
				type:Number,
				default:null,
			},
			bodySize:{               //显示主体个数
				required:false,
			}
		},
		data(){
			return {
				index:0,
			}
		},
		created(){
			
		},
		computed:{
			currentValue: {  
		        get:function() {  
		          	return this.value === null ? this.index :this.value; 
		        },  
		        set:function(val) {  
		        	if(this.value === null){
		        		this.index = val;
		        	}else{
		        		this.$emit('input', val); 
		        	}
		        }  
		    },
		    body_length(){
		    	return this.bodySize || this.tabs.length;
		    }
		},
		methods:{
			
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	$tabsMax:10;
	$tabMax:10;
	$tabActiveColor:#666;
	$tabStaticeColor:#b8c9d3;
	$tabsHeight : 43px;
._my_tabs{
	width:100%;
	height:100%;
	
	._my_tabs-title{
		font-size:0;
	    height:$tabsHeight;
	    line-height:$tabsHeight;
	    position:relative;
	    border-bottom:1px solid #eee;
	    &:after{
	        position:absolute;
	        content:'';
	        bottom:0;
	        left:0;
	        height:1px;
	        background:#000;
	        transition:all .2s ease-in-out;
	    }
	    @for $j from 1 through $tabsMax{
	        &.tabs-#{$j} {
	            ._my_tabs-tab,&:after{
	                width:100% / $j;
	            }
	            @for $i from 0 through $tabMax{
	                &.active#{$i} {
	                    &:after {left:100%/$j * $i;}
	                    ._my_tabs-tab:nth-child(#{$i+1}) {color:$tabActiveColor;}
	                }
	            }
	        }
	    }
		._my_tabs-tab{
			display:inline-block;
	        vertical-align:top;
	        color:$tabStaticeColor;
	        font-size:14px;
	        text-align:center;
	      
	        cursor:pointer;
	        user-select:none;
		}
	}
	._my_tabs-items{
		position:relative;
		height:calc(100% - #{$tabsHeight});
		._my_tabs-item{
			position:absolute;
			left:0; top:0;
			width:100%;
			height:100%;
		}
	}
	._my_tabs-items-100{
		height:100%;
		position:relative;
		._my_tabs-item{
			position:absolute;
			left:0; top:0;
			width:100%;
			height:100%;
		}
	}
	.fades-enter-active {
	    transition: all .3s ease .4s;
	}
	.fades-leave-active {
	}
	.fades-enter, .fades-leave-to {
	    opacity: 0;
	}
}
</style>