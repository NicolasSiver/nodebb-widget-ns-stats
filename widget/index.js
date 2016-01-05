(function (Widget) {
    'use strict';

    var async = require('async');

    var controller = require('./controller'),
        job        = require('./job'),
        logger     = require('./logger');

    Widget.hooks = {
        actions: {
            pluginDeactivate: function (pluginId) {
                if (pluginId === require('../plugin.json').id) {
                    controller.dispose(function (error) {
                        if (error) {
                            return logger.log('error', '%s', error);
                        }
                        logger.log('verbose', 'Plugin deactivation: everything is disposed');
                    });
                }
            }
        },
        filters: {
            clearRequireCache: function (data, callback) {
                controller.dispose(function (error) {
                    if (error) {
                        logger.log('error', '%s', error);
                        return callback(error);
                    }
                    callback(null, data);
                });
            },

            getWidgets: controller.getWidgets,

            renderWidget: controller.renderWidget
        },
        statics: {
            load: function (params, callback) {
                async.series([
                    async.apply(controller.setParams, params),
                    async.apply(controller.loadTemplates),
                    function initialJob(next) {
                        // Postpone initial Job,
                        // we already have to much stuff to do at forum's boot stage
                        setTimeout(function defer() {
                            job.start(function (error, users) {
                                if (error) {
                                    return logger.log('error', 'Initial error has occurred. %s', error);
                                }
                                logger.log('verbose', 'Initial job is finished, birthdays: %d', users.length);
                            });
                        }, 500 + Math.random() * 2500);
                        next(null);
                    },
                    async.apply(controller.setupCron)
                ], function (error) {
                    if (error) {
                        return callback(error);
                    }
                    logger.log('verbose', 'Widget is initiated successfully');
                    callback(null);
                });
            }
        }
    };

})(module.exports);
