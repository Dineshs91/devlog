'use strict';

var pkg = require("./package.json");

var NW_VERSION = "0.12.0";

module.exports = function(grunt) {
    if (grunt.file.exists('tasks')) {
        grunt.loadTasks('tasks');
    }
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-github-releaser');
    grunt.loadNpmTasks('grunt-nw-builder');

    grunt.initConfig({
        pkg: pkg,
        jshint: {
            all: ['app/js/**/*.js', 'test/unit/**/*.js', 'test/e2e/**/*.js']
        },
    	nwjs: {
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
                '!./node_modules/grunt-*/**',
                '!./node_modules/grunt/**',
                '!./node_modules/karma-*/**',
                '!./node_modules/karma/**',
                '!./node_modules/nodewebkit/**',
                '!./node_modules/protractor/**',
                '!./test_out/**',
                '!./cache/**',
                '!./scripts/**',
                '!./tasks/**'
            ]
    	},
        clean: {
            build: ['build/'],
        },
        exec: {
            build_osx64_release: {
                command: "./scripts/build_osx64.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_linux64_release: {
                command: "./scripts/build_linux64.sh",
                cwd: './',
                stdout: true,
                stderr: true
            },
            build_win64_release: {
                command: "./scripts/build_win64.sh",
                cwd: './',
                stdout: true,
                stderr: true
            }
        },
        "github-release": {
            options: {
                repository: 'Dineshs91/devlog',
                auth: {
                    user: 'Dineshs91',
                    password: ''
                },
                release: {
                    tag_name: pkg.version,
                    name: pkg.version,
                    draft: true,
                    prerelease: false
                }
            },
            files: {
                src: [
                    "./build/devlog-linux64.tar.gz",
                    "./build/devlog-osx64.dmg",
                    "./build/devlog-win64.zip"
                ],
            },
        }
    });
    
    grunt.registerTask('setup', [
       'e2e-setup'
    ]);
    
    grunt.registerTask('default', [
        'clean:build',
        'nwjs'
    ]);
    
    // Release tasks
    grunt.registerTask('build-osx64', [
        'exec:build_osx64_release'
    ]);
    
    grunt.registerTask('build-linux64', [
        'exec:build_linux64_release'
    ]);
    
    grunt.registerTask('build-win64', [
        'exec:build_win64_release'
    ]);
    
    grunt.registerTask('build-all', [
        'default',
        'exec:build_osx64_release',
        'exec:build_linux64_release',
        'exec:build_win64_release'
    ]);
    
    grunt.registerTask('release', [
        'github-release'
    ]);
    
    grunt.registerTask('publish', [
        'build-all',
        'release'
    ]);
}