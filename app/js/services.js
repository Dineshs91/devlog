var path = require('path');
var gui = require('nw.gui');
var App = gui.App;
var Datastore = require('nedb');
var db = new Datastore({
    filename: path.join(App.dataPath, 'db/log.db'),
    autoload: true
});

devlog.service('dbService', ['$q', '$rootScope', function($q, $rootScope) {
    
    /*
        Convert nedb's _id to key to be used in the view.
        nedb still uses _id.
    */
    var convertIdToKey = function(logs) {
        var convertedLogs = [];
        var logLength = logs.length;
        
        for (i = 0; i < logLength; i++) {
            var log = logs[i];
            convertedLog = {};
            for ( var ele in log) {
                if(!log.hasOwnProperty(ele)) {
                    continue;
                }
                if(ele === '_id') {
                    convertedLog.key = log[ele];
                } else {
                    convertedLog[ele] = log[ele];
                }
            }

            convertedLogs.push(convertedLog);
        }

        return convertedLogs;
    };
    
    this.getLog = function(key) {
        var deferred = $q.defer();

        db.findOne({_id: key}, function(err, doc) {
            if(!err) {
                doc = convertIdToKey([doc])[0];
                deferred.resolve(doc);
            } else {
                deferred.reject(err);
            }
            
            $rootScope.$apply();
        });

        return deferred.promise;
    };
 
    this.getLogs = function() {
        var deferred = $q.defer();

        db.find({}, function(err, docs) {
            if(!err) {
                docs = convertIdToKey(docs);
                deferred.resolve(docs);
            } else {
                deferred.reject(err);
            }
            
            $rootScope.$apply();
        });

        return deferred.promise;
    };

    this.insertLog = function(doc) {
        var deferred = $q.defer();

        db.insert(doc, function(err, newDoc) {
            if(!err) {
                deferred.resolve(newDoc);
            } else {
                deferred.reject(err);
            }
            
            $rootScope.$apply();
        });

        return deferred.promise;
    };

    this.updateLog = function(doc) {
        var deferred = $q.defer();

        db.update({_id: doc.key}, {$set: {content: doc.content, title: doc.title, timestamp: doc.timestamp, tags: doc.tags}}, {},
        function(err) {
            if(!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }
            
            $rootScope.$apply();
        });

        return deferred.promise;
    };

    /*
        Toggle the boolean variable is_removed.
    */
    this.removeLog = function(key) {
        var deferred = $q.defer();

        db.update({_id: key}, {$set: {is_removed: true}}, function(err) {
            if(!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }
            
            $rootScope.$apply();
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

        db.remove({_id: key}, function(err) {
            if(!err) {
                deferred.resolve();
            } else {
                deferred.reject(err);
            }

            $rootScope.$apply();
        });

        return deferred.promise;
    };
}]);