/*import Login from '../page/login.vue';
import index from '../page/index.vue';

import rootAdmin from '../page/rootAdmin/main.vue';
import rootAdminCompany from '../page/rootAdmin/company.vue';

import setting from '../page/setting/main.vue';
import joinWeb from '../page/setting/joinWeb.vue';
import joinWechat from '../page/setting/joinWechat.vue';
import joinCRM from '../page/setting/joinCRM.vue';
import robotBase from '../page/setting/robotBase.vue';
import robotQuestions from '../page/setting/robotQuestions.vue';
import userInfo from '../page/setting/userInfo.vue';
import companyInfo from '../page/setting/companyInfo.vue';
import onlineBase from '../page/setting/onlineBase.vue';
import timeStopServer from '../page/setting/timeStopServer.vue';
import leaveMessage from '../page/setting/leaveMessage.vue';
import quickFBCommon from '../page/setting/quickFBCommon.vue';
import quickFBPrivate from '../page/setting/quickFBPrivate.vue';


import rebotKnowledgeStore from '../page/rebotKnowledgeStore/main.vue';
import showMedia from '../page/rebotKnowledgeStore/showMedia.vue';
import knowledgeStore from '../page/rebotKnowledgeStore/knowledgeStore.vue';
import similarWordStore from '../page/rebotKnowledgeStore/similarWordStore.vue';

import activitySetting from '../page/rebotKnowledgeStore/activitySetting.vue';
import knowledgeGraph from '../page/rebotKnowledgeStore/knowledgeGraph.vue';

import study from '../page/study/main.vue';
import studyRobot from '../page/study/robot.vue';
import studyHuman from '../page/study/human.vue';


import userAdmin from '../page/user/main.vue';
import userAccount from '../page/user/account.vue';
import userGroup from '../page/user/setGroup.vue';
import userRole from '../page/user/setRole.vue';

import system from '../page/system/main.vue';
import logs from '../page/system/logs.vue';
import recycle from '../page/system/recycle.vue';
import backup from '../page/system/backup.vue';

import report from '../page/report/main.vue';
import reportPandect from '../page/report/pandect.vue';
import reportServicer from '../page/report/servicer/main.vue';
import reportServicerWorkload from '../page/report/servicer/workload.vue';
import reportServicerWorkmanship from '../page/report/servicer/workmanship.vue';
import reportServicerWorkloadDetail from '../page/report/servicer/workloadDetail.vue';
import reportGuestbook from '../page/report/guestbook.vue';
import reportRobot from '../page/report/robot/main.vue';
import reportRobotPandect from '../page/report/robot/pandect.vue';
import reportRobotQuestion from '../page/report/robot/question.vue';
import reportRobotClassify from '../page/report/robot/classify.vue';

import userAnalyze from '../page/userAnalyze/main.vue';
import userAnalyzePandect from '../page/userAnalyze/pandect.vue';
import intention from '../page/userAnalyze/intention.vue';
import emotionalTendency from '../page/userAnalyze/emotionalTendency.vue';

import servicer from '../page/servicer/main.vue';
import session from '../page/servicer/session.vue';
import history from '../page/servicer/history.vue';
import guestbook from '../page/servicer/guestbook.vue';*/

const Login = () =>
	import('../page/login.vue');
const index = () =>
	import('../page/index.vue');
const rootAdmin = () =>
	import('../page/rootAdmin/main.vue');
const rootAdminCompany = () =>
	import('../page/rootAdmin/company.vue');
const setting = () =>
	import('../page/setting/main.vue');
const joinWeb = () =>
	import('../page/setting/joinWeb.vue');
const joinWechat = () =>
	import('../page/setting/joinWechat.vue');
const joinCRM = () =>
	import('../page/setting/joinCRM.vue');
const robotBase = () =>
	import('../page/setting/robotBase.vue');
const robotQuestions = () =>
	import('../page/setting/robotQuestions.vue');
const userInfo = () =>
	import('../page/setting/userInfo.vue');
const companyInfo = () =>
	import('../page/setting/companyInfo.vue');
const onlineBase = () =>
	import('../page/setting/onlineBase.vue');
