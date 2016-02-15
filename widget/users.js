(function (Users) {
    'use strict';

    var async = require('async');

    var logger = require('./logger'),
        nodebb = require('./nodebb'),
        db     = nodebb.db,
        user   = nodebb.user;

    var online        = [],
        onlineIndex   = [],
        onlineCache   = 60000,  // 1 minute
        onlineStatus  = 900000, // 15 minutes
        onlineLimit   = 128,
        lastRequestAt = 0,
        storageKey    = 'widget:ns:stats',
        today         = [],
        todayIndex    = [];

    /**
     * Reduce cost of the operation via 60 sec cache
     * @param done {function}
     */
    Users.getOnline = function (done) {
        var now = Date.now();
        if (now - lastRequestAt > onlineCache) {
            var usersOnline, usersToFetch, usersInCache;
            async.waterfall([
                async.apply(db.getSortedSetRevRangeByScore, 'users:online', 0, onlineLimit, now, now - onlineStatus),
                function findNewIds(uids, next) {
                    usersOnline = uids.map(function (uid) {
                        return parseInt(uid);
                    });
                    usersInCache = [];
                    usersToFetch = usersOnline.filter(function (uid) {
                        var cache = onlineIndex.indexOf(uid) != -1;
                        if (cache) {
                            usersInCache.push(uid);
                        }
                        return !cache;
                    });
                    next(null, usersToFetch);
                },
                function fetchIfNeeded(uids, next) {
                    user.getUsersData(uids, next)
                },
                function composeUserList(users, next) {
                    lastRequestAt = now;
                    online = users.concat(online.filter(function (user) {
                        return usersInCache.indexOf(parseInt(user.uid)) != -1;
                    }));
                    online.sort(function (userA, userB) {
                        return userA.username.localeCompare(userB.username);
                    });
                    onlineIndex = usersOnline;

                    next(null, online);
                }
            ], done);
        } else {
            return done(null, online);
        }
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

                db.setObject(storageKey, {today: todayIndex.join(',')}, done);
            });
        } else {
            done(null);
        }
    };

    Users.reset = function (done) {
        today.length = 0;
        todayIndex.length = 0;
        db.delete(storageKey, done);
    };

    Users.restore = function (done) {
        async.waterfall([
            async.apply(db.getObject, storageKey),
            function fetchIfNeeded(data, next) {
                if (data != null && 'today' in data) {
                    next(null, data.today.split(',').map(function (uid) {
                        return parseInt(uid);
                    }));
                } else {
                    next(null, []);
                }
            },
            function fetchUsers(uids, next) {
                user.getUsersData(uids, next);
            },
            function compose(users, next) {
                users = users.filter(function (user) {
                    return !!user;
                });
                today = users;
                todayIndex = users.map(function (user) {
                    return parseInt(user.uid);
                });
                next(null);
            }
        ], done);
    };

})(module.exports);
