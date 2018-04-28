<!--运用绝对定位的bottom来使主题滚动（目前主要用于聊天，加载历史时不会跳动）-->

<template>
	<div class="_custom-scrollbar_" :class="wrapper" @wheel="dowheel" ref="boxheight" role="boxheight">
		<div class="_custom-scrollbar_wrap">
			<div class="_custom-scrollbar_content" :style="!ismobile||ismin?('bottom:'+scrollTop.bottom+'px'):''" ref="txtheight" role="txtheight">
				<div class="slot">
					<slot></slot>
				</div>
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
				default:function(){ return {bottom:0,isTop:false}}
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
					bottom:'0px',
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
			resize(){   console.log('resize')
				let v = this;
				if(v.resizeTime){
					clearTimeout(v.resizeTime)
				}
				v.resizeTime = setTimeout(()=>{
                    v.scrollTop.bottom++ // scrollTop 改变即可引起视图变化
                    // 以下算法有bug
					/*let t_height = v.$refs.txtheight.offsetHeight;
					let b_height = v.$refs.boxheight.offsetHeight;
					let height = b_height-t_height;
					if(v.scrollTop.bottom!=height && height<0){
						v.scrollTop.bottom = height;
					}*/
				},300)
				
			},
			dowheel(e){               
				let t_height = this.$refs.txtheight.offsetHeight;
				let b_height = this.$refs.boxheight.offsetHeight;
				let height = b_height-t_height;
				let cto = 0,bto=0;
				if(e.deltaY>0){                                   //往下滚
					if(this.scrollTop.bottom<0){       
						cto = this.scrollTop.bottom-1+121<0?this.scrollTop.bottom-1+121:0;
						this.scrollTop.bottom = cto;
						e.stopPropagation();
						e.preventDefault();
					}
				}else{
					if(height<this.scrollTop.bottom){     
						cto = this.scrollTop.bottom-120 > height-1 ? this.scrollTop.bottom-120 : height-1;
						this.scrollTop.bottom = cto;
						e.stopPropagation();
						e.preventDefault();
					}
				}
			},
			initBar(){
				let {t_height, b_height} = this.getHeight();
				this.bar_style.height = b_height/t_height * b_height +'px';
				if(t_height<=b_height){
					this.bar_box_style.display='none';
				}else{
					this.bar_box_style.display='block';
				}
			},
			down(e){  
				this.move_info.down=true;
				this.move_info.top = e.pageY;
				let v= this;
				document.addEventListener('mousemove',v.move,false);
				document.addEventListener('mouseup',v.up,false);
			},
			move(e){     
				if(this.move_info.top) {
					let bar_top = e.pageY-this.move_info.top;
					this.move_info.top = e.pageY;
					let t_height = this.$refs.txtheight.offsetHeight;
					let b_height = this.$refs.boxheight.offsetHeight;
					this.scrollTop.bottom += bar_top*t_height/b_height;
					if(this.scrollTop.bottom<b_height-t_height) this.scrollTop.bottom=b_height-t_height;
					if(this.scrollTop.bottom>0) this.scrollTop.bottom=0;
					e.preventDefault();
				}
			},
			up(){
				this.move_info.down=false;
				let v= this;
				document.removeEventListener('mousemove',v.move,false);
				document.removeEventListener('mouseup',v.up,false);
			},

            // 获取display: none; 元素高度
            getHeight () {
                let boxDom = this.$refs.boxheight;
                let textDom = this.$refs.txtheight;
                let boxHeight = boxDom.offsetHeight;
                let textHeight = textDom.offsetHeight;

                // 质量质检页面 “全部聊天记录” 默认 display: none; 无法取到高度，导致默认未显示滚动条
                let arr = [
                	'/qualityTest/list',
                	'/workold/detail'
                ]
                if (arr.indexOf(this.$route.path) > -1) {
                    if (boxHeight === 0 || textHeight === 0) {
                        try {
                            let noneDom = boxDom.parentNode.parentNode
                            noneDom.style.display = 'block'
                            boxHeight = this.$refs.boxheight.offsetHeight;
                            textHeight = this.$refs.txtheight.offsetHeight;
                            noneDom.style.display = 'none'
                        } catch (e) {}
                    }
                }

                return {
                    t_height: textHeight,
                    b_height: boxHeight
                }
            }
		},
		updated(){
			this.initBar();
		},
		components:{
			
		},
		watch:{
			'scrollTop.bottom':{
				handler:function(n,o){
					let t_height = this.$refs.txtheight.offsetHeight;
					let b_height = this.$refs.boxheight.offsetHeight;    
					//判断是否到顶
					this.scrollTop.distance_top = b_height-t_height - n;
					if(n<b_height-t_height)
						this.scrollTop.bottom = b_height-t_height>0?0:b_height-t_height;
					let bto =b_height/t_height*n;  
					this.bar_style.bottom = 0-bto+'px';
					if(this.ismobile&&!this.ismin){
						this.$refs.boxheight.scrollTop = 0-this.scrollTop.bottom;
					}
				}
			},
			
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
		._custom-scrollbar_wrap{
			position:relative;
			height:100%;
		}
		._custom-scrollbar_content {
			transition:bottom ease-in-out .2s;
			position:absolute; left:0; bottom:0;
			min-height:100%;
			right:0;
			margin:0 auto;
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
				position:absolute;left:0;
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