const timeStopServer = () =>
	import('../page/setting/timeStopServer.vue');
const leaveMessage = () =>
	import('../page/setting/leaveMessage.vue');
const sessionAllocation = () =>
	import('../page/setting/session_allocation.vue');
const satisfaction = () =>
	import('../page/setting/satisfaction.vue');
const sessionTimeout = () =>
	import('../page/setting/session_timeout.vue');
const quickFBCommon = () =>
	import('../page/setting/quickFBCommon.vue');
const quickFBPrivate = () =>
	import('../page/setting/quickFBPrivate.vue');
const rebotKnowledgeStore = () =>
	import('../page/knowledgeStore/main.vue');
const knowledgePoint = () =>
	import('../page/knowledgeStore/knowledgePoint.vue');
const knowledgeStore = () =>
	import('../page/knowledgeStore/knowledgeStore.vue');
const knowledgeStoreClassfication = () =>
  import('../page/knowledgeStore/knowledgeStoreClassfication.vue');
const similarWordStore = () =>
	import('../page/knowledgeStore/similarWordStore.vue');
const activitySetting = () =>
	import('../page/knowledgeStore/activitySetting.vue');
const knowledgeGraph = () =>
	import('../page/knowledgeStore/knowledgeGraph.vue');
const showMedia = () =>
	import('../page/knowledgeStore/showMedia.vue');
const study = () =>
	import('../page/study/main.vue');
const studyRobot = () =>
	import('../page/study/robot.vue');
const studyHuman = () =>
	import('../page/study/human.vue');
const userAdmin = () =>
	import('../page/user/main.vue');
const userAccount = () =>
	import('../page/user/account.vue');
const userGroup = () =>
	import('../page/user/setGroup.vue');
const userRole = () =>
	import('../page/user/setRole.vue');
const system = () =>
	import('../page/system/main.vue');
const logs = () =>
	import('../page/system/logs.vue');
const recycle = () =>
	import('../page/system/recycle.vue');
const backup = () =>
	import('../page/system/backup.vue');

const report = () =>
	import('../page/report/main.vue');
const reportPandect = () =>
	import('../page/report/pandect.vue');
const reportServicer = () =>
	import('../page/report/servicer/main.vue');
const reportServicerWorkload = () =>
	import('../page/report/servicer/workload.vue');
const reportServicerWorkmanship = () =>
	import('../page/report/servicer/workmanship.vue');
const reportServicerWorkloadDetail = () =>
	import('../page/report/servicer/workloadDetail.vue');
const reportGuestbook = () =>
	import('../page/report/guestbook.vue');
const reportRobot = () =>
	import('../page/report/robot/main.vue');
const reportRobotPandect = () =>
	import('../page/report/robot/pandect.vue');
const reportRobotQuestion = () =>
	import('../page/report/robot/question.vue');
const reportRobotClassify = () =>
	import('../page/report/robot/classify.vue');

const report02Robot = () =>
  import('../page/report2/robot/main.vue');
const report02RobotPandect = () =>
  import('../page/report2/robot/pandect.vue');
const report02RobotQuestion = () =>
  import('../page/report2/robot/question.vue');
const report02RobotClassify = () =>
  import('../page/report2/robot/classify.vue');


const report2 = () =>
  import('../page/report2/main.vue');
const report2Pandect = () =>
  import('../page/report2/pandect.vue');
const waiter2 = () =>
  import('../page/report2/waiter2.vue');
const robot2 = () =>
  import('../page/report2/robot2.vue');

const report2Servicer = () =>
  import('../page/report2/servicer/main.vue');
const report2ServicerWorkload = () =>
  import('../page/report2/servicer/workload.vue');
const report2ServicerWorkmanship = () =>
  import('../page/report2/servicer/workmanship.vue');
const report2ServicerAttendance = () =>
  import('../page/report2/servicer/attendance.vue');

const report2ServicerWorkloadDetail = () =>
  import('../page/report2/servicer/workloadDetail.vue');

const report2worksheet = () =>
  import('../page/report2/worksheet/main.vue');
const report2worksheetWorkload = () =>
  import('../page/report2/worksheet/workload.vue');
