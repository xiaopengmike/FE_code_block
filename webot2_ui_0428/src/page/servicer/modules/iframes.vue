<template>
	<div class="_iframe_wrap" ref="iframe_wrap">
		<iframe v-if="url" :src="url" ref="iframe" scrolling="yes" frameborder="0"></iframe>
		<iframe v-else ref="iframe" :class="!show?'opacity0':'opacity1'" scrolling="yes" frameborder="0"></iframe>
	</div>
</template>

<script>
	export default {
		props:['html','url'],
		data(){
			return {
				show:false,
			}
		},
		created(){
			
		},
		mounted(){
			let v = this;
			this.$nextTick(()=>{
				let iframe = this.$refs.iframe.contentWindow || this.$refs.iframe.contentDocument.parentWindow;
				if(!v.url){
					iframe.document.body.innerHTML = this.html || '';
					setTimeout(()=>{	
						v.setHeight();
					},50)
				}else{
					
				}
			})
		},
		methods:{
			setHeight(){   
				let iframe = this.$refs.iframe.contentWindow || this.$refs.iframe.contentDocument.parentWindow;
				let height = iframe.document.documentElement.scrollHeight || iframe.document.body.scrollHeight;
				this.$refs.iframe_wrap.style.height = height+10+"px";
				this.show=true;
			}
		},
		components:{
			
		},
		watch:{
			
		}
	}
</script>

<style lang="scss">
	._iframe_wrap{
		width:100%;
		.opacity0{opacity:0;}
		.opacity1{opacity:1;}
		iframe {
			min-height:50px;
			border-radius:10px;
			max-width:100%;
			height:100%; 
			border:1px solid #328eff;
			body {padding:0; margin:0; }
		}
	}
</style>