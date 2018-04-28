// import Vue from 'vue'
// // import Validator from 'vue-validator'
// // Vue.use(Validator)
// // //自定义验证器
// // //添加一个简单的手机号验证 
// // //匹配0-9之间的数字,并且长度是11位
// // Vue.validator('tel', function (val) {
// //  return /^[0-9]{11}$/.test(val)
// // });
// // //添加一个密码验证
// // //匹配6-20位的任何字类字符，包括下划线。与“[A-Za-z0-9_]”等效。
// // Vue.validator('noSpecialChars', function (val) {
// //  return /[`~!@#$^&*()=|{}':;',\\[\\].<>\/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]/.test(val);
// // });

// import VeeValidate from 'vee-validate';
// import {Validator} from 'vee-validate'
// import cn from 'vee-validate/dist/locale/zh_CN'

// const config = {
//     errorBagName: 'errors', // change if property conflicts.
//     delay: 0,
//     locale: 'zh_CN',
//     messages: null,
//     strict: true
// };
// // Validator.extend('chinese', {
// //     messages: {
// //         zh_CN: field => field + '格式不正确'
// //     },
// //     validate(value) {
// //         return /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/.test(value)
// //     }
// // })
// // 修改vee-validate默认的提示文案
// Validator.updateDictionary({
//     zh_CN: {
//         messages: {
//             regex: field => field + '格式不正确'
//         }
//     }
// });

// Vue.use(VeeValidate, config);
