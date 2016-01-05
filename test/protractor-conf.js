'use strict';

var path = require('path');
var nw = require('nw');

exports.config = {
    chromeDriver: './support/chromedriver',
    directConnect: true,
    specs: ['e2e/**/*.js'],
    rootElement: 'html',
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            binary: nw.findpath()
        }
    },

    onPrepare: function() {
        // By default, Protractor use data:text/html,<html></html> as resetUrl, but 
        // location.replace (see http://git.io/tvdSIQ) from the data: to the file: protocol is not allowed
        // (we'll get ‘not allowed local resource’ error), so we replace resetUrl with one
        // with the file: protocol (this particular one will open system's root folder)
        browser.resetUrl = 'file://';

        // This isn't required and used to avoid ‘Cannot extract package’ error showed
        // before Protractor have redirected node-webkit to resetUrl.

        browser.driver.get('file://' + path.resolve('app/index.html'));
    }
};
