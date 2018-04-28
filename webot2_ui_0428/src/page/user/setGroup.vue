<template>
    <div class="user-group">
    	<h1 class="page_title">用户分组</h1>
    	<div class="search_wrap clearfix">
    		<button class="my-btn my-btn-info-o pull-right" @click="addGroup">添加分组</button>
    	</div>

        <div class="user-group_main" >
        	<div class="user-group_item"  v-for="(group,i) in groups">
        		<div class="user-group_item-head">
        			<b class="user-group_item-header" :title="group.name">{{group.name}}</b>&nbsp;
              <b >({{group.user_num}})</b>
        			<a class="action pointer unselect pull-right marg_l_10"  @click="open(group.id)">删除</a>
        			<a class="action pointer unselect pull-right"  @click="editGroup(group)">重命名</a>
        		</div>
        		<bar wrapper="user-group_item-content ">
        			<span v-for="(user,j) in group.users" :title="user.name">{{user.name}}</span>
        		</bar>
	        	<div class="user-group_item-foot text-center">
	        		<a class="action pointer unselect"  @click="editGroupUsers(group)">编辑分组</a>
	        	</div>
        	</div>
        </div>

        <el-dialog title="用户分组" v-model="dialogTableVisible">
            <div class="clearfix">
                <el-transfer
                    filterable
                    filter-placeholder="请输入用户名称"
                    v-model="value2"
                    :data="transferUsers">
                </el-transfer>
                <el-button type="primary" @click="addUser2Gourp">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import bar from '@/page/module/自定义滚动条'
    export default {
        props:{},
        data(){
            return {
                groups:{
                    "id1":{
                        "name": "test",
                        "users":[
                            {
                                "id": 1,
                                "name": "",
                                "created": "",
                                "updated": ""
                            }
                        ],
                        "user_num": 0
                    }
                },
                groupUsers:[],
                dialogTableVisible: false,
                users: [],
                transferUsers: [],
                value2: [],
                nowGroupId: -1
            };
        },
        created(){
            this.getAll();
            this.users = this.getUsers();
        },
        methods: {
            editGroupUsers(group){
                this.dialogTableVisible = true;
                this.nowGroupId = group.id;
                this.getGroupUsers(group.id);
            },
            editGroup(group){
                this.$prompt('请输入组分名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:/.+/,
                    inputErrorMessage:'请输入分组名',
                    inputValue: group.name
                }).then(({ value }) => {
                    this.myAjax('/groups/'+group.id,'put',{"name": value}, "修改成功")
                }).catch(() => {});
            },
            addGroup(){
                this.$prompt('请输入分组名', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern:/.+/,
                    inputErrorMessage:'请输入分组名',
                }).then(({ value }) => {
                	if(value.trim()!=='')
                    	this.myAjax('/groups','post',{"name": value.trim()}, "新增成功")
                }).catch(() => {});
            },
            deleteGroup(group_id){
                this.myAjax('/groups/'+group_id, 'delete', {}, "删除成功");
            },
            myAjax(url, method, data, msg){
                this.$api.ajax(
                        url,
                        method,
                        data
                    ).then(data=>{
                        this.$message({
                            type: 'success',
                            message: msg
                        })
                        this.getAll()
                    })
            },
            addUser2Gourp(){
                var idxs = this.value2;
                var groupId = this.nowGroupId;
                var userIds = []
                console.info(this.transferUsers)
                console.info(idxs)
                for(var i in idxs){
                    userIds.push(parseInt(this.transferUsers[idxs[i]].value))
                }
                console.info(userIds)
                this.$api.ajax('/group/users', 'post',{
                    "group_id": groupId,
                    "user_ids": userIds
                }).then(data => {
                    this.$message({
                        type: 'success',
                        message: '添加成功!'
                    })
                    this.getAll();
                    this.dialogTableVisible = false;
                })
            },
            getAll(){
                this.$api.ajax('/group/users', 'get')
                .then(data=>{
                    this.groups = this.datasGroupByGroupId(data);
                })
            },
            genTransferUsers(_users){
                var _data=[];
                console.info(_users)
                _users.forEach((user, index)=>{
                    _data.push({
                        label: user.name,
                        key: index,
                        pinyin: _users[index].name,
                        value: user.id
                    })
                })
                console.info(_data);
                return _data;
            },

            // getGroups(){
            //     this.$api.ajax('/groups', 'get')
            //     .then(data=>{
            //         return data;
            //     })
            // },
            getUsers(){
                this.$api.ajax('/users', 'get')
                .then(data=>{
                    var _list = [];
                    var _users = data.list
                    for(var i in _users){
                        _list.push({"id": _users[i].id,"name": _users[i].username});
                    }
                    this.transferUsers = this.genTransferUsers(_list);
                    return _list
                })
            },
            // 获取组的用户
            getGroupUsers(groupId){
                this.$api.ajax(
                    '/group/users',
                    'get',
                    {"group_id": groupId}
                ).then(data=>{
                    var values = [];
                    var tu = this.transferUsers;
                    for(var j in data){
                        for(var i in tu){
                            if(parseInt(data[j].user_id) == parseInt(tu[i].value)){
                                values.push(parseInt(i));
                                continue;
                            }
                        }
                    }
                    this.value2 = values;
                    return data;
                })
            },
            open(group_id) {
                this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteGroup(group_id)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                    });
                });
            },

            datasGroupByGroupId(datas){

              var resp = {}
                // 合并相同的group_id
                datas.forEach((data, index) => {
                    var group_id = data.group_id;
                    var _user = {
                        "id": data.user_id,
                        "name": data.user_name,
                        "created": data.created,
                        "updated": data.updated
                    };
                    if(resp[group_id]!=null){
                        resp[group_id].users.push(_user);
                        resp[group_id].user_num += 1;
                    }
                    else{
                      // resp[group_id] = {
                      //   "name": data.group_name,
                      //   "users": [_user],
                      //   "user_num": 1
                      // };

                      if(_user.id==null){
                        resp[group_id] = {
                          "name": data.group_name,
                          "users": [_user],
                          "user_num": 0
                        };
                      }
                      else {
                        resp[group_id] = {
                          "name": data.group_name,
                          "users": [_user],
                          "user_num": 1
                        };
                      }

                    }
                });
                // 转换成数组
                var _list = []
                for(var k in resp){
                    resp[k].id = k
                    _list.push(resp[k])
                }
                return _list;
            }

        },
        components:{
        	bar,
        }
    }
