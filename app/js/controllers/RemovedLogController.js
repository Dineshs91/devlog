devlog.controller('RemovedLogController', ['$scope', '$q', 'dbService', function($scope, $q, dbService) {
    var self = this;
    
    this.getAllRemovedLogs = function() {
        return dbService.getAllRemovedLogs().then(function(remLogs) {
            $scope.remLogs = remLogs;
        });
    };
    
    this.proceedFn = function() {
        var promise = [];

        for(var i = 0; i < $scope.remLogs.length; i++) {
            // log.option will not be inserted into db.
            // check updateLog function in services.js
            var option = $scope.remLogs[i].option;
            var log = $scope.remLogs[i];
            log.is_removed = false;

            if(option === 'restore') {
                promise.push(dbService.updateLogAndTag(log));
            } else if (option === 'delete') {
                promise.push(dbService.permanentDelete(log.key));
            }
        }

        $q.all(promise).then(function() {
            // Emit init event, so app is initialized
            // to reflect the restored logs.
            $scope.$emit('init');
            init();
        }).catch(function(err) {
            console.log(err);
        });
    };

    var init = function() {
        self.getAllRemovedLogs();
    };

    /*
        If any log is removed, logRemoved event is triggered.
        Reload removedLogs, which appear in restore/delete modal.
    */
    $scope.$on('logRemoved', function(event, args) {
        init();
    });

    init();
}]);
