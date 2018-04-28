<template>
    <div class="quality_setting" @click.prevent>
        <h1 class="page_title">质检设置</h1>
        <div class="list"  :class="!isEdit?'no-edit':''">
            <Button type="ghost" v-show="!isEdit" @click="isEdit=true" class="to-edit">修改质检项</Button>
            <div class="addtag" @click="add" v-show="isEdit">
                <i class="fa fa-plus"></i> 添加质检类
            </div>
            <el-collapse v-model="AUX.show_index" on-change="showIndex" v-show="setting.length>0">
                <el-collapse-item v-for="(t1,i) in setting" :name="i" :key="setting.length-i-1" :class="{noChild:!t1.child||t1.child.length==0}">
                    <div slot="title" class="tag1" >
                        <div class="input-wrap">
                            <span class="tag-name" v-show="!(t1.isFocus||t1.name=='')" @click.stop="toEdit($event,t1)">{{t1.name}}</span>
                            <input v-show="t1.isFocus||t1.name==''" v-model="t1.name" class="ivu-input ivu-input-small" placeholder="请输入质检类名" @blur="blur($event, t1, setting)" @keydown.13="blur($event, t1, setting)" /> 
                        </div>
                        <span class="control visibled pull-right delete" @click.stop="remove(i)" v-show="isEdit">删除</span>
                        <span class="control visibled pull-right add" @click.stop="addChild($event, t1, i)" v-if="t1.name" v-show="isEdit">添加子分类</span>
                    </div>
                    <ul vslot="content">
                        <li v-for="(t2,j) in t1.child" @click.prevent>
                            <div class="input-wrap" :key="j">
                                <span v-show="!(t2.isFocus||t2.name=='')" @click.stop="toEdit($event,t2)">{{t2.name}}</span>
                                <input v-model="t2.name" class="ivu-input ivu-input-small" placeholder="请输入名称" v-show="t2.isFocus||t2.name==''" v-focus.bind="t2.isFocus" @blur="blur($event, t2, t1.child)" @keydown.13="blur($event, t2, t1.child)" @click.stop />
                            </div>
                            <div class="slider-wrap">
                                <el-slider v-model="t2.max" show-input @change="reCount" v-show="isEdit"></el-slider>
                                <span v-show="!isEdit">{{t2.max}}</span>
                            </div>
<!--                             <span class="text simulate_input" :class="{editing:t2.name!==t2.copy||t2.id==''}" :contenteditable="t2.edit" v-focus="AUX.focus_index[0]==i&&AUX.focus_index[1]==j" @click="focus($event,i,j)" @input="input($event,i,j)"  @keydown="keydown($event,i,j)" @blur="blur($event,i,j)" @paste="pasteHandler" placeholder="请输入分类" v-text="t2.show"></span>
                            <span class="control" :class="{visibled:t2.name!==t2.copy||t2.name===''||t2.edit}" @click.stop="update(i,j)">确定</span>
                            <span class="control" :class="{visibled:t2.name!==t2.copy||t2.name===''||t2.edit}" @click.stop="cancel(i,j)">取消</span> -->
                            <span class="control visibled pull-right" @click="removeChild(t1, j)" v-show="isEdit">删除</span>
                        </li>
                    </ul>
                </el-collapse-item>
            </el-collapse>
            <p class="show-total"　v-show="isEdit">
                <span>已分配: <span>{{total}}</span></span>
                <span>剩余未分配: <span>{{100-total}}</span></span>
            </p>
            <footer class="over-setting"　v-show="isEdit">
                <Button type="ghost" @click="reSet">取消</Button>
                <Button type="info" @click="saveSetting">完成</Button>
            </footer>
        </div>
    </div>
</template>

