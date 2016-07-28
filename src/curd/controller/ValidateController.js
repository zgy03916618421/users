'use strict';
/* jshint node: true */
/**
 * Created by Administrator on 15-3-2.
 */

const H = require('../utils/helper');

/**
 * 发送验证码
 * @resourcePath /User
 * @summary 发送验证码
 * @path /yuedu/userinfo/v3/validate
 * @method post
 * @param {string|name=mobile_number|paramType=form|description=手机号码|required=true}
 * @param {string|name=type|paramType=form|description=验证码类似(register|forgot)|required=true}
 */
exports.sendValidate = function *(){
    var body = yield bodyParse(this);
    var mobile_number = body.mobile_number;
    var type = body.type;
    //验证上传判断
    if(Tools.isEmpty(mobile_number)){
        yield this.body = {'head':{'code':1000,msg:'手机号不能为空'}};
        return;
    }
    if(Tools.isEmpty(type)){
        yield this.body = {'head':{'code':1000,msg:'发送类型不能为空'}};
        return;
    }
    var user = yield S.UserService.getByMobileNumber(mobile_number);
    if("register" == type){
        if(Tools.isNotEmpty(user)){
            yield this.body = {'head':{'code':1004,msg:'手机号已被注册'}};
            return;
        }
    }else{
        if(Tools.isEmpty(user)){
            yield this.body = {'head':{'code':1000,msg:'手机号未注册'}};
            return;
        }
    }
    //发送验证信息到第三方平台
    var random = Tools.getValidateCode();
    var msg =  Const.VALIDATE_CODE_MSG + random;
    MessageUtils.sendMsg(mobile_number,msg);
    var validate = E.validate();
    validate.mobile_number = mobile_number;
    validate.validate_code = random;
    validate = Tools.setBaseFields(validate);
    var rs = yield S.ValidateService.save(validate);
    if(rs){
        yield this.body = {'head':{code: 200,msg:'success'},data:random};
    }else{
        yield this.body = {'head':{code: 2000,msg:'发送验证码操作失败'}};
    }

}

/**
 * 验证码校验
 * @resourcePath /User
 * @summary 验证码校验
 * @path /yuedu/userinfo/v3/validate/check/{mobile_number}/{validate_code}
 * @method get
 * @param {string|name=mobile_number|paramType=path|description=手机号码|required=true}
 * @param {string|name=validate_code|paramType=path|description=验证码|required=true}
 */
exports.checkValidate = function *(){
    var mobile_number = this.params.mobile_number;
    var validate_code = this.params.validate_code;
    //验证上传判断
    if(Tools.isEmpty(mobile_number)){
        yield this.body = {head:{code:1000,msg:'手机号不能为空'}};
        return;
    }
    if(Tools.isEmpty(validate_code)){
        yield this.body = {head:{code:1000,msg:'验证码不能为空'}};
        return;
    }
    var validate = yield S.ValidateService.getLastByMobileNumber(mobile_number);
    if(validate_code == validate.validate_code){
        yield this.body = {head:{code: 200,msg:'success'}};
    }else{
        yield this.body = {head:{code: 1003,msg:'验证码校验失败'}};
    }
}

exports.sendCaptcha = H.f(function*() {
    let body = yield bodyParse(this);
    let account = body.account;
    let type = body.type;

    let captcha = yield S.ValidateService.sendCaptcha(account, type);

    this.send(200, {message: '成功', data: captcha});
});

