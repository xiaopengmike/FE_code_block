<template>
  <div class="drag">
    <transition-group name="list" tag="ul">
      <li class="txt" v-for="(l,i) in list" :key="l.t" @dragstart="drag(i)" draggable="true" @drop="drop(i)"  @dragover="e=>{e.preventDefault();}">{{l.t}}</li>
    </transition-group>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        list:[{t:'11拖我呀',s:true},{t:'22托我吧',s:true},{t:'33拖啊拖',s:true},{t:'44呵呵哒',s:true}],
        list_copy:[],
        dragging:{
          txt:'',
          index:-1
        },
      }
    },
    created(){
      this.list_copy = this.$api.deepCopy(this.list);
    },
    methods:{
      drag(i){
        let v = this;
        v.dragging.index = i;
        v.dragging.txt= v.list[i];
        
      },
      drop(i){
        let v= this;
        v.list.splice(v.dragging.index,1);v.list.splice(i,0,v.dragging.txt);
      }
    }
  }
</script>

<style lang="scss">
  .drag {
    ul {
      list-style-type:none;
      li {width:100px; height:30px; line-height:30px; margin-bottom:5px;;
        &.txt{background:#5DD8FF; color:#fff; }
        &.gap {border:1px solid #eee;}
      }
    }
  }
  
  .list-move {
      transition: transform 0.1s;
  }
</style>