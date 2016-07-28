var router = require('koa-router')();

router.get('/', C.AdminController.index);                 //index
<!-- 注意account默认为手机号,写account为方便扩展-->
router.get('/yuedu/userinfo/v3/user/:mobile_number/:password', C.UserController.login);       //校验登录信息
router.get('/yuedu/userinfo/v3/token/:mobile_number/:password', C.TokenController.getToken);    //获取token
router.get('/yuedu/userinfo/v3/user/token/:token', C.UserController.getUserByToken);                  //注册
router.put('/yuedu/userinfo/v3/user/third_login', C.UserController.thirdLogin);    //第三方登录
router.put('/yuedu/userinfo/v3/user/third_bind', C.UserController.third_bind);    //第三方登录绑定

router.post('/yuedu/userinfo/v3/user', C.UserController.register);                  //注册
router.post('/yuedu/userinfo/v3/user/email', C.UserController.registerByEmail);                  //注册
router.put('/yuedu/userinfo/v3/user', C.UserController.update);                    //更新用户信息
router.post('/yuedu/userinfo/v3/user/upload', C.UserController.upload);           //头像上传

router.post('/yuedu/userinfo/v3/validate', C.ValidateController.sendValidate);       //发送验证
router.get('/yuedu/userinfo/v3/validate/check/:mobile_number/:validate_code', C.ValidateController.checkValidate);        //获取验证

<!--特殊接口:测试环信-->
//router.get('/yuedu/admin/v3/ease/:user_id', C.UserController.testEase);



<!-- 公共调用interface-->
router.post('/beautifulreading/userinfo/v3/userext', C.UserextController.save);
router.put('/beautifulreading/userinfo/v3/userext', C.UserextController.save);
router.put('/beautifulreading/userinfo/v3/userext/filter', C.UserextController.list);
router.put('/beautifulreading/userinfo/v3/userext/count/filter', C.UserextController.count);
router.put('/beautifulreading/userinfo/v3/userext/filter/:skip/:limit', C.UserextController.list_skip_limit);
router.put('/beautifulreading/userinfo/v3/userext/all/:skip/:limit', C.UserextController.all_skip_limit);
router.put('/beautifulreading/userinfo/v3/userext/key', C.UserextController.findByKey);
router.get('/beautifulreading/userinfo/v3/userext/:user_id/:skip/:limit', C.UserextController.findOthers);
router.get('/beautifulreading/userinfo/v3/userext/user_id/:user_id', C.UserextController.findByUserId);

router.get('/beautifulreading/userinfo/v3/userext/:mobile_number/:mobile_number', C.UserextController.findByMobileNumber);

router.get('/beautifulreading/userinfo/v3/token/:token', C.UserController.getUserByTokenOnlyDate);
// router.get('/beautifulreading/userinfo/v3/token', C.UserController.getUserByTokenOnlyDate);
router.get('/beautifulreading/userinfo/v3/token', C.User2Controller.readCurrent);
router.post('/beautifulreading/userinfo/v3/user', C.UserController.save);
router.put('/beautifulreading/userinfo/v3/user', C.UserController.save);
router.delete('/beautifulreading/userinfo/v3/user/:user_id', C.UserController.delete);
router.put('/beautifulreading/userinfo/v3/user/filter', C.UserController.list);
router.put('/beautifulreading/userinfo/v3/user/filter/:skip/:limit', C.UserController.list_skip_limit);
router.put('/beautifulreading/userinfo/v3/user/all/:skip/:limit', C.UserController.all_skip_limit);
router.get('/beautifulreading/userinfo/v3/user/:user_id/:skip/:limit', C.UserController.findOthers);
router.get('/beautifulreading/userinfo/v3/user/user_id/:user_id', C.UserController.findByUserId);
router.get('/beautifulreading/userinfo/v3/user/:mobile_number/:mobile_number', C.UserController.findByMobileNumber);

router.post('/beautifulreading/userinfo/v3/third', C.ThirdController.save);
router.put('/beautifulreading/userinfo/v3/third', C.ThirdController.save);
router.put('/beautifulreading/userinfo/v3/third/filter', C.ThirdController.list);
router.put('/beautifulreading/userinfo/v3/third/filter/:skip/:limit', C.ThirdController.list_skip_limit);
router.get('/beautifulreading/userinfo/v3/third/:user_id/:skip/:limit', C.ThirdController.findOthers);
router.get('/beautifulreading/userinfo/v3/third/user_id/:user_id', C.ThirdController.findByUserId);
router.get('/beautifulreading/userinfo/v3/third/open_id/:open_id', C.ThirdController.findByOpenId);
router.get('/beautifulreading/userinfo/v3/third/:mobile_number/:mobile_number', C.ThirdController.findByMobileNumber);
// 新的注册、登录接口
router.post('/sign_up', C.User2Controller.signUp);
router.post('/sign_in', C.User2Controller.signIn);
router.get('/refresh_token', C.User2Controller.refreshToken);

// 管理员登录
router.get('/admin/username/:username/password/:password', C.AdminController.auth);
// 管理员令牌兑换信息
router.get('/admin/token/:token', C.AdminController.getAdminByToken);

// 获取多个用户的信息，当前提供给客户端的一个查询多个用户信息的接口
router.get('/users', Tools.isValidUser, C.UserController.getUsersInfo);
// 获取某个用户的信息
// router.get('/user/:user_id', Tools.isValidUser, C.User2Controller.readOne);
router.get('/user/:user_id', C.User2Controller.readOne);
// 开放给分享的获取用户信息接口
// router.get('/user/share/:user_id', C.User2Controller.readOneShare);
router.get('/user/share/:user_id', C.UserextController.findByUserId);
// router.get('/user', Tools.isValidUser, C.User2Controller.search);
// 放回当前用户信息
router.get('/profile', Tools.isValidUser, C.User2Controller.readCurrent);
// 发送验证码
router.post('/captcha', C.ValidateController.sendCaptcha);
// 重置密码
router.put('/reset_password', Tools.isValidUser, C.User2Controller.resetPassword);
router.put('/forget_password', C.User2Controller.forgetPassword);

router.get('*', function*(){
    this.body = '404';
});
module.exports = router;
