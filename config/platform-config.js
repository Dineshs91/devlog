'use strict'

var _ = require('lodash');
var platform = require('os').platform();
var raw_config = require('./platform.json');

var getIndex = function(value) {
    return value === platform;
};

var getConfig = function(options, key, config) {
    return [key, key == 'index' ? config.index : options[config.index]];
};

raw_config.index = _.findIndex(raw_config.platform, getIndex);

module.exports = _.object(_.map(raw_config, getConfig));

