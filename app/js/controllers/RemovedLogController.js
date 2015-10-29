devlog.controller('RemovedLogController', ['$scope', '$q', 'dbService', 'hotkeys',
    function($scope, $q, dbService, hotkeys) {

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

    // Act on menu events (Restore/Delete logs)
    $scope.$on('restore-log-modal', function(event, args) {
        $('.standard.modal').modal('show');
    });

    hotkeys.add({
        combo: 'mod+r',
        description: 'Restore/Delete logs',
        callback: function() {
            $('.standard.modal').modal('show');
        },
        allowIn: ['INPUT', 'TEXTAREA']
    });

    init();
}]);