const report2worksheetWorkmanship = () =>
  import('../page/report2/worksheet/workmanship.vue');
const report2worksheetWorkloadDetail = () =>
  import('../page/report2/servicer/workloadDetail.vue');

const report2Guestbook = () =>
  import('../page/report2/guestbook.vue');
const report2Robot = () =>
  import('../page/report2/robot/main.vue');
const report2RobotPandect = () =>
  import('../page/report2/robot/pandect.vue');
const report2RobotQuestion = () =>
  import('../page/report2/robot/question.vue');
const report2RobotClassify = () =>
  import('../page/report2/robot/classify.vue');


const userAnalyze = () =>
	import('../page/userAnalyze/main.vue');
const userAnalyzePandect = () =>
	import('../page/userAnalyze/pandect.vue');
const intention = () =>
	import('../page/userAnalyze/intention.vue');
const emotionalTendency = () =>
	import('../page/userAnalyze/emotionalTendency.vue');
const servicer = () =>
	import('../page/servicer/main.vue');
const session = () =>
	import('../page/servicer/session.vue');
const history = () =>
	import('../page/servicer/history.vue');
const guestbook = () =>
	import('../page/servicer/guestbook.vue');

const workold = () =>
	import('../page/workold/main.vue');
const workoldList = () =>
	import('../page/workold/list.vue');
const workoldDetail = () =>
	import('../page/workold/detail.vue');
const workoldTag = () =>
	import('../page/workold/setting/tag.vue');

const qualityTest = () =>
	import('../page/qualityTest/main.vue');
const qualityTestList = () =>
	import('../page/qualityTest/list.vue');
const qualityTestTag= () =>
	import('../page/qualityTest/tag.vue');
// const qualityTestDetail = () =>
// 	import('../page/qualityTest/detail.vue');


