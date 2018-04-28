export default {
	data(){
		return {
			
			
		}
	},
  	methods:{
  		beforeUpload_mixin(file){   
			this.$store.state.global.loading++;
			return true;
		},
		uploadSuccess_mixin(res,file,before_upload_data){                    
			this.$store.state.global.loading--;
			this.$message({
				message:typeof res == 'string'?res:'文件上传成功',
				type:'success',
			});
		},
		uploadError_mixin(err,file,before_upload_data, source){
			this.$store.state.global.loading--;
			this.$message({
				message:err?err:'文件导入失败',
				type:source?'warning':'error',
			});
		},
  	},
}