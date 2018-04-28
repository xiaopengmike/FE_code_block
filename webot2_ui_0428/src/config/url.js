export default {
	静态文件baseurl:'http://webot-data.ufile.ucloud.com.cn',
	company:{
		index:'/company/statistic',
		some_status:'/similar_question_status',
	},
	//待删除
	questions:{
		tag:{
			get:'/questions/tags',
		},
		get:'/questions'
	},
	session:{
		回答:'/chats/reply',
		返回推送信息id:'/chats/confirm',
		转接客服:'/chat/transform',
		guestbook:'/chat/leave_msg',
		log:'/chats/log',
		客服输入提示:'/chat/typing',
		upload:'/api/chats/upload',
	},
	user:{
		kfStatus:'/kf/status',
		allkfStatus: '/company/setting/kf_status',
		getUsers:'/users',
		getSimpleUsers: '/simple/users',
		getGroupsUsers:'/group/users',
		getGroups:'/groups',
		getSimpleGroups: '/simple/group/users',
		游客:'/chats',
	},
	knowledgeStore:{
		训练:'/deploy',
		活动类型:'/activities',
		活动知识:'/activities/questions',
		postfile:'/api/questions/upload',
		knowledge:{
			list:'/questions',
			tags:'/questions/tags',
			upload: '/company/media',
			标准问题检测:'/query_similarity_question',
			问题合并:'/question_cluster',
		},
		point:{
			tags:'/knowledge_point_tags',
			list:'/knowledge_point'
		},
	},
	similarWord:{
		postfile:'/api/excel/upload/entity',
		getfile:'/export',
	},
	knowledgeGraph:{
		postfile:'/api/knowledge_graph',
	},
	快捷回复:{
		list:'/quick_fbs',
	},
	知识点:{
		list:'/knowledge_point',
	},
	客服报表数据:{
		工作量列表:'/company/statistic/kf',
	},
	upload:{
		file: '/api/company/media',
	},
	workold:{
		list:'/work_order',
		detail: '/work_order/id',
		tags: '/work_order/tags',
		actionLog: '/work_order/log',
		action: '/work_order/action',
		upload: '/api/files/upload',
		游客:'/chat/customers',
	},
	kf:{
		list:'/users'
	},
	qualityTest:{
		list: '/qualities/session',
		results: '/qualities/result',
		result: '/qualities/id',
		setting: '/qualities/setting'
	},
	setting:{
		快捷回复:{
			common:'/company/setting/quickFB',
			personal:'/company/setting/quickFBUser'
		},
        online: {
            distribution: '/company/setting/distribution', // 会话分配设置 GET / PUT
            satisfaction: '/company/setting/evaluation', // 满意度设置 GET / PUT
            chatTimeout: '/company/setting/chat_timeout', // 会话超时设置 GET / PUT
            chatClose: '/company/setting/chat_close' // 会话结束设置 GET / PUT
        }
	}
}