</script>
<style lang="scss" scoped="">
	$item-head-bg: #E7EFF2;
   .user-group{
   		.user-group_main{

   		}
   		.user-group_item{
   			display: inline-block;
   			width:350px;
   			overflow:hidden;
   			margin: 0 20px 20px 0px;
   			border: 1px solid $item-head-bg;
   			border-radius:8px;
   			.user-group_item-head {
   				line-height: 35px;
   				padding: 0 10px;
   				background: $item-head-bg;
   				.user-group_item-header {
   					float: left;
   					display: inline-block;
   					max-width:220px;
   					overflow: hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;
   				}
   			}
   			.user-group_item-content {
   				height:150px;
   				width:100%;
   				padding:5px 20px;
   				span {
   					color: #7C9199;
   					font-weight: 540;
   					display: inline-block;
   					width:55px;
   					overflow: hidden;word-break:keep-all;white-space:nowrap;text-overflow:ellipsis;
   					margin:5px 10px;
   				}
   			}
   			.user-group_item-foot{
   				line-height:35px;
   				background: rgba($item-head-bg, 0.4);
   				border-top: 1px solid $item-head-bg;
   			}
   		}
   		.action {
   			color: #9DA9B6;
   			&:hover {color:#0082E6;}
   		}
   }
</style>
