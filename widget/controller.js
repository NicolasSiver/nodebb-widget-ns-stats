(function (Controller) {

    var async   = require('async'),
        CronJob = require('cron').CronJob,
        fs      = require('fs'),
        path    = require('path');

    var job         = require('./job'),
        logger      = require('./logger'),
        nodebb      = require('./nodebb'),
        nconf       = nodebb.nconf,
        templatesJs = nodebb.templates,
        Templates   = require('./templates'),
        users       = require('./users');

    var app       = null,
        cronJob   = null,
        templates = null;

    Controller.deferStart = function (done) {
        // Postpone initial Job,
        setTimeout(function defer() {
            job.start(function (error) {
                if (error) {
                    return logger.log('error', 'Initial error has occurred. %s', error);
                }
                logger.log('verbose', 'Initial job is started');
            });
        }, 500 + Math.random() * 2500);
        done(null);
    };

    Controller.dispose = function (done) {
        if (cronJob !== null) {
            logger.log('warn', 'Cron Job is disposed');
            cronJob.stop();
            cronJob = null;
        }
        done(null);
    };

    Controller.getWidgets = function (widgets, done) {
        widgets.push({
            name       : 'Stats',
            widget     : 'ns_stats',
            description: "Different general metrics about your forum: posts, topics, users",
            content    : templates[Templates.SETTINGS].data
        });

        done(null, widgets);
    };

    Controller.loadData = function (done) {
        users.restore(done);
    };

    Controller.loadTemplates = function (done) {
        if (templates !== null) {
            logger.log('warn', 'Templates are already loaded');
            return done(null);
        }

        templates = {};
        templates[Templates.SETTINGS] = {uri: 'widgets/stats/settings.tpl', data: undefined};
        templates[Templates.VIEW] = {uri: 'widgets/stats/view.tpl', data: undefined};

        async.each(Object.keys(templates), function (name, next) {
            var template = templates[name];
            fs.readFile(path.resolve(__dirname, '../public/templates', template.uri), function (error, content) {
                if (error) {
                    logger.log('error', 'Template Error has occurred, message: %s', error.message);
                    return next(error);
                }
                template.data = content.toString();
                logger.log('verbose', 'Widget Template "%s" is loaded', name);
                next(null);
            });
        }, done);
    };

    Controller.registerOnlineUser = function (uid, done) {
        users.online(parseInt(uid), done);
    };

    Controller.renderWidget = function (widget, done) {
        // Settings to access
        // widget.data.something;

        async.parallel({
            stats : async.apply(job.getCurrentStats),
            today : async.apply(users.getToday),
            online: async.apply(users.getOnline)
        }, function (error, data) {
            if (error) {
                return done(error);
            }
            data.relative_path = nconf.get('relative_path');
            data.visitorsTitle = widget.data.visitorsTitle || 'Visitors Today';
            data.onlineTitle = widget.data.onlineTitle || 'Who\'s Online';
            done(null, templatesJs.parse(templates[Templates.VIEW].data, data));
        });
    };

    Controller.setParams = function (params, done) {
        var router      = params.router,
            middleware  = params.middleware,
            controllers = params.controllers;

        app = params.app;
        done(null);
    };

    Controller.setupCron = function (done) {
        if (cronJob !== null) {
            logger.log('warn', 'Cron Job is installed already');
            return done(null);
        }

        // Runs every day
        // at 00:15 AM
        cronJob = new CronJob('00 15 0 * * *', function () {
                logger.log('verbose', 'Job is launched');
                job.start(function (error) {
                    if (error) {
                        return logger.log('error', '%s', error);
                    }
                    logger.log('verbose', 'Job is finished');
                });
            }, null, true
        );

        done(null);
    };

})(module.exports);
