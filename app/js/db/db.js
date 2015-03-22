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


devlog.service('db', [function() {
    return db;
}]);