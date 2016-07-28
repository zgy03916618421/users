'use strict';

const request = require('request');
const assert = require('assert');
const ObjectId = require('mongodb').Schema.ObjectId;
const MongoClient = require('mongodb').MongoClient;
const host = process.env.USER_PRE_HOST.replace(/\/\//, '//loser:england@');
const U = require('../src/curd/utils/util');

let url = 'mongodb://192.168.100.2:27017/bookshelf', db;
MongoClient.connect(url, function(err, ret) {
  	if (err) throw err;
  	db = ret;
});

function generateEmail() {
	let key = U.randomString(20);
	let domain = U.randomString(8);
	return `${key}@${domain}.com`;
}

function generateMobile() {
	return 1 + U.randomString(10);
}

function generateImageUrl() {
	return 'http://image.com/' + U.randomString(20) + '.jpg';
}

describe('注册登录流程接口单元测试', function() {
	describe('通过电子邮箱注册普通用户', function() {
		let api = `${host}/yuedu/userinfo/v3/user/email`;
		let mobile = generateMobile();
		let password = '123456';
		let avatar = generateImageUrl();
		let sex = ['male', 'female'][~~(Math.random() * 2)];

		it('注册普通用户，注册成功返回用户个人信息', function(done) {
			let email = generateEmail();
			request({
				url: api,
				method: 'POST',
				headers: [{
					name: 'Content-Type',
					value: 'application/json'
				}],
				form: {
					email: email,
					password: password,
					avatar: avatar,
					sex: sex
				}
			}, function(err, res, body) {
				if (err) throw err;
				assert.equal(res.statusCode, 200, '失败');
				body = JSON.parse(body);
				assert(body, '内容为空');
				assert(body.data, '内容实体为空');
				assert(body.data.user_id, '用户ID为空');
				assert(!body.data.password, '不应该返回密码');
				assert.equal(body.data.email, email, '邮箱错误');
				assert.equal(body.data.avatar, avatar, '用户头像错误');
				assert.equal(body.data.sex, sex, '用户性别错误');
				assert.equal(body.data.type, 'user', '用户类型错误');
				db.collection('user').remove({email: email}, function(err, ret) {
					if (err) throw err;
					done();
				});
			});
		});
		it('注册机构用户，注册成功返回用户个人信息', function(done) {
			let email = generateEmail();
			request({
				url: api,
				method: 'POST',
				headers: [{
					name: 'Content-Type',
					value: 'application/json'
				}],
				form: {
					email: email,
					password: password,
					avatar: avatar,
					sex: sex,
					type: 'organization'
				}
			}, function(err, res, body) {
				if (err) throw err;
				assert.equal(res.statusCode, 200, '失败');
				body = JSON.parse(body);
				assert(body, '内容为空');
				assert(body.data, '数据实体为空');
				assert(body.data.user_id, '用户ID为空');
				assert(!body.data.password, '不应该返回密码');
				assert.equal(body.data.email, email, '邮箱与注册的不一致');
				assert.equal(body.data.avatar, avatar, '用户头像错误');
				assert.equal(body.data.sex, sex, '用户性别错误');
				assert.equal(body.data.type, 'organization', '邮箱与注册的不一致');
				db.collection('user').remove({email: email}, function(err) {
					if (err) throw err;
					done();
				});
			});
		});
	});
});