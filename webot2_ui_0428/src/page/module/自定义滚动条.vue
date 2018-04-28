<template>
	<div class="_custom-scrollbar_" :class="wrapper" @wheel="dowheel" ref="wrap" role="boxheight">
		<div class="_custom-scrollbar_content" :style="!ismobile||ismin?'transform:translateY('+scrollTop.top+'px)':''" ref="content" role="txtheight">
			<div class="slot">
				<slot></slot>
			</div>
		</div>
		<div class="_custom-scrollbar_bar_box" :class="barBox" :style="bar_box_style">
			<div @mousedown="down" class="_custom-scrollbar_bar" :class="bar" :style="bar_style"></div>
		</div>
	</div>
</template>

<script>
	export default{
		props:{
			wrapper:{
				required:true,
				type:String,
			},
			bar:{
				required:false,
				type:String,
			},
			barBox:{
				required:false,
				type:String,
			},
			scrollTop:{
				type:Object,
				default:function(){ return {top:0}}
			}
		},
		data(){
			return {
				ismobile:(window.screen.width<981),
				ismin:(window.screen.width<380),
				bar_box_style:{
					display:'none',
				},
				bar_style:{
					height:'0',
					transform:"translateY(0)",
				},
				move_info:{
					down:false,
					top:0,
				},
				resizeTime:'',
			}
		},
		created(){
			let v = this;
			window.addEventListener('resize',v.resize,false);
		},
		monuted(){
			let v = this;
			this.$nextTick( function () {
			    this.initBar();
			});
		},
		computed:{
			
		},
		methods:{
			resize(){                                //高度变化时，处理滚动条
				let v = this;
				if(v.resizeTime){
					clearTimeout(v.resizeTime)
				}
				v.resizeTime = setTimeout(()=>{
					let c_h = v.$refs.content.offsetHeight;
					let w_h = v.$refs.wrap.offsetHeight;
					let height = w_h-c_h;
					if(v.scrollTop.top!=height && height<0){
						v.scrollTop.top = height;
					}
				},300)
				
			},
			dowheel(e){                       //滚轮事件处理
				let c_h = this.$refs.content.offsetHeight;
				let w_h = this.$refs.wrap.offsetHeight;
				let height = w_h-c_h;
				let cto = 0,bto=0;
				if(e.deltaY>0){
					if(height<this.scrollTop.top){
						cto = this.scrollTop.top-120 > height ? this.scrollTop.top-120 : height;
						this.scrollTop.top = cto;
						e.stopPropagation();
						e.preventDefault();
					}
				}else{
					if(this.scrollTop.top<0){
						cto = this.scrollTop.top-1+121<0?this.scrollTop.top-1+121:0;
						this.scrollTop.top = cto;
						e.stopPropagation();
						e.preventDefault();
					}
				}
			},
			initBar(){                        //初始化条
				let c_h = this.$refs.content.offsetHeight;
				let w_h = this.$refs.wrap.offsetHeight;
				this.bar_style.height = w_h/c_h * w_h +'px';
				if(c_h<=w_h){
					this.bar_box_style.display='none';
				}else{
					this.bar_box_style.display='block';
				}
			},
			down(e){                                          //鼠标按住条时
				this.move_info.down=true;
				this.move_info.top = e.pageY;
				let v= this;
				document.addEventListener('mousemove',v.move,false);
				document.addEventListener('mouseup',v.up,false);
			},
			move(e){                                        //鼠标移动时
				if(this.move_info.down) {
					let bar_top = e.pageY-this.move_info.top;
					this.move_info.top = e.pageY;
					let c_h = this.$refs.content.offsetHeight;
					let w_h = this.$refs.wrap.offsetHeight;
					this.scrollTop.top -= bar_top*c_h/w_h;
					if(this.scrollTop.top>0) this.scrollTop.top=0;
					if(this.scrollTop.top< 0-c_h) this.scrollTop.top=0-c_h;
					e.preventDefault();
				}
			},
			up(){                                              //鼠标松开条时
				this.move_info.down=false;
				let v= this;
				document.removeEventListener('mousemove',v.move,false);
				document.removeEventListener('mouseup',v.up,false);
			},
			滚动到顶(){     
				this.$emit('arrive-top','top');
			},
			滚动到底(){    
				this.$emit('arrive-bottom','bottom');
			},
		},
		updated(){
			this.initBar();
		},
		components:{
			
		},
		watch:{
			'scrollTop.top':function(n,o){
				let c_h = this.$refs.content.offsetHeight;
				let w_h = this.$refs.wrap.offsetHeight;                   
				if(n<w_h-c_h)
					this.scrollTop.top = w_h-c_h>0?0:w_h-c_h;
				let bto =0- w_h/c_h*n;  
				this.bar_style.transform = 'translateY('+bto+'px)';
				if(this.ismobile&&!this.ismin){
					this.$refs.wrap.scrollTop = 0-this.scrollTop.top;
				}
				if(n==0){
					this.滚动到顶();
				}
				if(n==w_h-c_h){
					this.滚动到底();
				}
			}
			
		},
		directives:{
			
		},
		filters:{
			
		},
		beforeDestroy(){
			let v= this;
			window.removeEventListener('resize',v.resize,false);
		}
	}
</script>

<style lang="scss" scoped="">
	._custom-scrollbar_ {
		overflow:hidden;  
		position:relative;
		._custom-scrollbar_content {
			transition:transform ease-in-out .2s;
			
		}
		._custom-scrollbar_bar_box {
			position:absolute; top:0; right:0;
			width:8px; height:100%;
			background:rgba(0,0,0,0.1);
			border-radius:16px;
			overflow:hidden;
			._custom-scrollbar_bar {
				background:rgba(0,0,0,0.5);
				opacity:0.5;
				width:8px; min-height:35px;
				border-radius:16px;
				cursor:pointer;
				
				&:hover {
					opacity:0.8;
				}
				@media screen and (max-width :980px){
					width:8px;
				}
				@media screen and (max-width :380px){
					width:8px;
				}
			}
			@media screen and (max-width :980px){
				width:8px;
			}
			@media screen and (max-width :380px){
				width:8px;
			}
		}
		
	}
</style>