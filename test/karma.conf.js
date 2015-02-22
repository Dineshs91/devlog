module.exports = function(config) {
    config.set({

        basePath: '../',
        
        files: [
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/js/**/*.js',
            'test/unit/**/*.js'
        ],

        autoWatch: true,

        frameworks: ['jasmine'],

        browsers: ['NodeWebkit'],

        plugins: [
            'karma-jasmine',
            'karma-nodewebkit-launcher',
            'karma-coverage',
            'karma-junit-reporter'
        ],

        preprocessors: {
          'app/js/**/*.js': 'coverage',
        },

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },

        coverageReporter: {
            type: 'html',
            dir: 'test/coverage/'
        },

        reporters: ['progress', 'coverage', 'junit'],

        logLevel: config.LOG_INFO
    
    });
};