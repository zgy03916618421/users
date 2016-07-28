var config = require("../../../config/config");
<!--短信-->
var msgPrepath = process.env.MESSAGE_PRE_HOST || 'http://192.168.3.2:8002';
exports.MESSAGE_SEND_PATH = msgPrepath + '/message/send';
<!--环信私信-->
exports.EASEMURL = 'https://a1.easemob.com/beautifulreading/beautifulreading/users';
<!--书架接口-->
var interfacePreHost = process.env.INTERFACE_PRE_HOST || 'https://api_rio.beautifulreading.com';
exports.PROJECT_NAME = 'usersv3';
exports.SAVE_DEFAULT_FOLLOWED = interfacePreHost + '/beautilfulreading/bs/user/followDeafult';
exports.SAVE_BOTH_FOLLOWED = interfacePreHost + '/beautilfulreading/bs/user/followBoth';
exports.VALIDATE_CODE_MSG = '您本次操作的验证码是';

exports.MESSAGE_MOBILE_NUMBERS = ['11122222222'];

