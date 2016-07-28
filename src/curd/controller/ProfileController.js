'use strict';

const E = require('../utils/error');
const U = require('../utils/util');
const C = require('../../../config/config');
const User2Service = require('../service/User2Service');

exports.read = function*() {
	this.status = 200;
	this.body = {message: '成功', data: this.user};
}