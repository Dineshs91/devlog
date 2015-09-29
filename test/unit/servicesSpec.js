describe("DevLog Services", function() {
    var dbService;

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
    
    /* Insert */
    
    var log1 = {
        'title': 'log1 title',
        'content': 'log1 content',
        'created_on': '12345678',
        'updated_on': '12345999',
        'tags': ['log1'],
        'is_removed': false
    };
    
    var log1Key;
    
    it('should insert a log', function(done) {
        dbService.insertLogAndTag(log1).then(function(log) {
            log1Key = log.key;
            expect(log1Key).toBeDefined();
            
            // To check if _id is converted to key.
            expect(log._id).toBeUndefined();
            expect(log1.title).toBe(log.title);
            expect(log1.content).toBe(log.content);
            expect(log1.created_on).toBe(log.created_on);
            expect(log1.updated_on).toBe(log.updated_on);
            expect(log1.tags.length).toBe(log.tags.length);
            for(i = 0; i < log.tags.length; i++) {
                expect(log1.tags[i]).toBe(log.tags[i]);
            }
            expect(log.is_removed).toBe(log1.is_removed);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should have inserted all tags to tags table', function(done) {
        dbService.getAllTags().then(function(tags) {
            expect(tags.length).toBe(1);
            expect(tags[0].tag).toBe(log1.tags[0]);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should get the inserted log', function(done) {
        dbService.getLog(log1Key).then(function(log) {
            expect(log.key).toBeDefined();
            
            // To check if _id is converted to key.
            expect(log._id).toBeUndefined();
            expect(log1.title).toBe(log.title);
            expect(log1.content).toBe(log.content);
            expect(log1.created_on).toBe(log.created_on);
            expect(log1.updated_on).toBe(log.updated_on);
            expect(log1.tags.length).toBe(log.tags.length);
            for(i = 0; i < log.tags.length; i++) {
                expect(log1.tags[i]).toBe(log.tags[i]);
            }
            expect(log1.is_removed).toBe(log.is_removed);
            done();
        });
        
        rootScope.$apply();
    });
    
    /* Update */
    
    //1. Update log without any changes to tags.
    var log1Update = {
        'title': 'log1 title update',
        'content': 'log1 content update',
        'updated_on': '12346999',
        'tags': ['log1'],
        'is_removed': false
    };
    
    it('should update a log', function(done) {
        // Insert log1Key to log1Update.
        log1Update.key = log1Key;
        
        dbService.updateLogAndTag(log1Update).then(function(returnValue) {
            expect(returnValue.numLogsUpdated).toBe(1);
            expect(returnValue.insertedTags[0]).toBeUndefined();
            expect(returnValue.numTagsRemoved[0]).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });
    
    
    
    // 2. Update log and insert a tag.
    it('should update a log', function(done) {
        // Remove tags from log1Update
        var newTag = 'log1update';
        log1Update.tags.push(newTag);
        
        dbService.updateLogAndTag(log1Update).then(function(returnValue) {
            expect(returnValue.numLogsUpdated).toBe(1);
            
            // InsertedTags is an array of objects.
            // First tag is undefined because, first tag ['log1'] already
            // exists in tag table.
            expect(returnValue.insertedTags[1].tag).toBe(newTag);
            expect(returnValue.numTagsRemoved[0]).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });
    
    // 3. Update log and remove a tag.
    it('should update a log', function(done) {
        // Remove tags from log1Update
        log1Update.tags = ['log1'];
        
        dbService.updateLogAndTag(log1Update).then(function(returnValue) {
            expect(returnValue.numLogsUpdated).toBe(1);
            expect(returnValue.insertedTags[0]).toBeUndefined();
            expect(returnValue.numTagsRemoved[0]).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });
    
    // Just to make sure if the log is updated.
    it('should get the updated log', function(done) {
        dbService.getLog(log1Key).then(function(log) {
            expect(log.key).toBeDefined();
            
            // To check if _id is converted to key.
            expect(log._id).toBeUndefined();
            expect(log1Update.title).toBe(log.title);
            expect(log1Update.content).toBe(log.content);
            expect(log1Update.created_on).toBe(log.created_on);

            // Updated log will have latest updated_on time.
            // Check with log1 updated_on time.
            expect(log1.updated_on).toBeLessThan(log.updated_on);
            expect(log1Update.tags.length).toBe(log.tags.length);
            for(i = 0; i < log.tags.length; i++) {
                expect(log1Update.tags[i]).toBe(log.tags[i]);
            }
            expect(log1Update.is_removed).toBe(log.is_removed);
            done();
        });
        
        rootScope.$apply();
    });
    
    /* Remove */
    
    // 1. We remove the updated log.
    it('should remove a log', function(done) {
        dbService.removeLogAndTag(log1Key).then(function(returnValue) {
            expect(returnValue.numLogsRemoved).toBe(1);
            expect(returnValue.numTagsRemoved[0]).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });
    
    // At this point, there should be no logs.
    it('should get all logs', function(done) {
        dbService.getAllLogs().then(function(logs) {
            expect(logs.length).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });
    
    // 2. We insert two logs having same tag.
    // Remove one log and see if tag is there.
    // Ideally the tag should be there.
    it('should insert first log', function(done) {
        dbService.insertLogAndTag(log1).then(function(log) {
            // updating log1Key
            log1Key = log.key;
            done();
        });
        
        rootScope.$apply();
    });
    
    var log2 = {
        'title': 'log2 title',
        'content': 'log2 content',
        'created_on': '12345671',
        'updated_on': '12345671',
        'tags': ['log1'],
        'is_removed': false
    };
    var log2Key;
    
    it('should insert second log', function(done) {
        dbService.insertLogAndTag(log2).then(function(log) {
            log2Key = log.key;
            done();
        });
        
        rootScope.$apply();
    });
    
    // At this point, there should be 2 logs.
    it('should get all logs', function(done) {
        dbService.getAllLogs().then(function(logs) {
            expect(logs.length).toBe(2);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should remove first log', function(done) {
        dbService.removeLogAndTag(log1Key).then(function(returnValue) {
            expect(returnValue.numLogsRemoved).toBe(1);
            expect(returnValue.numTagsRemoved[0]).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should remove second log', function(done) {
        dbService.removeLogAndTag(log2Key).then(function(returnValue) {
            expect(returnValue.numLogsRemoved).toBe(1);
            
            // Now the tag should be removed since it is not
            // used in any other log.
            expect(returnValue.numTagsRemoved[0]).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });
    
    // Finally logs and tags should be 0
    it('should get all logs', function(done) {
        dbService.getAllLogs().then(function(logs) {
            expect(logs.length).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should get all tags', function(done) {
        dbService.getAllTags().then(function(tags) {
            expect(tags.length).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });
    
    /* Check what happens if there are no tags */
    it('should insert a log', function(done) {
        log1.tags = [];
        
        dbService.insertLogAndTag(log1).then(function(log) {
            log1Key = log.key;
            expect(log1Key).toBeDefined();
            
            // To check if _id is converted to key.
            expect(log._id).toBeUndefined();
            expect(log1.title).toBe(log.title);
            expect(log1.content).toBe(log.content);
            expect(log1.created_on).toBe(log.created_on);
            expect(log1.updated_on).toBe(log.updated_on);
            expect(log1.tags.length).toBe(log.tags.length);
            for(i = 0; i < log.tags.length; i++) {
                expect(log1.tags[i]).toBe(log.tags[i]);
            }
            expect(log.is_removed).toBe(log1.is_removed);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should get all logs', function(done) {
        dbService.getAllLogs().then(function(logs) {
            expect(logs.length).toBe(1);
            done();
        });
        
        rootScope.$apply();
    });
    
    it('should get all tags', function(done) {
        dbService.getAllTags().then(function(tags) {
            expect(tags.length).toBe(0);
            done();
        });
        
        rootScope.$apply();
    });

    /* We have removed 3 logs if you count. */
    it('should get all removed logs', function(done) {
        dbService.getAllRemovedLogs().then(function(remLogs) {
            expect(remLogs.length).toBe(3);
            for(var i = 0; i < remLogs.length; i++) {
                expect(remLogs[i].is_removed).toBe(true);
            }
            done();
        });

        rootScope.$apply();
    });

    /*
        Restore a removed log. log2Key is removed.
        We are restoring it here.
    */
    it('should restore a removed log', function(done) {
        log2.key = log2Key;
        log2.is_removed = false;

        dbService.updateLogAndTag(log2).then(function(returnValue) {
            expect(returnValue.numLogsUpdated).toBe(1);
            done();
        });

        rootScope.$apply();
    });

    it('should get the restored log', function(done) {
        dbService.getLog(log2Key).then(function(log) {
            expect(log.key).toBeDefined();

            // To check if _id is converted to key.
            expect(log._id).toBeUndefined();
            expect(log2.title).toBe(log.title);
            expect(log2.content).toBe(log.content);
            expect(log2.created_on).toBe(log.created_on);
            expect(log2.updated_on).toBe(log.updated_on);
            expect(log2.tags.length).toBe(log.tags.length);
            for(i = 0; i < log.tags.length; i++) {
                expect(log2.tags[i]).toBe(log.tags[i]);
            }
            expect(log2.is_removed).toBe(log.is_removed);
            done();
        });

        rootScope.$apply();
    });
});