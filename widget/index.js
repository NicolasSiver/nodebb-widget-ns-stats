(function (Widget) {
    'use strict';

    var async = require('async');

    var controller = require('./controller'),
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
            },

            /**
             * @param payload will include 2 fields, 'uid' and 'timestamp'
             */
            userOnline: function (payload) {
                controller.registerOnlineUser(payload.uid, function (error) {
                    if (error) {
                        return logger.log('error', '%s', error);
                    }
                });
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
                    async.apply(controller.loadData),
                    async.apply(controller.deferStart),
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
