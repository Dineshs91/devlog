devlog.controller('LogController', ['$scope', '$timeout', '$filter', 'dbService', 'hotkeys',
    function($scope, $timeout, $filter, dbService, hotkeys) {

    $scope.format = 'M/d/yy hh:mm:ss a';
    $scope.logOrder = '-created_on';
    $scope.currentSelectedTag = '';
    $scope.currentSelectedLogKey = '';
    
    var self = this;

    var selectAndDisplay = function(sdLog, sdTagName, sdAction) {
        // Logic based on actions.
        if(sdAction === "LOG_REMOVE" || sdAction === "INIT" || sdAction === "CLICK_TAG") {
            var orderedLogs = $filter('orderBy')($scope.logs, $scope.logOrder);
            sdLog = orderedLogs[0];
        }

        // Selection of tag and log.
        $scope.currentSelectedTag = sdTagName;

        if (sdLog !== undefined)
            $scope.currentSelectedLogKey = sdLog.key;

        // Display log.
        displayLog(sdLog);
    };
    
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

        var currentSelectedTag = $scope.currentSelectedTag;

        var sdLog = newLog;
        var sdTagName = currentSelectedTag;
        var sdAction = "ADD_LOG";
        selectAndDisplay(sdLog, sdTagName, sdAction);

        // If a new log is added from a tag other than all
        // the selected tag will be added by default to
        // the new log.
        if(currentSelectedTag !== ''  && currentSelectedTag !== 'all') {
            $scope.currentLog.tags = currentSelectedTag;
        }
    };
    
    this.clickTagFn = function($index, tagName) {
        clickTagHelper($index, tagName);
    };

    var clickTagHelper = function(index, tagName) {
        var action = "CLICK_TAG";

        if(tagName === 'all') {
            self.getAllLogs().then(function() {
                selectAndDisplay(undefined, tagName, action);
            });
        } else {
            dbService.getLogsWithTag(tagName).then(function(logs) {
                $scope.logs = sortLogs(logs);
                selectAndDisplay(undefined, tagName, action);
            });
        }   
    };

    this.clickLogFn = function($index, log) {
        var sdLog = log;
        var sdTag = $scope.currentSelectedTag;
        var action = "CLICK_LOG";

        selectAndDisplay(sdLog, sdTag, action);
    };
    
    this.removeLogFn = function(key) {
        var action = "LOG_REMOVE";
        var currentSelectedTag = $scope.currentSelectedTag;

        // If key is null, then it is a new log
        // without any data and it has not been
        // saved.
        if(key === undefined) {
            for(var i = 0; i < $scope.logs.length; i++) {
                var log = $scope.logs[i];
                if(log.key === undefined) {
                    $scope.logs.splice(i, 1);
                    selectAndDisplay(undefined, currentSelectedTag, action);
                    return;
                }
            }
        }

        dbService.removeLogAndTag(key).then(function() {
            $scope.$broadcast('logRemoved');

            if(currentSelectedTag !== 'all') {
                dbService.getLogsWithTag(currentSelectedTag).then(function(logs) {
                    if(logs.length === 0) {
                        self.getAllLogs().then(function() {
                            var sdTag = 'all';
                            selectAndDisplay(undefined, sdTag, action);
                        });
                    } else {
                        $scope.logs = logs;
                        var sdTag = currentSelectedTag;
                        selectAndDisplay(undefined, sdTag, action);
                    }
                });
            } else {
                self.getAllLogs().then(function() {
                    var sdTag = 'all';
                    selectAndDisplay(undefined, sdTag, action);
                });
            }

            self.getAllTags();
        });
    };
    
    this.saveFn = function() {
        $scope.$broadcast('log-saved');
        var logKey = $scope.currentLog.key;
        var action = 'INSERT_LOG';

        if(logKey !== null && logKey !== undefined && logKey.trim() !== '') {
            action = 'UPDATE_LOG';
        }

        log = formLogDoc(action);
        
        $scope.isSaving = true;
        
        // check if selectedTag is present
        // if removed select the first tag
        // in the log.
        var currentSelectedTag = $scope.currentSelectedTag;
        if(currentSelectedTag !== 'all' && log.tags.indexOf(currentSelectedTag) === -1) {
            currentSelectedTag = log.tags[0];
        }

        if(action === 'UPDATE_LOG') {
            log.key = logKey;
            dbService.updateLogAndTag(log).then(function() {
                selectAndDisplay(log, currentSelectedTag, action);
                save();
            });
        } else {
            dbService.insertLogAndTag(log).then(function(insertedLog) {
                selectAndDisplay(insertedLog, currentSelectedTag, action);
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
        var action = "FILTER_LOG";

        var filteredLogs = $filter('filter')($scope.logs, $scope.logSearch);
        if(filteredLogs !== null && filteredLogs !== undefined && filteredLogs.length !== 0) {
            var orderedLogs = $filter('orderBy')(filteredLogs, $scope.logOrder);
            var filterLog = orderedLogs[0];
            var sdTag = $scope.currentSelectedTag;
            selectAndDisplay(filterLog, sdTag, action);
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
        
        var currentSelectedTag = $scope.currentSelectedTag;
        if(currentSelectedTag === '' || currentSelectedTag === 'all') {
            self.getAllLogs();
        } else {
            dbService.getLogsWithTag(currentSelectedTag).then(function(logs) {
                $scope.logs = logs;
                logs = sortLogs(logs);
            });
        }
    };

    var formLogDoc = function(action) {
        var tags = $scope.currentLog.tags;

        if(tags === undefined || tags.length === 0) {
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

        if(action === 'INSERT_LOG') {
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
        var currentSelectedTag = 'all';

        insertAllTag().then(function() {
            self.getAllTags().then(function() {
                currentSelectedTag = $scope.tags[0].tag;
                return self.getAllLogs();
            }).then(function() {
                var sdTagName = currentSelectedTag;
                var sdAction = "INIT";
                selectAndDisplay(undefined, sdTagName, sdAction);
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
