(function (Users) {
    'use strict';

    var async = require('async');

    var logger = require('./logger'),
        nodebb = require('./nodebb'),
        db     = nodebb.db,
        user   = nodebb.user;

    var online     = [],
        today      = [],
        todayIndex = [];

    Users.getOnline = function (done) {
        return done(null, online);
    };

    Users.getToday = function (done) {
        return done(null, today);
    };

    Users.online = function (uid, done) {
        if (todayIndex.indexOf(uid) == -1) {
            user.getUserData(uid, function (error, userData) {
                if (error) {
                    return done(error);
                }
                todayIndex.push(uid);
                today.push(userData);
                logger.log('verbose', 'User %d is online', uid);
                done(null);
            });
        } else {
            done(null);
        }
    };

    Users.reset = function (done) {
        today.length = 0;
        todayIndex.length = 0;
        done(null);
    };

})(module.exports);
