(function (Job) {
    'use strict';

    var async = require('async');

    var logger = require('./logger'),
        nodebb = require('./nodebb'),
        users  = require('./users'),
        db     = nodebb.db;

    var working     = false,
        startAt     = null,
        endAt       = null,

        // Memory storage
        usersCount  = 0,
        topicsCount = 0,
        postsCount  = 0;

    Job.start = function (done) {
        if (working) {
            return done(new Error('Job is in progress. You can not start another'));
        }

        working = true;
        startAt = Date.now();
        endAt = null;

        async.parallel({
            reset : async.apply(users.reset),
            users : async.apply(db.getObjectField, 'global', 'userCount'),
            topics: async.apply(db.getObjectField, 'global', 'topicCount'),
            posts : async.apply(db.getObjectField, 'global', 'postCount')
        }, function (error, result) {
            working = false;
            endAt = Date.now();

            if (error) {
                return done(error);
            }

            usersCount = result.users;
            topicsCount = result.topics;
            postsCount = result.posts;

            done(null);
        });
    };

})(module.exports);
