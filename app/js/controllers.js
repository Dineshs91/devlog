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
        dbService.getAllLogs().then(function(logs) {
            $scope.logs = logs;

            logs = sortLogs(logs);
            displayLog(logs[0].key);
        });
    };
    
    this.getAllTags = function() {
        dbService.getAllTags().then(function(tags) {
            tags = sortTags(tags);

            var index = tags.map(function(tag) { return tag.tag; }).indexOf('all');
            var allTag = tags[index];
            tags.splice(index, 1);

            tags.unshift(allTag);
            $scope.tags = tags;
        });
    };
    
    this.clickLogFn = function($index, key) {
        $scope.logSelectedIndex = $index;
        displayLog(key);
    };

    this.removeLogFn = function(key) {
        dbService.removeLogAndTag(key).then(function() {
            $scope.tagSelectedIndex = 0;
            $scope.logSelectedIndex = 0;

            init();
        });
    };
    
    this.saveFn = function() {
        log = formLogDoc();
        
        var logKey = $scope.logKey;
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
    
    var save = function() {
        self.getAllTags();
        if(currentSelectedTag !== null && currentSelectedTag !== undefined) {
            if(currentSelectedTag === '' || currentSelectedTag === 'all') {
                self.getAllLogs();

                $scope.logSelectedIndex = 0;

                for(var i = 0; i < $scope.tags.length; i++) {
                    if($scope.tags[i].tag === currentSelectedTag) {
                        $scope.tagSelectedIndex = i;
                        break;
                    }
                }
            } else {
               dbService.getLogsWithTag(currentSelectedTag).then(function(logs) {
                   logs = sortLogs(logs);

                   $scope.logs = logs;
                   displayLog(logs[0].key);
                   $scope.logSelectedIndex = 0;

                   for(var i = 0; i < $scope.tags.length; i++) {
                       if($scope.tags[i].tag === currentSelectedTag) {
                           $scope.tagSelectedIndex = i;
                           break;
                       }
                   }
               });
            }
        }
    };

    this.clickTagFn = function($index, tagName) {
        currentSelectedTag = $scope.tags[$index].tag;

        $scope.tagSelectedIndex = $index;
        $scope.logSelectedIndex = 0;

        if(tagName === 'all') {
            dbService.getAllLogs().then(function(logs) {
                $scope.logs = logs;

                logs = sortLogs(logs);
                displayLog(logs[0].key);
            });
        } else {
            dbService.getLogsWithTag(tagName).then(function(logs) {
                $scope.logs = logs;

                logs = sortLogs(logs);
                displayLog(logs[0].key);
            });
        }
        
    };
    
    this.addFn = function() {
        log = {
            'title': '',
            'content': '',
            'timestamp': (new Date()).getTime(),
            'is_removed': false,
            'tags': []
        };

        logs = $scope.logs;
        logs.push(log);
        $scope.logs = logs;
        clearEditor();

        if(currentSelectedTag !== '') {
            $scope.logTags = currentSelectedTag;
        }
    };

    this.changedFn = function() {
        myTimer.clear();

        myTimer.set();
    };

    var myTimer = function(){
        var timer;

        this.set = function() {
            timer = $timeout(self.saveFn, 3000);
        };

        this.clear = function() {
          $timeout.cancel(timer);
        };

        return this;
    }();

    var displayLog = function(key) {
        dbService.getLog(key).then(function(log) {
            var tags = '';

            for(i = 0; i < log.tags.length; i++) {
                tags += log.tags[i];
                if(i != log.tags.length - 1) {
                    tags += ", ";
                }
            }
            $scope.logTags = tags;
            $scope.logTitle = log.title;
            $scope.logContent = log.content;
            $scope.logKey = log.key;
        });
    };
    
    var formLogDoc = function() {
        var tags = $scope.logTags;
        
        if(tags === null || tags === undefined || tags.trim() === "") {
            formedTags = [];
        } else {
            tags = tags.trim().toLowerCase();
            var re = /\s*,\s*/;
            formedTags = tags.split(re);
        }

        log = {
            'title': $scope.logTitle,
            'content': $scope.logContent,
            'timestamp': (new Date()).getTime(),
            'is_removed': false,
            'tags': formedTags
        };
        return log;
    };
    
    var clearEditor = function() {
        $scope.logTitle = '';
        $scope.logTags = '';
        $scope.logContent = '';
        $scope.logKey = '';
    };

    var sortLogs = function(logs) {
        // Sorting logs in descending order based on timestamp.
        logs.sort(function(a, b) {
            return parseFloat(b.timestamp) - parseFloat(a.timestamp);
        });

        return logs;
    };

    var sortTags = function(tags) {
        // Sorting tags alphabetically.
        tags.sort(function(a, b) {
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

        return tags;
    };

    var insertAllTag = function() {
        var tag = {
            'tag': 'all'
        };

        dbService.insertTag(tag).then(function(tag) {
            init();
        });
    };

    var init = function() {
        self.getAllLogs();
        self.getAllTags();
    };

    var start = function() {
        insertAllTag();

        $scope.tagSelectedIndex = 0;
        $scope.logSelectedIndex = 0;
    };

    start();

}]);