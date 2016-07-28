'use strict';
/* jshint node: true */

const jwt = require('jsonwebtoken');
const C = require('../../../config/config');
const E = require('./error');


exports.redis = {
	get: function(key) {
		return new Promise(function(resolve, reject) {
			redis.get(key, function(err, data) {
				if (err) reject(err);
				else resolve(data);
			});
		});
	},
	set: function(key, value) {
		return new Promise(function(resolve, reject) {
			redis.set(key, value, function(err) {
				if (err) reject(err);
				else resolve(true);
			});
		});
	},
	hset: function(key, sub, value) {
		return new Promise(function(resolve, reject) {
			redis.hset(key, sub, value, function(err) {
				if (err) reject(err);
				else resolve(true);
			});
		});
	},
	hget: function(key, sub) {
		return new Promise(function(resolve, reject) {
			redis.hget(key, sub, function(err, replies) {
				if (err) reject(err);
				else resolve(replies);
			});
		});
	},
	hmset: function(key, obj) {
		return new Promise(function(resolve, reject) {
			redis.HMSET(key, obj, function(err) {
				if (err) reject(err);
				else resolve(true);
			});
		});
	},
	hgetall: function(key) {
		return new Promise(function(resolve, reject) {
			redis.hgetall(key, function(err, obj) {
				if (err) reject(err);
				else resolve(obj);
			});
		});
	},
	hkeys: function(key) {
		return new Promise(function(resolve, reject) {
			redis.hkeys(key, function(err, replies) {
				if (err) reject(err);
				else resolve(replies);
			});
		});
	},
	del: function(key) {
		return new Promise(function(resolve, reject) {
			redis.del(key, function(err) {
				if (err) reject(err);
				else resolve(true);
			});
		});
	},
	type: function(key) {
		return new Promise(function(resolve, reject) {
			redis.type(key, function(err, value) {
				if (err) reject(err);
				else resolve(value);
			});
		});	
	},
	expire: function(key, expire) {
		return new Promise(function(resolve, reject) {
			redis.expire(key, expire, function(err) {
				if (err) reject(err);
				else resolve(true);
			});
		});	
	} 
};


/**
 * 验证令牌
 *
 * @param token string 令牌
 * @return object err|decoded 错误或解密后的内容
 */
var verifyToken = function(token) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, C.jwt.secret, {
            algorithm: C.jwt.algorithm,
            // audience: C.jwt.audience,
            // issuer: C.jwt.issuer,
            // ignoreExpiration: C.jwt.ignoreExpiration,
            // ignoreNotBefore: C.jwt.ignoreNotBefore,
        }, function(err, decoded) {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;

/**
 * 生成令牌
 *
 * @param payload 加密的内容
 * @return string 令牌
 */
exports.signToken = function(payload, expiresIn) {
    // payload.time = new Date(0);
    return new Promise(function(resolve) {
        jwt.sign(payload, C.jwt.secret, {
            algorithm: C.jwt.algorithm,
            expiresIn: expiresIn || C.jwt.expiresIn
            // audience: C.jwt.audience,
            // issuer: C.jwt.issuer,
            // ignoreExpiration: C.jwt.ignoreExpiration,
            // ignoreNotBefore: C.jwt.ignoreNotBefore,
        }, function(token) {
            resolve(token);
        });
    });
};

exports.f = function(func, error) {
	error = error || {};
	return function*() {
		try {
			yield func.apply(this, [].slice.call(arguments));
		} catch (e) {
			console.log(e.stack);
			let obj = error[e.message] || E[e.message] || {message: C.debug ? e.stack : '未知异常', status: 500};
			if (typeof obj.message === 'string') {
				obj.message = {
					code: 1,
					message: obj.message
				};
			}
			this.send(obj.status, obj.message);
		}
	};
};

exports.sendEmail = function(email, title, text, html) {
    return new Promise(function(resolve, reject) {
        var nodemailer = require('nodemailer');

        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            host: C.smtp.host,
            port: C.smtp.port,
            secure: true,
            auth: {
                user: C.smtp.address,
                pass: C.smtp.password
            }
        });

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: `"${C.smtp.name}" <${C.smtp.address}>`, // sender address
            to: email,
            subject: title,
            text: text,
            html: html
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                reject(error);
            } else {
                console.log('Message sent: ' + info.response);
                resolve(true);
            }
        });
    });
};