export default {
    token:{
        required:0,
        type:'url',
        name:'令牌url',
    },
    appid: {
        required:1,
        type:'string',
        name:'appid',  
    },
    appSecret: {
        required:1,
        type: 'string',
        name: 'appSecret',
    },
    /*similar_word:{
        required:0,
        type:'array',
        type_arr:'string',
        RegExp:"[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]",
        RegExp_err:'不能包含特殊字符',
        name:'相似词',
    }*/
    onlineServerUrl:{
        required:0,
        type:'url',
        name:'用户在线url'
    },
    phoneServerUrl:{
        required:0,
        type:'url',
        name:'用户电话url'
    }
}
