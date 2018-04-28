<template>
    <div id="my-select-btn">
        <Button :type="btnType" :size="btnSize" :icon="btnIcon" @click="btnClick(selectValue)">{{selectValue}}</Button>
        <Select v-model="selectValue">
            <Option v-for="value in selects" :value="value" :key="value">{{ value }}</Option>
        </Select>
    </div>
</template>

<script>
    
    export default {
        props:{
            selects:{
                required: true,
                type: Array,
            },
            btnSize:{
                required: false,
                type: String,
            },
            btnType:{
                required:false,
                type:String,
            },
            btnIcon:{
                required: false,
                type:String,
            },
            btnClick:{
                required: true,
                type: Function,
            }
        },
        data(){
            return {
                selectValue: "",
            }
        },
        // function(){
        //  console.log("rich_answer", this.question.rich_answer.length)
        //  if(this.question.rich_answer&&this.question.rich_answer.length>0){
        //      this.questionTabs = "rich_answer";
        //  }else{
        //      this.questionTabs = "normal_answer";
        //  }       
        // },
        created(){
            this.selectValue = this.selects[0];
        },
        methods:{

        },
        computed: {
            // value: function() {
            //     return this.selectValue;
            // },
        },
        components:{
        }
    }
</script>

<style lang="scss">
    $border: 1px solid #dddee1;
    #my-select-btn {
        position: relative;
        padding-right: 20px; 
        width: 100px;
        border: $border;
        border-radius: 4px;
        overflow: hidden;
        display: inline-block;
        .ivu-select-arrow{
            right: 5px;
        }
        .ivu-select {
            position: absolute;
            top: 0;
            left: 0;
        }
        .ivu-select-selection{
            border: none;
        }
        .ivu-btn {
            position: relative;
            z-index: 2;
            border: none;
            border-right: $border;
            border-radius: 0;
            top: 0;
            right: 0;
        }
    }
</style>