<script>
    import upload_mixin from '../module/upload_mixin.js'
    export default {
        mixins:[upload_mixin],
        data(){
            return {
                tags:[],
                setting: {},
                originSetting: {},
                total: 0,
                isEdit: false,
                AUX:{
                    show_index:[],    //显示二极分类
                    focus_index:[-1,-1],    //聚焦的分类
                }
            }
        },
        created(){
            this.getTags();
            this.getSetting();
        },
        computed:{
            reverTags(){
                return this.$api.deepCopy(this.tags).reverse();
            }
        },
        methods:{
            getTags(){
                let v = this;
                v.$api.ajax(v.$uri.workold.tags,'get')
                .then(data=>{
                    data.forEach(val=>{
                        val.edit = false;
                        val.dirty = false;  //脏数据（修改失败触发）
                        val.copy = val.name;
                        val.show = val.name;
                        if(val.child){
                            val.child.forEach(val2=>{
                                val2.edit = false;
                                val2.dirty = false;
                                val2.copy = val2.name;
                                val2.show = val2.name;
                            })
                        }
                    })
                    v.tags = data;
                })
            },
            reCount(){
                let _total = 0;
                this.setting.forEach((val) => {
                    val.child.forEach((val2) => {
                        _total += val2.max || 0;
                    })
                })
                this.total = _total;
            },
            getSetting(){
                this.$api.ajax(this.$uri.qualityTest.setting, 'get').then( data => {
                    let _total = 0
                    data.forEach((val) => {
                        val.isFocus = false
                        val.child.forEach((val2) => {
                            val2.isFocus = false
                            _total += val2.max || 0
                        })
                    })
                    this.originSetting = this.$api.deepCopy(data);
                    this.setting = data;
                    this.total = _total;
                })
            },
            reSet(){
                this.setting = this.$api.deepCopy(this.originSetting);
                this.isEdit=false;
            },
            saveSetting(){
            	//判断名字不能为空，且打开为空
            	let err_index='';
            	let has_empty = this.setting.some((val,i)=>{
            		if(val.name.trim()===''){
            			err_index = i;
            			return true;
            		}else{
            			return val.child.some(val2=>{
            				if(val2.name.trim()===''){
            					err_index = i;
            					return true;
            				}
            			})
            		}
            	});
            	if(has_empty){
            		this.$message({
            			message:'质检项名字不能为空！',
            			type:"warning"
            		});
            		if(this.AUX.show_index.indexOf(err_index)==-1) this.AUX.show_index.push(err_index);
            		return false;
            	}
                this.reCount();
                if(this.total !== 100){
                    return this.uploadError_mixin("分配总分值必须为100分");
                }
                let data = this.$api.deepCopy(this.setting);
                for(let i in data){
                    let item1 = data[i].child;
                    delete data[i].isFocus;
                    for(let j in item1){
                        delete item1[j].isFocus;
                    }
                }
                this.$api.ajax(this.$uri.qualityTest.setting, 'post', {"setting": data}).then(data => {
                    this.$message({message: "修改配置成功", type: "success"});
                    this.originSetting = this.$api.deepCopy(this.setting) // 修改成功后要更新 源数据 originSetting
                    this.isEdit = false;
                });
            },
            add(){
                this.setting.unshift({name: "", isFocus: true, child: []});
                setTimeout(()=>{
                    let input = document.querySelector(".quality_content input");
                    console.log("input", input)
                    input.focus();
                },200)
            },
            addChild(e, t1, index){
                console.log(t1.child)
                if(t1.child&&t1.child[0]&&t1.child[0].name==""&&t1.child[0].max==0&&t1.child[0].isFocus) return;
                t1.child.push({name: "", max: 0, isFocus: true})
                // let panel_name = this.setting.length-index-1+"";
                console.log(this.AUX.show_index, this.setting)
                if(this.AUX.show_index.indexOf(index)<0){
                    this.AUX.show_index.push(index); 
                }
               /* setTimeout(()=>{
                    let parent = e.target.parentElement.parentElement.nextElementSibling;
                    let input = parent.querySelector("input")
                    console.log("input", e)
                    input.focus();
                },200)*/
            },
            removeChild(t1, j){
                t1.child.splice(j, 1);
                this.reCount();
            },
            remove(index){
                let v = this;
                if(v.setting[index].child.length>0){
                    v.$confirm("该质检类存在子项目,确定要删除吗?", '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        v.setting.splice(index, 1);
                        // let sid = this.AUX.show_index.indexOf(index);
                        console.log("123", index, this.AUX.show_index);
                        this.AUX.show_index.splice(index, 1);

                        this.reCount();
                    })
                }else{
                    v.setting.splice(index, 1);
                    this.AUX.show_index.splice(index, 1);
                }
            },
            // changeTag(i,j=undefined){
            //     let v = this;
            //     i=v.tags.length-i-1;
                
            // },
            // focus(e,i,j){
            //     let v = this;
            //     i=v.tags.length-i-1;
            //     let tag = v.tags[i];
            //     if(j!==undefined) tag = tag.child[j];  
            //     tag.edit = true;
            //     setTimeout(()=>{
            //         e.target.focus();
            //     },200)
            // },
            // blur(e,i,j){        
            //     let v = this;
            //     i=v.tags.length-i-1;
            //     let tag = v.tags[i];
            //     if(j!==undefined) tag = tag.child[j];  
            //     tag.name = tag.name==''?tag.code:tag.name;
            //     tag.show = tag.name;
            //     setTimeout(()=>{
            //         tag.edit = false;
            //     },200)
            // },
            blur(e, t1, parent){
                // if(t1.name===""){
                //     // this.uploadError_mixin("内容不能为空");
                //     // e.target.focus();
                //     console.log("12321312", t1, parent)
                //     parent.shift();
                // }
                // else{ t1.isFocus = false; }
                t1.isFocus = false;
                e.preventDefault();
            },
            toEdit(e, t1){
                if (!this.isEdit) { // 未修改时才不出现input
                    return
                }
                console.log(e)
                t1.isFocus = true;
                /*let input = e.target.nextElementSibling.querySelector('input');
                setTimeout(()=>{
                    input.focus();
                },200)*/
            },
            // keydown(e,i,j){  
            //     let v = this;
            //     let i2=v.tags.length-i-1;
            //     let tag = v.tags[i2];
            //     if(j!==undefined) tag = tag.child[j];   
            //     if(e.keyCode==13){
            //         v.update(i,j);
            //         e.preventDefault();
            //     }
            // },
            input(e,i,j){
                let v = this;
                let i2=v.tags.length-i-1;
                let tag = v.tags[i2];
                if(j!==undefined) tag = tag.child[j]; 
                tag.name = e.target.innerText;
            },
            // update(i,j=undefined){
            //     let v = this;
            //     i=v.tags.length-i-1;
            //     let tag = v.tags[i];
            //     if(j!==undefined) tag = tag.child[j];  
            //     let data = {
            //         name:tag.name,
            //         pid:j!==undefined?v.tags[i].id:0
            //     }
            //     if(tag.name===''){
            //         v.$message({
            //             message:'分类名不能为空！',
            //             type:"warning"
            //         })
            //         return ;
            //     }
            //     if(v.判断重复(i,j)){
            //         v.$message({
            //             message:'此分类名已存在！',
            //             type:"warning"
            //         })
            //         return ;
            //     }
            //     if(tag.id){
            //         v.$api.ajax(v.$uri.workold.tags+'/'+tag.id,'put',data)
            //         .then(data=>{
            //             tag.copy = tag.name;   
            //             tag.show = tag.name;
            //             tag.c2 = tag.name;
            //             tag.dirty  = false;
            //             tag.edit = false;
            //             v.$message({
            //                 message:'修改成功',
            //                 type:"success"
            //             })
            //         }).catch(data=>{
            //             tag.edit = true;
            //             tag.dirty  = true;
            //             v.聚焦(i,j);
            //         })
            //     }else{
            //         v.$api.ajax(v.$uri.workold.tags,'post',data)
            //         .then(data=>{
            //             tag.id = data;
            //             tag.copy = tag.name;
            //             tag.show = tag.name;
            //             tag.dirty  = false;
            //             tag.edit = false;
            //             v.$message({
            //                 message:'添加成功',
            //                 type:"success"
            //             })
            //         }).catch(data=>{
            //             tag.edit = true;
            //             tag.dirty  = true;
            //             v.聚焦(i,j);
            //         })
            //     }
            // },
            showIndex(arr){
                let v = this;
                v.AUX.show_index = arr;
            },
            //粘贴限制
            // pasteHandler(e){
            //     let v= this;
            //     let _this = v.$refs.write;
            //     e.preventDefault();
            //     var text = null;
            //     if(window.clipboardData && clipboardData.setData) {
            //         // IE
            //         text = window.clipboardData.getData('text');
            //     } else {
            //         text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
            //     }
            //     if (document.body.createTextRange) {    
            //         if (document.selection) {
            //             textRange = document.selection.createRange();
            //         } else if (window.getSelection) {
            //             sel = window.getSelection();
            //             var range = sel.getRangeAt(0);
                        
            //             // 创建临时元素，使得TextRange可以移动到正确的位置
            //             var tempEl = document.createElement("span");
            //             tempEl.innerHTML = "&#FEFF;";
            //             range.deleteContents();
            //             range.insertNode(tempEl);
            //             textRange = document.body.createTextRange();
            //             textRange.moveToElementText(tempEl);
            //             tempEl.parentNode.removeChild(tempEl);
            //         }
            //         textRange.text = text;
            //         textRange.collapse(false);
            //         textRange.select();
            //     } else {
            //         // Chrome之类浏览器
            //         document.execCommand("insertText", false, text);
            //     }
            // },
        },
        components:{
            
        },
        watch:{
        },
        directives: {
        }
    }
