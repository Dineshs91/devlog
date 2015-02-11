module.exports = function(grunt) {
    grunt.registerTask('e2e-setup', 'Setup for running e2e tests', function() {
        var fs = require('fs');
        var path = require('path');
        var config = require('../config/platform-config.js');

        var support_dir = 'test/support';
        var symLinkDest = path.resolve(support_dir, config.devSymlink.file);
        var chromeDriverFile = path.resolve(support_dir, 'chromedriver');

        var supportDirExists = fs.existsSync(support_dir);
        var symLinkExists = fs.existsSync(symLinkDest);
        var chromeDriverExists = fs.existsSync(chromeDriverFile);

        if(supportDirExists && symLinkExists && chromeDriverExists) {
            return;
        }

        var done = this.async();
        var http = require('http');
        var unzip = require('unzip');
        var symLinkFile = config.devSymlink.file;
        var symLinkPath = path.normalize(config.devSymlink.path);
        var symLinkSrc = path.resolve(symLinkPath, symLinkFile);
        var chromeDriverUrl = config.chromedriverDownload;
        var packageName = config.chromedriverDownload.split('/').pop();
        var chromeDriverLocal = path.resolve(support_dir, packageName);

        var chromeDriverLocalExists = fs.existsSync(chromeDriverLocal);

        var download = function(url, dest, cb, cbdone) {
            var file = fs.createWriteStream(dest);
            http.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    cb(cbdone);
                });
            });
        };

        var extractChromedriver = function(cbdone) {
            grunt.log.writeln('Extracting node-webkit chromedriver.');

            if (config.platform === 'linux') {
                var targz = require('tar.gz');
                var compress = new targz().extract(chromeDriverLocal, support_dir, function(err) {
                    if(err)
                        console.log(err);

                    var cdSrc = path.resolve(chromeDriverLocal.replace(/\.tar\.gz$/, ''), 'chromedriver');
                    fs.renameSync(cdSrc, chromeDriverFile);
                    grunt.log.writeln('e2e setup is complete.');
                    cbdone();
                });
            } else {
                fs.createReadStream(chromeDriverLocal)
                    .pipe(unzip.Parse())
                    .on('entry', function (entry) {
                        if (entry.path.indexOf('/chromedriver') >= 0) {
                            entry.pipe(fs.createWriteStream(chromeDriverFile));
                        } else {
                            entry.autodrain();
                        }
                    })
                    .on('finish', function() {
                        fs.chmodSync(chromeDriverFile, 0755);
                        grunt.log.writeln('e2e setup is complete.');
                        cbdone();
                    });
            }
        };

        if(!supportDirExists) {
            grunt.log.writeln('Creating support directory.');
            fs.mkdir(support_dir);
        }

        if(!symLinkExists) {
            grunt.log.writeln('Creating symbolic link to node-webkit.');
            fs.symlinkSync(symLinkSrc, symLinkDest);
        }

        if(!chromeDriverExists) {
            if(chromeDriverLocalExists) {
                grunt.log.writeln('Skipping download as package already exists.');
                extractChromedriver(done);
            } else {
                grunt.log.writeln('Downloading node-webkit chromedriver.');
                download(
                    chromeDriverUrl,
                    chromeDriverLocal,
                    extractChromedriver,
                    done
                );
             }
        }

    });
};