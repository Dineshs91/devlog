devlog.controller('LogController', ['$scope', '$timeout', '$filter', 'dbService', 'hotkeys',
    function($scope, $timeout, $filter, dbService, hotkeys) {

    $scope.format = 'M/d/yy hh:mm:ss a';
    $scope.tagSelectedIndex = -1;
    $scope.logIndex = 0;
    var currentSelectedTag = '';
    
    var self = this;
    
    this.getAllLogs = function() {
        return dbService.getAllLogs().then(function(logs) {
            $scope.logs = sortLogs(logs);
        });
    };
    
    this.getAllTags = function() {
        return dbService.getAllTags().then(function(tags) {
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

        displayLog(newLog);
        $scope.logIndex = 0;
        if(currentSelectedTag !== ''  && currentSelectedTag !== 'all') {
            $scope.currentLog.tags = currentSelectedTag;
        }
    };
    
    this.clickTagFn = function($index, tagName) {
        clickTagHelper($index, tagName);
    };

    var clickTagHelper = function(index, tagName) {
        currentSelectedTag = $scope.tags[index].tag;
        $scope.tagSelectedIndex = index;

        if(tagName === 'all') {
            self.getAllLogs().then(function() {
                displayLog($scope.logs[0]);
                $scope.logIndex = 0;
            });
        } else {
            dbService.getLogsWithTag(tagName).then(function(logs) {
                $scope.logs = sortLogs(logs);
                displayLog(logs[0]);
                $scope.logIndex = 0;
            });
        }   
    };

    this.clickLogFn = function($index, log) {
        $scope.logIndex = $index;
        displayLog(log);
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
                    displayLog($scope.logs[0]);
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
                        $scope.logs = logs;
                    }
                    $scope.logIndex = 0;
                    displayLog(logs[0]);
                });
            } else {
                $scope.tagSelectedIndex = 0;
                self.getAllLogs().then(function() {
                    $scope.logIndex = 0;
                    displayLog($scope.logs[0]);
                });
            }

            self.getAllTags();
        });
    };
    
    this.saveFn = function() {
        var logKey = $scope.currentLog.key;
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

    this.clearTagSearch = function() {
        $scope.tagSearch = '';
    };

    this.clearLogSearch = function() {
        $scope.logSearch = '';
    };

    var tagChange = function() {
        var filteredTags = $filter('filter')($scope.tags, $scope.tagSearch);
        var index = 0;

        if(filteredTags !== null && filteredTags !== undefined && filteredTags.length !== 0) {
            tagName = filteredTags[index].tag;
            clickTagHelper(index, tagName);
        }
        logChange();
    };

    var logChange = function() {
        var filteredLogs = $filter('filter')($scope.logs, $scope.logSearch);
        if(filteredLogs !== null && filteredLogs !== undefined && filteredLogs.length !== 0) {
            $scope.logIndex = 0;
            displayLog(filteredLogs[0]);
        }
    };

    $scope.$watch('tagSearch', tagChange);
    $scope.$watch('logSearch', logChange);
    
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

    var displayLog = function(log) {
        $scope.currentLog = log;
    };

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
        var tags = $scope.currentLog.tags;

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

        var created_on = $scope.currentLog.created_on;
        var updated_on = (new Date()).getTime();

        if(action === 'insert') {
            created_on = updated_on;
        }

        log = {
            'title': $scope.currentLog.title,
            'content': $scope.currentLog.content,
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
            self.getAllTags().then(function() {
                $scope.tagSelectedIndex = 0;
                currentSelectedTag = $scope.tags[0].tag;
            });

            self.getAllLogs().then(function() {
                displayLog($scope.logs[0]);
            });
        });
    };
    
    /*
        Initialize when init event is emitted.
    */
    $scope.$on('init', function(event, args) {
        init();
    });

    // Act on menu events (Save or Add new log)
    $scope.$on('save-log', function(event, args) {
        self.saveFn();
    });

    $scope.$on('add-log', function(event, args) {
        self.addFn();
    });

    hotkeys.add({
        combo: 'mod+s',
        description: 'Save current log',
        callback: function() {
            self.saveFn();
        },
        allowIn: ['INPUT', 'TEXTAREA']
    });

    hotkeys.add({
        combo: 'mod+n',
        description: 'Add new log',
        callback: function() {
            self.addFn();
        },
        allowIn: ['INPUT', 'TEXTAREA']
    });

    init();
}]);
