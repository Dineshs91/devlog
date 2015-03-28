/*
    An angular service, for all db related transactions.
*/
devlog.service('dbService', ['$q', '$rootScope', 'db', function($q, $rootScope, db) {
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
        function(err, numReplaced) {
            if(!err) {
                deferred.resolve(numReplaced);
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
                    deferred.reject(err);
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
                deferred.reject(err);
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
                deferred.reject(err);
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
        
        var self = this;
        
        // We can get tags from log.tags.
        var formedTags = formTagDoc(log.tags);
        
        var newLog;
        var insertLogPromise = this.insertLog(log);
        
        insertLogPromise.then(function(newDoc) {
            newLog = newDoc;

            var insertTagPromises = [];
            for (var i = 0; i < formedTags.length; i++) {
                var insertTagPromise = self.insertTag(formedTags[i]);
                insertTagPromises.push(insertTagPromise);
            }
        
            var allTagPromises = $q.all(insertTagPromises);
            return allTagPromises;
        }).then(function() {
            deferred.resolve(newLog);
        }).catch(function(err) {
            console.log(err);
            deferred.reject(err);
        });
        
        return deferred.promise;
    };
    
    /*
        Find the tags removed, during a log update.
    */
    this.tagsRemoved = function(log) {
        var deferred = $q.defer();
        var newTags = log.tags;
        var oldTags;
        var removedTags = [];
        
        var getLogPromise = this.getLog(log.key);

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
    
    /*
        We check if the removed tags are present in any other log. If not
        remove the tag, else do nothing.
    */
    this.checkAndRemoveTags = function(removedTags, logKey) {
        var deferred = $q.defer();
        
        var self = this;

        var getLogsPromises = [];
        for(var i = 0; i < removedTags.length; i++) {
            getLogsPromises.push(this.getLogsWithTag(removedTags[i]));
        }
        
        $q.all(getLogsPromises).then(function(allLogs) {
            var removeTagPromises = [];
            for(i = 0; i < allLogs.length; i++) {
                if(allLogs[i].length === 0) {
                    removeTagPromises.push(self.removeTag(removedTags[i]));
                } else if(allLogs[i].length === 1 && allLogs[i][0].key === logKey) {
                    // Since we are updating the log, if no. of logs with tag
                    //  is 1 and if it is the same log that we are updating
                    // we have to remove the tag.
                    removeTagPromises.push(self.removeTag(removedTags[i]));
                }
            }

            return $q.all(removeTagPromises);
        }).then(function() {
            deferred.resolve();
        }).catch(function(err) {
            console.log(err);
            deferred.reject(err);
        });

        return deferred.promise;
    };
    
    /*
        Update a log and the tags corresponding to it.
        If during an update, tags are removed, we have
        to remove the tags also.
    */
    this.updateLogAndTag = function(log) {
        var deferred = $q.defer();
        
        var self = this;
        
        // We can get tags from log.tags.
        var formedTags = formTagDoc(log.tags);
        var logKey = log.key;
        
        // Need to find if tags are removed in the update process.
        // Return a array of tags being removed.
        var removedTagsPromise = this.tagsRemoved(log);
        
        removedTagsPromise.then(function(removedTags) {
            // Check and delete, removed tags from tag table
            return self.checkAndRemoveTags(removedTags, logKey);
        }).then(function() {
            return self.updateLog(log);
        }).then(function(numReplaced) {
            var insertTagPromises = [];

            for (var i = 0; i < formedTags.length; i++) {
                var insertTagPromise = self.insertTag(formedTags[i]);
                insertTagPromises.push(insertTagPromise);
            }

            allTagPromises = $q.all(insertTagPromises);
            return allTagPromises;
        }).then(function(newTag) {
            deferred.resolve();
        }).catch(function(err) {
            console.error(err);
            deferred.reject(err);
        });
        
        return deferred.promise;
    };
    
    /*
        Remove log and corresponding tags if they are
        not present in any other logs.
    */
    this.removeLogAndTag = function(key) {
        var deferred = $q.defer();
        
        var self = this;
        var logKey = key;
        
        getLogPromise = this.getLog(logKey);
        
        var log;
        getLogPromise.then(function(doc) {
            log = doc;
            return self.removeLog(logKey);
        }).then(function() {
            var removedTags = log.tags;
            
            // We are not sending logKey, since the
            // log is removed first. 
            return self.checkAndRemoveTags(removedTags, logKey);
        }).then(function() {
            deferred.resolve();
        }).catch(function(err) {
            console.log(err);
            deferred.reject(err);
        });
        
        return deferred.promise;
    };
}]);