<template>
    <div id="showMedia">
        <img :src="url" alt="" v-if="type=='image'" class="total-center">
        <video :src="url" v-else-if="type=='video'" controls="controls" class="total-center">
            您的浏览器不支持 video 标签。
        </video>
        <audio :src="url" v-else-if="type=='audio'" controls="controls" class="total-center">
            您的浏览器不支持 audio 标签。
        </audio>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                type: "",
                url: ""
            }
        },
        created(){
            this.type = this.$route.query.type;
            this.url = this.$route.query.url
        }
        
    }
</script>
<style>
    #wrap {min-width: 0;}
    #showMedia {position: fixed; width: 100%; height: 100%; background: #fff; top: 0; left: 0; z-index: 100;}
    #showMedia img,
    #showMedia video,
    #showMedia audio{
        max-width: 100%;
        max-height: 100%;
    }
    #showMedia .total-center{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
</style>