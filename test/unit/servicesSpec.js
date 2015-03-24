describe("DevLog Services", function() {
    var dbService;
    var testDoc1Key;
    var testDoc2Key;

    var testDoc1 = {
        'title': 'Test',
        'content': 'Test content',
        'timestamp': '1424546852',
        'is_removed': false,
        'tags': ['test']
    };
    
    var testDoc2 = {
        'title': 'Test 2',
        'content': 'Test content 2',
        'timestamp': '1424546853',
        'is_removed': false,
        'tags': ['new', 'doc2']
    };

    var updateDoc1 = {
        'title': 'Test update',
        'content': 'Test updated content',
        'timestamp': '1424546854',
        'is_removed': false,
        'tags': ['update']
    };

    beforeEach(module('devLog'));

    beforeEach(function() {
        module(function($provide) {
            $provide.value('db', mockDb);
        });
    });

    beforeEach(inject(function(_dbService_) {
        dbService = _dbService_;
    }));
    
    beforeEach(inject(function($rootScope) {
        rootScope = $rootScope;
    }));

    it('should contain a dbService', function() {
        expect(dbService).not.toBe(null);
    });

    it('should insert a log', function(done) {
        var promise = dbService.insertLogAndTag(testDoc1);

        promise.then(function(newDoc) {
            testDoc1Key = newDoc.key;
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should get all logs', function(done) {
        var promise = dbService.getAllLogs();
        
        promise.then(function(logs) {
            expect(logs.length).toBeGreaterThan(0);
            done();
        });
        
        rootScope.$apply();
    });

    it('should get a log', function(done) {
        var promise = dbService.getLog(testDoc1Key);

        promise.then(function(log) {
            expect(log).toBeDefined();
            expect(log.title).toBe(testDoc1.title);
            expect(log.content).toBe(testDoc1.content);
            expect(log.tags.length).toBe(testDoc1.tags.length);
            expect(log.tags[0]).toBe(testDoc1.tags[0]);
            expect(log.timestamp).toBe(testDoc1.timestamp);

            // Test if _id is converted to key
            expect(log.key).toBeDefined();
            expect(log._id).toBeUndefined();
            done();
        });
        
        rootScope.$apply();
    });

    it('should get all the logs with the given tag', function(done) {
        var promise = dbService.getLogsWithTag('test');

        promise.then(function(logs) {
            expect(logs.length).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });

    it('should update log', function(done) {
        // Add key to updateDoc1
        updateDoc1.key = testDoc1Key;
        var promise = dbService.updateLogAndTag(updateDoc1);
        var getLogPromise = dbService.getLog(testDoc1Key);

        promise.then(function() {
            return getLogPromise;
        }).then(function(log) {
            expect(log.title).toBe(updateDoc1.title);
            expect(log.content).toBe(updateDoc1.content);
            expect(log.tags.length).toBe(updateDoc1.tags.length);
            for (var i = 0; i < log.tags.length; i++) {
                expect(log.tags[i]).toBe(updateDoc1.tags[i]);
            }
            expect(log.timestamp).toBe(updateDoc1.timestamp);
            done();
        });
        
        rootScope.$apply();
    });

    it('should insert a second log', function(done) {
        var promise = dbService.insertLogAndTag(testDoc2);

        promise.then(function(log) {
            testDoc2Key = log.key;
            done();
        });
        
        rootScope.$apply();
    });

    it('should get all the logs with the given tag after update',
    function(done) {
        var promise = dbService.getLogsWithTag('test');

        promise.then(function(logs) {
            expect(logs.length).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });

    it('should permanently delete second log', function(done) {
        var promise = dbService.permanentDelete(testDoc2Key);

        promise.then(function(numRemoved) {
            expect(numRemoved).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });

    it('should remove a log', function(done) {
        var promise = dbService.removeLog(testDoc1Key);
        var getLogPromise = dbService.getLog(testDoc1Key);

        promise.then(function() {
            return getLogPromise;
        }).then(function(log) {
            expect(log.is_removed).toBe(true);
            done();
        });
        
        rootScope.$apply();
    });

    it('should remove log permanently', function(done) {
        var promise = dbService.permanentDelete(testDoc1Key);
        var getAllLogsPromise = dbService.getAllLogs();

        promise.then(function() {
            return getAllLogsPromise;
        }).then(function(logs) {
            expect(logs.length).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });

    it('should get all tags', function(done) {
        var promise = dbService.getAllTags();

        promise.then(function(tags) {
            expect(tags.length).toBe(4);
            done();
        });
        
        rootScope.$apply();
    });

    it('should remove a tag', function(done) {
        var promise = dbService.removeTag(testDoc1.tags[0]);

        promise.then(function(numRemoved) {
            expect(numRemoved).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });

    it('should find a tag', function(done) {
        var promise = dbService.findTag('new');

        promise.then(function(tags) {
            expect(tags.length).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });

});