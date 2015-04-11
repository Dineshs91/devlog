'use strict';

var pkg = require("./package.json");

var NW_VERSION = "0.11.6";

module.exports = function(grunt) {
    if (grunt.file.exists('tasks')) {
        grunt.loadTasks('tasks');
    }
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    grunt.initConfig({
        pkg: pkg,
        jshint: {
            all: ['app/js/**/*.js', 'test/unit/**/*.js', 'test/e2e/**/*.js']
        },
    	nodewebkit: {
	        options: {
                appName: 'Devlog',
                appVersion: pkg.version,
	            platforms: ['osx64', 'linux64', 'win64'],
	            buildDir: './build',
                version: NW_VERSION,
                zip: false
	        },
	        src: [
                './**/*',
                '!./test/**',
                '!./node_modules/**',
                '!./test_out/**',
                '!./cache/**'
            ]
    	},
    });
    
    grunt.registerTask('setup', [
       'e2e-setup'
    ]);
    
    grunt.registerTask('default', ['nodewebkit']);
}