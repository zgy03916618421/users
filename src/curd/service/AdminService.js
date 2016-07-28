'use strict';

let H = require('../utils/helper');

exports.findByToken = function*(token) {
	let key = RedisKeys.ADMIN_MSG_TOKEN + token;
    return yield H.redis.get(key);
}