</script>

<style lang="scss">
    $borderColor:#e7eff3;
    $fontColor:#8b99a7;
    $fontColor2:#343f4b;
    $widthInput: 140px;
    $widthDelete: 60px;
    .no-edit{
        .tag1{
            .tag-name{
                pointer-events: none;
            }
        }
    }
    .quality_setting{
        font-size:14px;
        color:$fontColor;
        .el-collapse-item.noChild{
			.el-collapse-item__header__arrow {opacity:0;}
			.el-collapse-item__wrap {border:none;}
		}
		.el-collapse-item__content {padding:0;}
        .el-collapse-item__content {
            font-size:14px;
            color:$fontColor;
            li{
                position: relative;
            }
            .control{
                position: absolute;
                right: 20px;
                top: 0;
            }
            .input-wrap{
                display: inline-block;
                width: 125px;
                width: widthInput;
                position: absolute;
                top: 0;
                left: 40px;
            }
        }
        .to-edit{
            margin: 10px 0 22px;
        }
        .over-setting{
            margin-top: 20px;
            text-align: right;
        }
        .show-total{
            text-align: right;
            margin-top: 20px;
            &>span:nth-child(1){
                margin-right: 10px;
            }
            span span{
                color: #000;
            }
        }
        .slider-wrap{
            padding: 0 $widthDelete 0 $widthInput;
            height: 36px;
            .el-input-number--small{
                width: 110px;
            }
            .el-slider__button-wrapper{
                top: -18px;
            }
            >span{
                position: absolute;
                top: 0;
                right: 154px;
            }
        }
        .addtag {
            border:1px dashed $borderColor;
            line-height:45px;
            text-align:center;
            cursor:pointer;
            margin: 20px 0 10px 0;
            border-radius:3px;
        }
        .tag1 {
            font-size:14px;
            color:$fontColor2;
            display:inline-block;
            width:calc(100% - 24px);
            position: relative;
            .input-wrap{
                width: 100%;
                padding-right: 140px;
            }
            .control{
                position: absolute;
                right: 10px;
                top: 0;
            }
            .add{
                right: 50px;
            }
        }
        .control {
            padding-left:10px;
            font-size:14px;
            color:$fontColor;
            display:none;
            user-select:none;
            cursor: pointer;
            &:hover {color:darken($fontColor,20%);}
            &.visibled {display:inline;}
        }
        ul {
            
            li{
                padding-left:40px;
                padding-right:10px;
                line-height:35px;
                &+li {border-top: 1px solid $borderColor; }
            }
        }
        .noChild{
            .ivu-collapse-header{
                &>i {opacity: 0;}
            }
        }
        
        .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header {
            padding-left:10px ;
        }
        .ivu-collapse-item:last-child>.ivu-collapse-content {
            padding-left:0px ;
            
        }
        .ivu-collapse-content,.ivu-collapse-content>.ivu-collapse-content-box {padding:0 !important;}
    }
</style>
