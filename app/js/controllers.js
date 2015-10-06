var devlog = angular.module('devLog', []);

devlog.directive('currentTime', ['$interval', 'dateFilter',
    function($interval, dateFilter) {

    return function(scope, element, attrs) {
      var format,  // date format
          stopTime; // so that we can cancel the time updates

      // used to update the UI
      function updateTime() {
        element.text(dateFilter(new Date(), format));
      }

      // watch the expression, and update the UI on change.
      scope.$watch(attrs.currentTime, function(value) {
        format = value;
        updateTime();
      });

      stopTime = $interval(updateTime, 1000);

      // listen on DOM destroy (removal) event, and cancel the next UI update
      // to prevent updating time after the DOM element was removed.
      element.on('$destroy', function() {
        $interval.cancel(stopTime);
      });
    };
}]);

devlog.controller('LogController', ['$scope', '$timeout', 'dbService', function($scope, $timeout, dbService) {
    $scope.format = 'M/d/yy hh:mm:ss a';
    $scope.logSelectedIndex = -1;
    $scope.tagSelectedIndex = -1;
    var currentSelectedTag = '';
    
    var self = this;
    
    this.getAllLogs = function() {
        return dbService.getAllLogs().then(function(logs) {
            logs = sortLogs(logs);
            $scope.logs = logs;
        });
    };
    
    this.getAllTags = function() {
        return dbService.getAllTags().then(function(tags) {
            tags = sortTags(tags);

            var index = tags.map(function(tag) { return tag.tag; }).indexOf('all');
            var allTag = tags[index];
            tags.splice(index, 1);

            // Move 'ALL' tag to the beginning.
            tags.unshift(allTag);
            $scope.tags = tags;
        });
    };
    
    this.addFn = function() {
        var time = (new Date()).getTime();

        newLog = {
            'title': '',
            'content': '',
            'created_on': time,
            'updated_on': time,
            'is_removed': false,
            'tags': []
        };

        for(var i = 0; i < $scope.logs.length; i++) {
            var log = $scope.logs[i];
            if(log.key === undefined) {
                // Since already a new log is present
                return;
            }
        }

        logs = $scope.logs;
        logs.unshift(newLog);
        $scope.logs = logs;

        $scope.logSelectedIndex = 0;
        var logSelectedIndex = $scope.logSelectedIndex;
        if(currentSelectedTag !== ''  && currentSelectedTag !== 'all') {
            $scope.logs[logSelectedIndex].tags = currentSelectedTag;
        }
    };
    
    this.clickTagFn = function($index, tagName) {
        currentSelectedTag = $scope.tags[$index].tag;

        $scope.tagSelectedIndex = $index;
        $scope.logSelectedIndex = 0;

        if(tagName === 'all') {
            self.getAllLogs();
        } else {
            dbService.getLogsWithTag(tagName).then(function(logs) {
                logs = sortLogs(logs);
                $scope.logs = logs;
            });
        }
        
    };
    
    this.clickLogFn = function(log) {
        // $index is very error prone. It can be used
        // if we don't use orderBy or filter. Its best
        // to use indexOf which works in all the cases.
        var index = $scope.logs.indexOf(log);

        $scope.logSelectedIndex = index;
    };
    
    this.removeLogFn = function(key) {

        // If key is null, then it is a new log
        // without any data and it has not been
        // saved.
        if(key === undefined) {
            for(var i = 0; i < $scope.logs.length; i++) {
                var log = $scope.logs[i];
                if(log.key === undefined) {
                    $scope.logs.splice(i, 1);
                    return;
                }
            }
        }

        dbService.removeLogAndTag(key).then(function() {
            $scope.$broadcast('logRemoved');

            if(currentSelectedTag !== 'all') {
                $scope.tagSelectedIndex = findTagIndex($scope.tags, currentSelectedTag);

                dbService.getLogsWithTag(currentSelectedTag).then(function(logs) {
                    if(logs.length === 0) {
                        $scope.tagSelectedIndex = 0;
                        self.getAllLogs();
                    } else {
                        logs = sortLogs(logs);
                        $scope.logs = logs;
                    }
                });
            } else {
                $scope.tagSelectedIndex = 0;
                self.getAllLogs();
            }

            $scope.logSelectedIndex = 0;

            self.getAllTags();
        });
    };
    
    this.saveFn = function() {
        var logSelectedIndex = $scope.logSelectedIndex;
        var logKey = $scope.logs[logSelectedIndex].key;
        var action = 'insert';

        if(logKey !== null && logKey !== undefined && logKey.trim() !== '') {
            action = 'update';
        }

        log = formLogDoc(action);
        
        $scope.isSaving = true;
        
        // check if selectedTag is present
        // if removed select the first tag
        // in the log
        if(currentSelectedTag !== 'all' && log.tags.indexOf(currentSelectedTag) === -1) {
            currentSelectedTag = log.tags[0];
        }

        if(logKey !== null && logKey !== undefined && logKey.trim() !== '') {
            log.key = logKey;
            dbService.updateLogAndTag(log).then(function() {
                save();
            });
        } else {
            dbService.insertLogAndTag(log).then(function() {
                save();
            });
        }
    };
    
    this.changedFn = function() {
        myTimer.clear();
        myTimer.set();
    };

    var myTimer = function() {
        var timer;
        this.set = function() {
            $scope.isSaved = false;
            timer = $timeout(self.saveFn, 2000);
        };

        this.clear = function() {
            $timeout.cancel(timer);
        };

        return this;
    }();

    var save = function() {
        $scope.isSaving = false;
        $scope.isSaved = true;
        $timeout(function() {
            $scope.isSaved = false;
        }, 1000);

        self.getAllTags();
        
        
        if(currentSelectedTag === '' || currentSelectedTag === 'all') {
            self.getAllLogs();

            $scope.tagSelectedIndex = findTagIndex($scope.tags, currentSelectedTag);
        } else {
            dbService.getLogsWithTag(currentSelectedTag).then(function(logs) {
                $scope.logs = logs;
                logs = sortLogs(logs);

                $scope.tagSelectedIndex = findTagIndex($scope.tags, currentSelectedTag);
            });
        }
    };
    
    var findTagIndex = function(tags, value) {
        for(var i = 0; i < tags.length; i++) {
            if(tags[i].tag === value) {
                return i;
            }
        }
        
        return -1;
    };
    
    var formLogDoc = function(action) {
        var logSelectedIndex = $scope.logSelectedIndex;
        var tags = $scope.logs[logSelectedIndex].tags;

        if(tags.length === 0) {
            formedTags = [];
        } else if(Array.isArray(tags)) {
            formedTags = tags;
        } else {
            tags = tags.trim().toLowerCase();
            if(tags.slice(-1) === ',') {
                tags = tags.substr(0, tags.length - 1);
            }
            var re = /\s*,\s*/;
            formedTags = tags.split(re);
        }

        /*
            'All' tag is implicitly available in all logs.
            So remove any explicit usage of it.
        */
        var remIndex = formedTags.indexOf('all');
        if(remIndex > -1) {
            formedTags.splice(remIndex, 1);
        }

        var created_on = $scope.logs[logSelectedIndex].created_on;
        var updated_on = (new Date()).getTime();

        if(action === 'insert') {
            created_on = updated_on;
        }

        log = {
            'title': $scope.logs[logSelectedIndex].title,
            'content': $scope.logs[logSelectedIndex].content,
            'created_on': created_on,
            'updated_on': updated_on,
            'is_removed': false,
            'tags': formedTags
        };
        return log;
    };
    
    /*
        Sorting logs in descending order based on timestamp.
    */
    var sortLogs = function(logs) {
        return logs.sort(function(a, b) {
            return parseFloat(b.created_on) - parseFloat(a.created_on);
        });
    };
    
    /*
        Sorting tags alphabetically.
    */
    var sortTags = function(tags) {
        return tags.sort(function(a, b) {
            var tagA = a.tag.toLowerCase();
            var tagB = b.tag.toLowerCase();
            if(tagA < tagB) {
                return -1;
            }
            if(tagA > tagB) {
                return 1;
            }
            return 0;
        });
    };
    
    /*
        Insert ALL tag when the app starts.
    */
    var insertAllTag = function() {
        var tag = {
            'tag': 'all'
        };
        
        return dbService.findTag('all').then(function(tags) {
            if(tags.length === 0) {
                return dbService.insertTag(tag);
            }
        });

    };
    
    /*
        Initialize the app. Display the latest log in 'ALL' tag.
        Selection: 'ALL' tag and latest log.
    
        Used only when the app starts.
    */
    var init = function() {
        insertAllTag().then(function() {
            self.getAllLogs().then(function() {
                $scope.logSelectedIndex = 0;
            });
            
            self.getAllTags().then(function() {
                $scope.tagSelectedIndex = 0;
                currentSelectedTag = $scope.tags[0].tag;
            });
        });
    };
    
    /*
        Initialize when init event is emitted.
    */
    $scope.$on('init', function(event, args) {
        init();
    });

    init();
}]);

