var path = require('path');
var gui = require('nw.gui');
var App = gui.App;
var Datastore = require('nedb');
var db = {};

/*
    db that holds the logs.
*/
db.logs = new Datastore({
    filename: path.join(App.dataPath, 'db/log.db'),
    autoload: true
});

/*
    db that holds only the unique tag names.
*/
db.tags = new Datastore({
    filename: path.join(App.dataPath, 'db/tag.db'),
    autoload: true
});

/*
    Enforce an unique constraint on tag.
*/
db.tags.ensureIndex({ fieldName: 'tag', unique: true }, function(err) {
    if(err) {
        console.log(err);
    }
});

/*
    An angular service, for all db related transactions.
*/
devlog.service('dbService', ['$q', '$rootScope', function($q, $rootScope) {
    
    /*
        Convert nedb's _id to key to be used in the view.
        nedb still uses _id.
    */
    var convertIdToKey = function(docs) {
        var convertedDocs = [];
        var docLength = docs.length;
        
        for (i = 0; i < docLength; i++) {
            var doc = docs[i];
            convertedDoc = {};
            for ( var ele in doc) {
                if(!doc.hasOwnProperty(ele)) {
                    continue;
                }
                if(ele === '_id') {
                    convertedDoc.key = doc[ele];
                } else {
                    convertedDoc[ele] = doc[ele];
                }
            }

            convertedDocs.push(convertedDoc);
        }

        return convertedDocs;
    };
    
    this.getLog = function(key) {
        var deferred = $q.defer();

        db.logs.findOne({_id: key}, function(err, log) {
            if(!err) {
                log = convertIdToKey([log])[0];
                deferred.resolve(log);
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });

        return deferred.promise;
    };
 
    this.getAllLogs = function() {
        var deferred = $q.defer();

        db.logs.find({}, function(err, logs) {
            if(!err) {
                logs = convertIdToKey(logs);
                deferred.resolve(logs);
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });

        return deferred.promise;
    };
    
    this.getLogsWithTag = function(tag) {
        var deferred = $q.defer();
        
        db.logs.find({tags: tag}, function(err, logs) {
            if(!err) {
                logs = convertIdToKey(logs);
                deferred.resolve(logs);
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });
        
        return deferred.promise;
    };

    this.insertLog = function(log) {
        var deferred = $q.defer();

        db.logs.insert(log, function(err, newLog) {
            if(!err) {
                newLog = convertIdToKey([newLog])[0];
                deferred.resolve(newLog);
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });

        return deferred.promise;
    };

    this.updateLog = function(log) {
        var deferred = $q.defer();

        db.logs.update({_id: log.key}, {$set: {content: log.content, title: log.title,
            timestamp: log.timestamp, tags: log.tags}}, {},
        function(err) {
            if(!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });

        return deferred.promise;
    };

    /*
        Toggle the boolean variable is_removed.
    */
    this.removeLog = function(key) {
        var deferred = $q.defer();

        db.logs.update({_id: key}, {$set: {is_removed: true}}, function(err) {
            if(!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });

        return deferred.promise;
    };

    /*
        Permanently delete log.
        
        Warning:  Using this method will delete log permanently. There
        is no way, to recover the deleted data, from the app.
    */
    this.permanentDelete = function(key) {
        var deferred = $q.defer();

        db.logs.remove({_id: key}, function(err, numRemoved) {
            if(!err) {
                deferred.resolve(numRemoved);
            } else {
                deferred.reject(err);
            }

            //$rootScope.$apply();
        });

        return deferred.promise;
    };
    
    this.insertTag = function(tag) {
        var deferred = $q.defer();
        
        db.tags.insert(tag, function(err, newTag) {
            if(!err) {
                deferred.resolve(newTag);
            } else {
                if(err.errorType === 'uniqueViolated') {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            }
            
            //$rootScope.$apply();
        });
        
        return deferred.promise;
    };
    
    this.findTag = function(tagName) {
        var deferred = $q.defer();
        
        db.tags.find({tag: tagName}, function(err, tags) {
            if(!err) {
                deferred.resolve(tags);
            } else {
                deferred.reject();
            }
            
            //$rootScope.$apply();
        });
        
        return deferred.promise;
    };
    
    this.removeTag = function(tag) {
        var deferred = $q.defer();
        
        db.tags.remove({tag: tag}, function(err, numRemoved) {
            if(!err) {
                deferred.resolve(numRemoved);
            } else {
                deferred.reject();
            }
            
            //$rootScope.$apply();
        });
        
        return deferred.promise;
    };

    this.getAllTags = function() {
        var deferred = $q.defer();
        
        db.tags.find({}, function(err, tags) {
            if(!err) {
                deferred.resolve(tags);
            } else {
                deferred.reject(err);
            }
            
            //$rootScope.$apply();
        });
        
        return deferred.promise;
    };
    
    /*
        Convert tags in array to a map.
    
        tags = ['test', 'sample'] => [{'tag': 'test'}, {'tag':'sample'}]
        
    */
    var formTagDoc = function(tags) {
        formedTags = [];
        for (var i = 0; i < tags.length; i++) {
            formedTags.push({'tag': tags[i]});
        }
        return formedTags;
    };
    
    /*
        Insert a log and the tags corresponding to it.
    */
    this.insertLogAndTag = function(log) {
        var deferred = $q.defer();
        
        var insertLogPromise = this.insertLog(log);
        
        // We can get tags from log.tags.
        var formedTags = formTagDoc(log.tags);
        var insertTagPromises = [];
        
        for (var i = 0; i < formedTags.length; i++) {
            var insertTagPromise = this.insertTag(formedTags[i]);
            insertTagPromises.push(insertTagPromise);
        } 
        
        var allTagPromises = $q.all(insertTagPromises);
        var newLog;
        
        insertLogPromise.then(function(newDoc) {
            newLog = newDoc;
            return allTagPromises;
        }).then(function() {
            deferred.resolve(newLog);
        });
        
        return deferred.promise;
    };
    
    /*
        Find the tags removed, during a log update.
    */
    this.tagsRemoved = function(log) {
        var deferred = $q.defer();
        var getLogPromise = this.getLog(log.key);
        var newTags = log.tags;
        var oldTags;
        var removedTags = [];
        
        getLogPromise.then(function(log) {
            oldTags = log.tags;
            
            for(var i = 0; i < oldTags.length; i++) {
                var isRemoved = true;
                for(var j = 0; j < newTags.length; j++) {
                    if(oldTags[i] === newTags[j]) {
                        isRemoved = false;
                        break;
                    }
                }
            
                if(isRemoved) {
                    removedTags.push(oldTags[i]);
                }
            }

            deferred.resolve(removedTags);
        });
        
        return deferred.promise;
    };
    
    this.checkAndRemoveTags = function(removedTags) {
        var deferred = $q.defer();
        
        // Check if removed tag is present in any other log
        // If not present, delete the tag
        
        for(var i = 0; i < removedTags.length; i++) {
            this.getLogsWithTag(removedTag).then(function(logs) {
                if(logs.length === 0) {
                    this.removeTag(removedTag);
                }
            });
        }
        
        return deferred.promise;
    };
    
    /*
        Update a log and the tags corresponding to it.
    */
    this.updateLogAndTag = function(log) {
        var deferred = $q.defer();
        
        // We can get tags from log.tags.
        var formedTags = formTagDoc(log.tags);
        
        // Need to find if tags are removed in the update process.
        // Return a array of tags being removed.
        var removedTagsPromise = this.tagsRemoved(log);
        
        // Check and delete, removed tags from tag table
        removedTagsPromise.then(function(removedTags) {
            console.log(removedTags);
            this.checkAndRemoveTags(removedTags);
        }); 
        
        var updateLogPromise = this.updateLog(log);
        
        var insertTagPromises = [];
        
        for (var i = 0; i < formedTags.length; i++) {
            
            // insertOrUpdateTag(tag, isLogUpdate), isLogUpdate => true
            var insertTagPromise = this.insertTag(formedTags[i]);
            insertTagPromises.push(insertTagPromise);
        }
        
        var allTagPromises = $q.all(insertTagPromises);
        
        updateLogPromise.then(function() {
            return allTagPromises;
        }).then(function() {
            deferred.resolve();
        });
        
        return deferred.promise;
    };
}]);