'use strict';

module.exports = function(grunt) {
    if (grunt.file.exists('tasks')) {
        grunt.loadTasks('tasks');
    }
    
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('setup', [
       'e2e-setup'
    ]);
    
    grunt.initConfig({
        jshint: {
            all: ['app/js/**/*.js', 'test/unit/**/*.js', 'test/e2e/**/*.js']
        } 
    });
}