devlog.controller('RemovedLogController', ['$scope', '$q', 'dbService', function($scope, $q, dbService) {
    var self = this;
    
    this.getAllRemovedLogs = function() {
        return dbService.getAllRemovedLogs().then(function(remLogs) {
            $scope.remLogs = remLogs;
        });
    };
    
    this.proceedFn = function() {
        var promise = [];

        for(var i = 0; i < $scope.remLogs.length; i++) {
            // log.option will not be inserted into db.
            // check updateLog function in services.js
            var option = $scope.remLogs[i].option;
            var log = $scope.remLogs[i];
            log.is_removed = false;

            if(option === 'restore') {
                promise.push(dbService.updateLogAndTag(log));
            } else if (option === 'delete') {
                promise.push(dbService.permanentDelete(log.key));
            }
        }

        $q.all(promise).then(function() {
            // Emit init event, so app is initialized
            // to reflect the restored logs.
            $scope.$emit('init');
            init();
        }).catch(function(err) {
            console.log(err);
        });
    };

    var init = function() {
        self.getAllRemovedLogs();
    };

    /*
        If any log is removed, logRemoved event is triggered.
        Reload removedLogs, which appear in restore/delete modal.
    */
    $scope.$on('logRemoved', function(event, args) {
        init();
    });

    init();
}]);