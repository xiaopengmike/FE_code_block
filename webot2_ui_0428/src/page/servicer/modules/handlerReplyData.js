import api from '../../../config/api.js'
export default {
	handler(session_id,kf_id){
		let data,tell,tell_no_img;
		let time =  api.dateFormat('yyyy-MM-dd hh:mm:ss');
		data={
			session_id:session_id,
			from:'kf',
			msg_type:'',
			media:{},
			text: '',
			rich_answer:null,
		}
		tell = {
			from:'kf',
			kf_id:kf_id,
			time:time,
			send:0,
			text:'',
			media:{},
			rich_answer:null,
		}
		tell_no_img={
			from:'kf',
			time:time,
			send:0,
			kf_id:kf_id,
			text:'',
		}
		return [data,tell,tell_no_img];
	},
	text(text,session_id,kf_id){
		let [data,tell,tell_no_img] = this.handler(session_id,kf_id);
		tell.msg_type = data.msg_type = 'text';
		tell.text = data.text = text;
		tell_no_img.text=text;
		return [data,tell,tell_no_img];
	},
	image(media,session_id,kf_id){
		let [data,tell,tell_no_img] = this.handler(session_id,kf_id);
		tell.msg_type = data.msg_type = 'image';
		tell.media = data.media = media;
		tell_no_img.text='[图片]';
		return [data,tell,tell_no_img];
	},
	file(media,session_id,kf_id){
		let [data,tell,tell_no_img] = this.handler(session_id,kf_id);
		tell.msg_type = data.msg_type = 'file';
		tell.media = data.media = media;
		tell_no_img.text='[文件]';
		return [data,tell,tell_no_img];
	},
	richAnswer(rich_answer,session_id,kf_id){
		let [data,tell,tell_no_img] = this.handler(session_id,kf_id);
		tell.msg_type = data.msg_type = 'rich_answer';
		tell.rich_answer = data.rich_answer = rich_answer;
		tell_no_img.text='[富媒体]';
		return [data,tell,tell_no_img];
	},
	richText(rich_text,session_id,kf_id){
		let [data,tell,tell_no_img] = this.handler(session_id,kf_id);
		tell.msg_type = data.msg_type = 'rich_text';
		tell.rich_text = data.rich_text = rich_text;
		tell_no_img.text='[富文本]';
		return [data,tell,tell_no_img];
	}
}
