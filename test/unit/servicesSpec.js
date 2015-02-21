describe("DevLog Services", function() {
    var dbService;
    var testKey;

    var testDoc = {
        'title': 'Test',
        'content': 'Test content',
        'timestamp': '1424546852',
        'is_removed': false,
        'tags': ['test']
    };

    var updateDoc = {
        'title': 'Test update',
        'content': 'Test updated content',
        'timestamp': '1424546854',
        'is_removed': false,
        'tags': ['test', 'update']
    };

    beforeEach(module('devLog'));

    beforeEach(inject(function(_dbService_) {
        dbService = _dbService_;
    }));

    it('should contain a dbService', function() {
        expect(dbService).toBeDefined();
    });

    it('should insert a log', function(done) {
        var promise = dbService.insertLog(testDoc);
        
        promise.then(function(newDoc) {
            testKey = newDoc._id;
            done();
        });
        
        expect(promise).toBeDefined();
    });

    it('should get all the logs', function(done) {
        var promise = dbService.getLogs();

        promise.then(function(logs) {
            expect(logs).toBeDefined();
            expect(logs.length).toBe(1);
            var log = logs[0];
            
            expect(log.title).toBe(testDoc.title);
            expect(log.content).toBe(testDoc.content);
            expect(log.tags[0]).toBe(testDoc.tags[0]);
            
            // Test if _id is converted to key
            expect(log.key).toBeDefined();
            expect(log._id).toBeUndefined();
            done();
        });
    });
    
    it('should get a log', function(done) {
        var promise = dbService.getLog(testKey);

        promise.then(function(log) {
            expect(log).toBeDefined();
            expect(log.title).toBe(testDoc.title);
            expect(log.content).toBe(testDoc.content);
            expect(log.tags.length).toBe(testDoc.tags.length);
            expect(log.tags[0]).toBe(testDoc.tags[0]);
            expect(log.timestamp).toBe(testDoc.timestamp);
            
            // Test if _id is converted to key
            expect(log.key).toBeDefined();
            expect(log._id).toBeUndefined();
            done();
        });
    });

    it('should update log', function(done) {
        // Add key to updateDoc
        updateDoc.key = testKey;
        var promise = dbService.updateLog(updateDoc);
        var getLogPromise = dbService.getLog(testKey);
        
        promise.then(function() {
            return getLogPromise;
        }).then(function(log) {
            expect(log.title).toBe(updateDoc.title);
            expect(log.content).toBe(updateDoc.content);
            expect(log.tags.length).toBe(updateDoc.tags.length);
            for (var i = 0; i < log.tags.length; i++) {
                expect(log.tags[i]).toBe(updateDoc.tags[i]);
            }
            expect(log.timestamp).toBe(updateDoc.timestamp);
            done();
        });
    });
    
    it('should remove a log', function(done) {
        var promise = dbService.removeLog(testKey);
        var getLogPromise = dbService.getLog(testKey);
        
        promise.then(function() {
            return getLogPromise;
        }).then(function(log) {
            expect(log.is_removed).toBe(true);
            done();
        });
    });
    
    it('should remove log permanently', function(done) {
        var promise = dbService.permanentDelete(testKey);
        var getAllLogsPromise = dbService.getLogs();

        promise.then(function() {
            return getAllLogsPromise;
        }).then(function(logs) {
            expect(logs.length).toBe(0);
            done();
        });
    });
    
});