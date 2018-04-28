<template>
    <div>
        <!--<span v-authority="'训练模型'" class="btn test-btn pointer" @click="test">训练</span>-->
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
            test(){
                var v = this;
                v.$api.ajax("/deploy",'get')
                .then(function(){
                    v.$alert('训练成功！','提示');
                })
            }
        },
        components:{
            subNav,
        }
    }
</script>
<style>
    .test-btn {color:#fff; background:#2CB8EB;  border-radius:5px; border:1px solid #fff;}
    
</style>
