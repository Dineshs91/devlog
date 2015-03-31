describe("DevLog Controllers", function() {
    var $scope, logCtrl, dbService;
    
    beforeEach(function() {
        var mockDbService = {};
        module('devLog', function($provide) {
            $provide.value('dbService', mockDbService);
        });
        
        inject(function($q) {
            mockDbService.logs = [
                {
                    'key': '2VUEDrzhTHPOVxys',
                    'title': 'test title',
                    'content': 'test content',
                    'timestamp': '1424546852',
                    'is_removed': false,
                    'tags': ['test']
                },
                {
                    'key': '64VdkAI6C80FUuxk',
                    'title': 'Test 2',
                    'content': 'Test content 2',
                    'timestamp': '1424546853',
                    'is_removed': false,
                    'tags': ['update']
                }
            ];
            
            mockDbService.tags = [
                {
                    '_id': '442477',
                    'key': 'wrmvg5c2ZuzGLxbh',
                    'tag': 'test'
                },
                {
                    '_id': '197223',
                    'key': 'rtYsgTmnaQz9Ldbv',
                    'tag': 'update'
                }
            ];
            
            var getRandomInt = function() {
                var min = 100000;
                var max = 999999;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            };
            
            mockDbService.getLog = function(key) {
                var deferred = $q.defer();
                
                for (var log in this.logs) {
                    if(log.key === key) {
                        deferred.resolve(log);
                    }
                }                
                
                return deferred.promise;
            };
            
            mockDbService.getAllLogs = function() {
                var deferred = $q.defer();
                
                deferred.resolve(this.logs);
                
                return deferred.promise;
            };
            
            mockDbService.getLogsWithTag = function(tag) {
                var deferred = $q.defer();
                var logsWithTag = [];
                
                for (var log in this.logs) {
                    if(log.tags[0] === tag) {
                        logsWithTag.push(log);
                    }
                }
                deferred.resolve(logsWithTag);
                
                return deferred.promise;
            };
            
            mockDbService.insertLog = function(log) {
                var deferred = $q.defer();
                
                // Create some random key.
                log.key = getRandomInt;
                this.logs.push(log);
                
                deferred.resolve();
                
                return deferred.promise;
            };
            
            mockDbService.updateLog = function(updateLog) {
                var deferred = $q.defer();
                
                for (var log in this.logs) {
                    if(updateLog.key === log.key) {
                        log.title = updateLog.title;
                        log.content = updateLog.content;
                        log.timestamp = updateLog.timestamp;
                        log.tags = updateLog.tags;
                    }
                }                
                deferred.resolve();
                
                return deferred.promise;
            };
            
            mockDbService.removeLog = function(key) {
                var deferred = $q.defer();
                
                for (var log in this.logs) {
                    if(log.key === key) {
                        log.is_removed = true;
                    }
                }
                deferred.resolve();
                
                return deferred.promise; 
            };
            
            mockDbService.permanentDelete = function(key) {
                var deferred = $q.defer();
                
                for (var i = 0; i < this.logs.length; i++) {
                    var log = this.logs[i];
                    if(log.key === key) {
                        logs.splice(i, 1);
                    }
                }
                deferred.resolve();
                
                return deferred.promise;
            };
            
            mockDbService.insertTag = function(tag) {
                var deferred = $q.defer();
                
                tag.key = getRandomInt;
                this.tags.push(tag);
                
                deferred.resolve();
                
                return deferred.promise;
            };
            
            mockDbService.removeTag = function(tagName) {
                var deferred = $q.defer();
                
                for(var i = 0; i < this.tags.length; i++) {
                    var tag = this.tags[i];
                    if(tag.tag === tagName) {
                        tag.splice(i, 1);
                    }
                }
                
                deferred.resolve();
                
                return deferred.promise;
            };
            
            mockDbService.getAllTags = function() {
                var deferred = $q.defer();
                
                deferred.resolve(this.tags);
                
                return deferred.promise;
            };
        });
    });
    
    beforeEach(inject(function($controller, $rootScope, _dbService_) {
        $scope = $rootScope.$new();
        dbService = _dbService_;
        logCtrl = $controller('LogController', {$scope: $scope, dbService: dbService});
    }));

    it('should have a LogCtrl controller', function() {
        expect(logCtrl).not.toBe(null);
    });
    
    it('should get all logs', function() {
        logCtrl.getAllLogs();

        $scope.$apply();
        expect($scope.logs.length).toBe(2); 
    });
});