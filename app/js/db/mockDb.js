/*
    MockDatastore
*/
var MockDatastore = function Datastore(options) {
    this.data = [];
    this.key = 0;
};

/*
    All these are taken from nedb directly. Some parts are modified
    accordingly.

    DB operation: EnsureIndex.
*/
MockDatastore.prototype.ensureIndex = function (options, cb) {
    this.fieldName = options.fieldName;
    this.unique = options.unique;
};

// jshint ignore:start

/*
    DB operation: Insert. 
*/
MockDatastore.prototype.insert = function (doc, callback) {
    // error object
    error = {
        errorType: 'uniqueViolated'
    };

    var field = this.fieldName;
    if(this.unique === true) {
        for(i = 0; i < this.data.length; i++) {
            if(this.data[i][field] === doc[field]) {
                return callback(error);
            }
        }
    }
    
    doc._id = this.key;
    
    // Increment key
    this.key += 1;
    
    this.data.push(doc);
    var len = this.data.length;
    
    res = this.data[len - 1];
    
    return callback(null, res);
};

/*
    DB operation: Find.
*/
MockDatastore.prototype.find = function (query, projection, callback) {
    switch (arguments.length) {
    case 1:
        projection = {};
        // callback is undefined, will return a cursor
        break;
    case 2:
        if (typeof projection === 'function') {
            callback = projection;
            projection = {};
        }   // If not assume projection is an object and callback undefined
        break;
    }

    var res = [];
    for (i = 0; i < this.data.length; i += 1) {
        if(match(this.data[i], query)) {
            res.push(this.data[i]);
        }
    }

    return callback(null, res);
};

/*
    DB operation: FindOne
*/
MockDatastore.prototype.findOne = function (query, projection, callback) {
    switch (arguments.length) {
    case 1:
      projection = {};
      // callback is undefined, will return a cursor
      break;
    case 2:
      if (typeof projection === 'function') {
        callback = projection;
        projection = {};
      }   // If not assume projection is an object and callback undefined
      break;
    }
    
    var res = [];
    for (i = 0; i < this.data.length; i += 1) {
        if(match(this.data[i], query)) {
            res.push(this.data[i]);
        }
    }
    
    return callback(null, res[0]);

};

/*
    DB operation: Update
*/
MockDatastore.prototype.update = function(query, updateQuery, options, cb) {
    var modifiedDoc
      , numReplaced = 0
	  , modifications = [];
    
    if (typeof options === 'function') { cb = options; options = {}; }
    callback = cb || function () {};
    multi = options.multi !== undefined ? options.multi : false;
    upsert = options.upsert !== undefined ? options.upsert : false;
    
    for (i = 0; i < this.data.length; i += 1) {
      if (match(this.data[i], query) && (multi || numReplaced === 0)) {
        numReplaced += 1;
        modifiedDoc = modify(this.data[i], updateQuery);
        modifications.push({ oldDoc: this.data[i], newDoc: modifiedDoc });
      }
    }
    
    for(i = 0; i < modifications.length; i += 1) {
        // Remove old doc
        for (j = 0; j < this.data.length; j += 1) {
            if(this.data[j]._id === modifications[i].oldDoc._id) {
                this.data.splice(j, 1);
            }
        }

        // Insert new doc
        this.data.push(modifications[i].newDoc);
    }
    
    return callback(null, numReplaced);
};

/*
    DB operation: Remove
*/
MockDatastore.prototype.remove = function (query, options, cb) {
    var callback
      , numRemoved = 0
      , multi
      , removedDocs = [];
    
    if (typeof options === 'function') { cb = options; options = {}; }
    callback = cb || function () {};
    multi = options.multi !== undefined ? options.multi : false;
    
    for (i = 0; i < this.data.length; i += 1) {
      if (match(this.data[i], query) && (multi || numRemoved === 0)) {
        numRemoved += 1;
        removedDocs.push({ $$deleted: true, _id: this.data[i]._id });
      }
    }
    
    for(i = 0; i < removedDocs.length; i += 1) {
        for (j = 0; j < this.data.length; j += 1) {
            if(this.data[j]._id === removedDocs[i]._id) {
                this.data.splice(j, 1);
            }
        }
    }
    
    return callback(null, numRemoved);
};

// jshint ignore:end

var mockDb = {};

/*
    mock db for logs.
*/
mockDb.logs = new MockDatastore();

/*
    mock db for tags.
*/
mockDb.tags = new MockDatastore();

/*
    Enforce an unique constraint on tag.
*/
mockDb.tags.ensureIndex({ fieldName: 'tag', unique: true }, function(err) {
    if(err) {
        console.log(err);
    }
});

devlog.service('mockDb', [function($rootScope) {

    return mockDb;
}]);