// 配置路由
const route = [{
		path: '/',
		redirect: '/index',
		permission: '首页',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: false,
	},
	{
		path: '/index',
		component: index,
		name: '首页',
		permission: '首页',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'my-fa my-icon-home',
	},
	{
		path: '/login',
		component: Login,
		name: '登录',
		show: false,
	},
	{
		path: '/showMedia',
		component: showMedia,
		name: '媒体展示',
		show: false
	},
	// {
	// 	path: '/report',
	// 	component: report,
	// 	name: '工作报表',
	// 	permission: '工作报表',
	// 	meta: {
	// 		requireAuth: true,
	// 		mode: 'admin',
	// 	},
	// 	show: true,
	// 	icon_class: 'ivu-icon ivu-icon-arrow-graph-up-right',
	// 	redirect: '/report/pandect',
	// 	show_child: true,
	// 	children: [{
	// 			path: '/report/pandect',
	// 			component: reportPandect,
	// 			name: '总览',
	// 			meta: {
	// 				requireAuth: true,
	// 			},
	// 			show: true
	// 		},
	// 		{
     //    path: '/report/servicer',
     //    component: reportServicer,
     //    name: '客服',
     //    permission: '工作报表-客服',
     //    meta: {
     //      requireAuth: true,
     //    },
     //    show: true,
     //    redirect: '/report/servicer/workload',
     //    children: [{
     //      path: '/report/servicer/workload',
     //      component: reportServicerWorkload,
     //      name: '工作量',
     //      meta: {
     //        requireAuth: true,
     //      },
     //      show: true
     //    },
     //      {
     //        path: '/report/servicer/workmanship',
     //        component: reportServicerWorkmanship,
     //        name: '工作质量',
     //        meta: {
     //          requireAuth: true,
     //        },
     //        show: true
     //      },
     //      {
     //        path: '/report/servicer/workloadDetail',
     //        component: reportServicerWorkloadDetail,
     //        name: '工作量详情',
     //        meta: {
     //          requireAuth: true,
     //        },
     //        show: false
     //      },
     //    ]
     //  },
	// 		{
	// 			path: '/report/guestbook',
	// 			component: reportGuestbook,
	// 			name: '留言',
	// 			meta: {
	// 				requireAuth: true,
	// 			},
	// 			show: true
	// 		},
	// 		{
	// 			path: '/report/robot',
	// 			component: reportRobot,
	// 			name: '机器人',
	// 			permission: '工作报表-机器人',
	// 			meta: {
	// 				requireAuth: true,
	// 			},
	// 			show: true,
	// 			redirect: '/report/robot/pandect',
	// 			children: [{
	// 					path: '/report/robot/pandect',
	// 					component: reportRobotPandect,
	// 					name: '机器人数据总览',
	// 					meta: {
	// 						requireAuth: true,
	// 					},
	// 					show: true
	// 				},
	// 				{
	// 					path: '/report/robot/question',
	// 					component: reportRobotQuestion,
	// 					name: '热点问题统计',
	// 					meta: {
	// 						requireAuth: true,
	// 					},
	// 					show: true
	// 				},
	// 				{
	// 					path: '/report/robot/classify',
	// 					component: reportRobotClassify,
	// 					name: '问题分类统计',
	// 					meta: {
	// 						requireAuth: true,
	// 					},
	// 					show: true
	// 				},
	// 			]
	// 		},
	// 	]
	// },

  {
    path: '/report2',
    component: report2,
    name: '工作报表',
    permission: '工作报表',
    meta: {
      requireAuth: true,
      mode: 'admin',
    },
    show: true,
    icon_class: 'ivu-icon ivu-icon-arrow-graph-up-right',
    redirect: '/report2/pandect',
    show_child: true,
    children: [{
      path: '/report2/pandect',
      component: report2Pandect,
      name: '总览',
      meta: {
        requireAuth: true,
      },
      show: true
    }

      ,
      // {
      //   path: '/report2/waiter2',
      //   component: waiter2,
      //   name: '客服详情',
      //   meta: {
      //     requireAuth: true,
      //   },
      //   show: true
      // },

      {
        path: '/report2/robot',
        component: report02Robot,
        name: '机器人',
        permission: '工作报表-机器人',
        meta: {
          requireAuth: true,
        },
        show: true,
        redirect: '/report2/robot/pandect',
        children: [{
          path: '/report2/robot/pandect',
          component: report02RobotPandect,
          name: '机器人数据总览',
          meta: {
            requireAuth: true,
          },
          show: true
        },
          {
            path: '/report2/robot/question',
            component: report02RobotQuestion,
            name: '热点问题统计',
            meta: {
              requireAuth: true,
            },
            show: true
          },
          {
            path: '/report2/robot/classify',
            component: report02RobotClassify,
            name: '问题分类统计',
            meta: {
              requireAuth: true,
            },
            show: true
          },
        ]
      },
      {
        path: '/report2/servicer',
        component: report2Servicer,
        name: '客服',
        permission: '工作报表-客服',
        meta: {
          requireAuth: true,
        },
        show: true,
        redirect: '/report2/servicer/workload',
        children: [{
          path: '/report2/servicer/workload',
          component: report2ServicerWorkload,
          name: '工作量',
          meta: {
            requireAuth: true,
          },
          show: true
        },
          {
            path: '/report2/servicer/workmanship',
            component: report2ServicerWorkmanship,
            name: '工作质量',
            meta: {
              requireAuth: true,
            },
            show: true
          },
          {
            path: '/report2/servicer/attendance',
            component: report2ServicerAttendance,
            name: '考勤信息',
            meta: {
              requireAuth: true,
            },
            show: true
          },
          {
            path: '/report2/servicer/workloadDetail',
            component: report2ServicerWorkloadDetail,
            name: '工作量详情',
            meta: {
              requireAuth: true,
            },
            show: false
          },
        ]
      },


      // {
      //   path: '/report2/robot2',
      //   component: robot2,
      //   name: '机器人new',
      //   meta: {
      //     requireAuth: true,
      //   },
      //   show: true
      // },
      {
        path: '/report2/worksheet',
        component: report2worksheet,
        name: '工单',
        permission: '工作报表-客服',
        meta: {
          requireAuth: true,
        },
        show: true,
        redirect: '/report2/worksheet/workload',
        children: [{
          path: '/report2/worksheet/workload',
          component: report2worksheetWorkload,
          name: '工单分类统计',
          meta: {
            requireAuth: true,
          },
          show: true
        },
          {
            path: '/report2/worksheet/workmanship',
            component: report2worksheetWorkmanship,
            name: '客服工作量',
            meta: {
              requireAuth: true,
            },
            show: true
          },
          // {
          //   path: '/report2/worksheet/workloadDetail',
          //   component: report2worksheetWorkloadDetail,
          //   name: '工作量详情',
          //   meta: {
          //     requireAuth: true,
          //   },
          //   show: false
          // },
        ]
      },
    ]
  },


	{
		path: '/workold',
		component: workold,
		name: '工单中心',
		permission: '工单中心',
		redirect: '/workold/list',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'ivu-icon ivu-icon-ios-paper',
		show_child: false,
		children: [{
			path: '/workold/list',
			component: workoldList,
			name: '所有工单',
			permission: '工单中心-所有工单',
			meta: {
				requireAuth: true,
			},
			show: true
		}, {
			path: '/workold/detail',
			component: workoldDetail,
			name: '工单详情',
			permission: '工单中心-工单详情',
			meta: {
				requireAuth: true,
			},
			show: true
		}, {
			path: '/workold/tag',
			component: workoldTag,
			name: '工单详情',
			permission: '工单中心-分类',
			meta: {
				requireAuth: true,
			},
			show: true
		},
		],
	},
	{
		path: '/rebotKnowledgeStore',
		component: rebotKnowledgeStore,
		name: '机器人知识库',
		permission: '机器人知识库',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'my-icon-knowledge my-fa',
		redirect: '/rebotKnowledgeStore/knowledgeStore',
		show_child: true,
		children: [{
				path: '/rebotKnowledgeStore/knowledgeStore',
				component: knowledgeStore,
				name: '知识库',
				permission: '机器人知识库-知识库',
				meta: {
					requireAuth: true,
				},
				show: true
			},

      {
        path: '/rebotKnowledgeStore/knowledgeStoreClassfication',
        component: knowledgeStoreClassfication,
        name: '知识库整理',
        permission: '机器人知识库-知识库整理',
        meta: {
          requireAuth: true,
        },
        show: true
      },



			{
				path: '/rebotKnowledgeStore/knowledgePoint',
				component: knowledgePoint,
				name: '知识点',
				permission: '机器人知识库-知识点',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/rebotKnowledgeStore/activitySetting',
				component: activitySetting,
				name: '活动配置',
				permission: '机器人知识库-活动配置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/rebotKnowledgeStore/similarWordStore',
				component: similarWordStore,
				name: '同义词库',
				permission: '机器人知识库-同义词库',
				meta: {
					requireAuth: true,
				},
				show: true

			},
			{
				path: '/rebotKnowledgeStore/knowledgeGraph',
				component: knowledgeGraph,
				name: '知识图谱',
				permission: '机器人知识库-知识图谱',
				meta: {
					requireAuth: true,
				},
				show: true

			},
		]
	},
	{
		path: '/study',
		component: study,
		name: '问题学习',
		permission: '问题学习',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		icon_class: 'ivu-icon ivu-icon-ios-book',
		redirect: '/study/robot',
		show: true,
		show_child: true,
		children: [{
				path: '/study/robot',
				component: studyRobot,
				name: '机器人未识别问题',
				permission: '问题学习-机器人未识别问题',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/study/huamn',
				component: studyHuman,
				name: '人工客服问答',
				permission: '问题学习-人工客服问答',
				meta: {
					requireAuth: true,
				},
				show: true
			},
		],
	},
	{
		path: '/qualityTest',
		component: qualityTest,
		name: '质量质检',
		permission: '质量质检',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'my-icon-KHanalysis my-fa',
		redirect: '/qualityTest/list',
		show_child: false,
		children: [{
				path: '/qualityTest/list',
				component: qualityTestList,
				name: '会话质检',
				permission: '质量质检-会话质检',
				meta: {
					requireAuth: true,
				},
				show: false
			},
			{
				path: '/qualityTest/tag',
				component: qualityTestTag,
				name: '',
				permission: '质量质检-质检设置',
				meta: {
					requireAuth: true,
				},
				show: false
			}
		]
	},
	{
		path: '/user/admin',
		component: userAdmin,
		name: '用户管理',
		permission: '用户管理',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'my-icon-userAdmin my-fa',
		redirect: '/user/admin/account',
		show_child: true,
		children: [{
				path: '/user/admin/account',
				component: userAccount,
				name: '所有用户',
				permission: '用户管理-所有用户',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/user/admin/group',
				component: userGroup,
				name: '用户分组',
				permission: '用户管理-用户分组',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			// {
			// 	path: '/user/admin/role',
			// 	component: userRole,
			// 	name: '设置角色',
			// 	meta: {
			// 		requireAuth: true,
			// 	},
			// 	show: true
			// }
		]
	},

	{
		path: '/system',
		component: system,
		name: '系统日志',
		permission: '系统日志',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		redirect: '/system/logs',
		show: true,
		icon_class: 'my-fa my-icon-log',
		show_child: true,
		children: [{
				path: '/system/logs',
				component: logs,
				name: '总览',
				permission: '系统日志-总览',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/system/recycle',
				component: recycle,
				name: '回收站',
				permission: '系统日志-回收站',
				meta: {
					requireAuth: true,
				},
				show: true
			}
		]
	},
	{
		path: '/backup',
		component: backup,
		name: '数据备份',
		permission: '数据备份',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'my-icon-backup my-fa',
	},

	{
		path: '/userAnalyze',
		component: userAnalyze,
		name: '客户分析',
		permission: '客户分析',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'ivu-icon ivu-icon-pie-graph',
		redirect: '/userAnalyze/pandect',
		show_child: true,
		children: [{
				path: '/userAnalyze/pandect',
				component: userAnalyzePandect,
				name: '总览',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/userAnalyze/intention',
				component: intention,
				name: '意图分析',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/userAnalyze/emotionalTendency',
				component: emotionalTendency,
				name: '情感分析',
				meta: {
					requireAuth: true,
				},
				show: true
			},
		]
	},

	{
		path: '/setting',
		component: setting,
		name: '设置',
		permission: '设置',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: false,
		icon_class: 'ivu-icon ivu-icon-android-setting',
		redirect: '/setting/userInfo',
		show_child: true,
		children: [{
				path: '/setting/userInfo',
				component: userInfo,
				name: '个人信息设置',
				permission: '设置-个人信息设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/companyInfo',
				component: companyInfo,
				name: '公司信息设置',
				permission: '设置-公司信息设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/online/base',
				component: onlineBase,
				name: '基础设置',
				permission: '设置-基础设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
            {
                path: '/setting/online/sessionAllocation',
                component: sessionAllocation,
                name: '会话分配设置',
                permission: '设置-会话分配设置',
                meta: {
                    requireAuth: true,
                },
                show: true
            },
            {
                path: '/setting/online/satisfaction',
                component: satisfaction,
                name: '满意度设置',
                permission: '设置-满意度设置',
                meta: {
                    requireAuth: true,
                },
                show: true
            },
            {
                path: '/setting/online/session_timeout',
                component: sessionTimeout,
                name: '会话超时设置',
                permission: '设置-会话超时设置',
                meta: {
                    requireAuth: true,
                },
                show: true
            },
			{
				path: '/setting/online/timeStopServer',
				component: timeStopServer,
				name: '统计设置',
				permission: '设置-统计设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/online/leaveMessage',
				component: leaveMessage,
				name: '留言设置',
				permission: '设置-留言设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/join/web',
				component: joinWeb,
				name: '网站接入',
				permission: '设置-网站接入',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/join/wechat',
				component: joinWechat,
				name: '微信接入',
				permission: '设置-微信接入',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/join/CRMInfo',
				component: joinCRM,
				name: '信息对接',
				permission: '设置-信息对接',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/robot/base',
				component: robotBase,
				name: '基础设置',
				permission: '设置-基础设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/robot/questions',
				component: robotQuestions,
				name: '常见问题设置',
				permission: '设置-常见问题设置',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/quickFB/common',
				component: quickFBCommon,
				name: '公有库',
				permission: '设置-公有库',
				meta: {
					requireAuth: true,
				},
				show: true
			},
			{
				path: '/setting/quickFB/private',
				component: quickFBPrivate,
				name: '私有库',
				permission: '设置-私有库',
				meta: {
					requireAuth: true,
				},
				show: true
			}

		]
	},
	{
		path: '/rootAdmin',
		component: rootAdmin,
		name: '智言运营',
		permission: '智言运营',
		meta: {
			requireAuth: true,
			mode: 'admin',
		},
		show: true,
		icon_class: 'my-fa my-icon-home',
		redirect: '/rootAdmin/company',
		show_child: true,
		children: [{
			path: '/rootAdmin/company',
			component: rootAdminCompany,
			name: '公司管理',
			permission: '智言运营-公司管理',
			meta: {
				requireAuth: true,
				mode: 'servicer',
			},
			show: true,
			icon_class: 'my-fa my-icon-home',
			color: '#328eff',
		}]
	},
	//客服模式
	{
		path: '/servicer',
		component: servicer,
		name: '',
		permission: '客服模式',
		redirect: '/servicer/session',
		meta: {
			requireAuth: true,
			mode: 'servicer',
		},
		show: true,
		icon_class: 'my-fa my-icon-user',
		children: [{
				path: '/servicer/session',
				component: session,
				name: '当前会话',
				permission: '当前会话',
				meta: {
					requireAuth: true,
					mode: 'servicer',
				},
				show: true,
				icon_class: 'ivu-icon ivu-icon-chatbubble-working',
			},
			{
				path: '/servicer/workold',
				component: workold,
				name: '工单中心',
				permission: '工单中心',
				redirect: '/servicer/workold/list',
				meta: {
					requireAuth: true,
					mode: 'servicer',
				},
				show: true,
				icon_class: 'ivu-icon ivu-icon-ios-paper',
				show_child: false,
				children: [{
					path: '/servicer/workold/list',
					component: workoldList,
					name: '所有工单',
					permission: '工单中心-所有工单',
					meta: {
						requireAuth: true,
					},
					show: true
				}, {
					path: '/servicer/workold/detail',
					component: workoldDetail,
					name: '工单详情',
					permission: '工单中心-工单详情',
					meta: {
						requireAuth: true,
					},
					show: true
				}, {
					path: '/servicer/workold/tag',
					component: workoldTag,
					name: '工单详情',
					permission: '工单中心-分类',
					meta: {
						requireAuth: true,
					},
					show: true
				},  ],
			},
			/*{
				path: '/servicer/guestbook',
				component: guestbook,
				name: '留言',
				permission: '留言',
				meta: {
					requireAuth: true,
					mode: 'servicer',
				},
				show: true,
				icon_class: 'my-fa my-icon-user',
			},*/
			{
				path: '/servicer/history',
				component: history,
				name: '历史会话',
				permission: '历史会话',
				meta: {
					requireAuth: true,
					mode: 'servicer',
				},
				show: true,
				icon_class: 'ivu-icon ivu-icon-ios-timer',
			},
			{
				path: '/servicer/setting',
				redirect: '/servicer/userInfo',
				component: setting,
				name: '设置',
				permission: '客服工作台_设置',
				meta: {
					requireAuth: true,
					mode: 'servicer',
				},
				show: false,
				icon_class: 'ivu-icon ivu-icon-android-setting',
				children: [{
						path: '/servicer/userInfo',
						component: userInfo,
						name: '个人信息设置',
						permission: '设置-个人信息设置',
						meta: {
							requireAuth: true,
						},
						show: true
					},
					{
						path: '/servicer/robot/questions',
						component: robotQuestions,
						name: '常见问题设置',
						permission: '设置-常见问题设置',
						meta: {
							requireAuth: true,
						},
						show: true
					},
					{
						path: '/servicer/quickFB/common',
						component: quickFBCommon,
						name: '公有库',
						permission: '设置-公有库',
						meta: {
							requireAuth: true,
						},
						show: true
					},
					{
						path: '/servicer/quickFB/private',
						component: quickFBPrivate,
						name: '私有库',
						permission: '设置-私有库',
						meta: {
							requireAuth: true,
						},
						show: true
					}
				]

			}
		]

	}
];
module.exports = route

