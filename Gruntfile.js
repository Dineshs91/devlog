'use strict';

module.exports = function(grunt) {
    if (grunt.file.exists('tasks')) {
        grunt.loadTasks('tasks');
    }

    grunt.registerTask('setup', [
       'e2e-setup'
    ]);
}