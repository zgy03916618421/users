'use strict';
/* jshint node: true */

// 400
exports.OBJECT_ID_INVALID = {message: '无效的查询ID', status: 400};
exports.EMAIL_INVALID = {message: '电子邮箱格式错误', status: 400};
exports.MOBILE_INVALID = {message: '手机号码格式错误', status: 400};
exports.ACCOUNT_INVALID = {message: '账号无效', status: 400};
exports.PASSWORD_INVALID = {message: '密码无效', status: 400};
exports.PASSWORD_ERROR = {message: '密码错误', status: 400};
exports.PARAM_INVALID = {message: '参数错误', status: 400};
exports.CAPTCHA_SEND_FAILURE = {message: '验证码发送失败', status: 400};
exports.CAPTCHA_INVALID = {message: '验证码错误', 'status': 400};

// 401
exports.TOKEN_INVALID = {message: '令牌无效', status: 401};
exports.FORCE_LOGIN = {message: '请重新登录', status: 401};
exports.ORGANIZATION_INVALID = {message: '机构号未审核或被禁用', status: 401};
exports.ADMIN_TOKEN_INVALID = {message: '当前用户不是管理员', status: 401};

// 409
exports.MOBILE_EXISTS = {message: '手机号码已存在', status: 409};
exports.EMAIL_EXISTS = {message: '电子邮箱已存在', status: 409};

// 410
exports.USER_GONE = {message: '用户不存在', status: 410};
exports.BOOK_GONE = {message: '书籍不存在', status: 410};
exports.FLOOR_GONE = {message: '书单不存在', status: 410};
exports.BOOK_SHELF_GONE = {message: '书架不存在', status: 410};