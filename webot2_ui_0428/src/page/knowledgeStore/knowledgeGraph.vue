<template>
    <div id="knowledgeGraph">
    	<div class="input-group serach_wrap clearfix">
		    <upload :action="$uri.knowledgeGraph.postfile" :type="'post'" :accept="upload.type" :success="afterUpload" :error="uploadError_mixin" :before-upload="beforeUpload_mixin">
		    	<button class="btns">上传文件</button>
		    </upload>
		</div>
    <div class="wrap">
  		<div id="cy">
        <div id="graph"></div>
        <div id="navigator"></div>
        <div id="panzoom"></div>   
      </div>
    </div>
  </div>
</template>
<script>
    import cytoscape from 'cytoscape'
    import panzoom from 'cytoscape-panzoom'
    import navigator from 'cytoscape-navigator'
    import spread from 'cytoscape-spread'
    import regCose from 'cytoscape-cose-bilkent'
    import dagre from 'cytoscape-dagre'
    import upload from '../module/upload'
    import upload_mixin from '../module/upload_mixin.js'
    panzoom(cytoscape);
    navigator(cytoscape);
    spread(cytoscape);
    regCose(cytoscape);
    dagre(cytoscape)
    export default{
    	mixins:[upload_mixin],
        data(){
            return {
              navigator: null,
              panzoom: null,
            	upload:{
            		type:'|txt',
            	},
              cyStyle: [
                  {
                      selector: 'node',
                      css: {
                          'color': 'white',
                          'font-size': "25px",
                          'content': 'data(text)',
                          'text-valign': 'center',
                          'text-halign': 'center',
                          'padding': '25px',
                          "background-color": "#65b3fc",
                      }
                  },
                  {
                      selector: '$node > node',
                      css: {
                          'padding': '10px',
                          'text-valign': 'top',
                          'text-halign': 'center',
                          'background-color': '#bbb'
                      }
                  },
                    {
                      "selector": ".autorotate",
                      "style": {
                        "font-size": "14px",
                        "color": "black",
                        "text-opacity": 1,
                        "text-valign": "center",
                        "text-halign": "center",
                        "text-border-color": "#65b3fc",
                        "text-border-opacity": "1",
                        "text-border-width": "1px",
                        "text-background-color": "#fff",
                        "text-background-shape": "roundrectangle",
                        "text-background-padding": "5px",
                        "text-background-opacity": "1",
                      }
                    },
                  {
                      selector: 'edge',
                      css: {
                          'color': '#197edd',
                          'background-color': "#65b3fc",
                          'line-color': "#65b3fc",
                          'font-size': "15px",
                          'content': 'data(label)',
                          'curve-style': 'bezier',
                          "edge-text-rotation": "autorotate",
                          'width': 3,
                          'target-arrow-shape': 'triangle',
                          'target-arrow-color': '#ffcb67',
                          'arrow-scale': 2
                          //"text-background-color": "#ddd",
                          //"text-background-shape": "roundrectangle",
                        //"text-background-padding": "5px",
                        //"text-background-opacity": "1",
                      }
                  },
                  {
                      selector: ':selected',
                      css: {
                          'background-color': 'black',
                          'line-color': 'black'
                      }
                  }
              ],
              elements: {
                  "nodes": [
                  //{ "data": {"id": "美国"} },
                  //{ "data": {"id": "中国"} },
                  ],
                  "edges": [
                      //{
                          //"data": {
                              //"label": "关系",
                              //"source": "美国",
                              //"target": "中国"
                          //},
                          //classes: 'autorotate'
                      //},
                      //{
                          //"data": {
                              //"label": "关系",
                              //"source": "中国",
                              //"target": "美国"
                          //},
                          //classes: 'autorotate'
                      //},
                  ]
              },

            }
        },
        mounted() {

        },
        created() {
            // console.log(navigator)
            this.genGraph();

            //this.getElements();
        },
        methods: {
            genGraph(){
                this.$api.ajax('/knowledge_graph','get', {'async': false})
                .then((data)=>{
                	if(!data) return ;
					data.edges.forEach((val,i)=>{
						val.classes = 'autorotate';
					});

                    
                    for(var i=0, len=data.nodes.length; i<len; i++){
                        data.nodes[i].data.text = this.sortText(data.nodes[i].data.content);
                        var node_css = this.genCss(data.nodes[i].data.content.length);
                        this.cyStyle.push(node_css);
                        data.nodes[i].classes = node_css.name;
                    }
                    this.elements = data
                    var cy  = cytoscape({
                      container: $('#graph'),
                      boxSelectionEnabled: false,
                      autounselectify: true,
                      style: this.cyStyle,

                      elements: this.elements,
                      hideLabelsOnViewPort: false,
                      minZoom: 0.15,
                      maxZoom: 8,
                      wheelSensitivity: 0.1,

                      layout: {
                          name: 'breadthfirst',
                          minDist: 40,
                          fit: true, // whether to fit to viewport
                          padding: 30, // fit padding
                          boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                          animate: false, // whether to transition the node positions
                          animationDuration: 500, // duration of animation in ms if enabled
                          animationEasing: undefined, // easing of animation if enabled
                          animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
                          ready: undefined, // callback on layoutready
                          stop: undefined, // callback on layoutstop
                          transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
                      }
                    });
                    this.navigator = cy.navigator({
                          container: "#navigator" // can be a HTML or jQuery element or jQuery selector
                        , viewLiveFramerate: 0 // set false to update graph pan only on drag end; set 0 to do it instantly; set a number (frames per second) to update not more than N times per second
                        , thumbnailEventFramerate: 30 // max thumbnail's updates per second triggered by graph updates
                        , thumbnailLiveFramerate: false // max thumbnail's updates per second. Set false to disable
                        , dblClickDelay: 200 // milliseconds
                        , removeCustomContainer: true // destroy the container specified by user on plugin destroy
                        , rerenderDelay: 100 // ms to throttle rerender updates to the panzoom for performance
                    })
                    this.panzoom = cy.panzoom({
                      zoomFactor: 0.05, // zoom factor per zoom tick
                      zoomDelay: 45, // how many ms between zoom ticks
                      minZoom: 0.1, // min zoom level
                      maxZoom: 10, // max zoom level
                      fitPadding: 50, // padding when fitting
                      panSpeed: 10, // how many ms in between pan ticks
                      panDistance: 10, // max pan distance per tick
                      panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
                      panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
                      panInactiveArea: 8, // radius of inactive area in pan drag box
                      panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
                      zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
                      fitSelector: undefined, // selector of elements to fit
                      animateOnFit: function(){ // whether to animate on fit
                        return false;
                      },
                      fitAnimationDuration: 1000, // duration of animation on fit

                      // icon class names
                      sliderHandleIcon: 'fa fa-minus',
                      zoomInIcon: 'fa fa-plus',
                      zoomOutIcon: 'fa fa-minus',
                      resetIcon: 'fa fa-expand'
                    } );
                    var d2 = new Date()
                })
            },
            afterUpload(){
                this.genGraph()
            },
            sortText(text){
              if(text && text.length > 5){
               return text.substring(0,5)+"..." 
              }
              return text
            },
            genCss(font_num){
              var font_size = 30 - (font_num-2)*6;
              if(!font_size || font_size < 12) font_size = 12;
              return {
                    "name": "fontSize_"+font_size,
                    "selector": ".fontSize_"+font_size,
                    "style": {
                      "font-size": font_size+"px"
                    }
              }
            }
        },
        components:{
	    	  upload,
	      },
        // destroyed() {
        //   this.cy.destroy()
        // }
    }


    import '../../assets/css/cytoscape-panzoom.css'
    import '../../assets/css/cytoscape-navigator.css'
</script>
<style lang="scss">
    #knowledgeGraph {height: 100%; position: relative; box-sizing: border-box; overflow:hidden;}
    #knowledgeGraph .input-group { position: absolute; top: 0;}
    #knowledgeGraph .wrap {height: 100%;}
    #cy {
    	height: 100%; width: 100%; position: relative;
    	.cy-panzoom {z-index:3;}
    }
    #graph {height: 100%; width: 100%;}
    #navigator {
    	width: 200px; height: 150px; position: absolute; right: 10px; bottom: 10px; ; overflow: hidden;  background:rgba(239,246,249,.5); border-radius:10px;
    	.cytoscape-navigatorView {background:rgba(0,0,0,.8); border-radius:10%;}
    }
</style>
