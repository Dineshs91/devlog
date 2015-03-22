var devlog = angular.module('devLog', []);

devlog.controller('LogCtrl', ['$scope', 'dbService', function($scope, dbService) {

    $scope.getAll = function() {
        dbService.getAllLogs().then(function(logs) {
            $scope.logs = logs;
        });
    };
    
    $scope.getAll();
}]);