devlog.controller('MenuController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.os = process.platform;
    $scope.customMenu = true;
    
    if ($scope.os == 'darwin') {
        $scope.customMenu = false;
    }

    $scope.quit = function() {
        window.close();
    };

    $scope.minimize = function() {
        win.minimize();
    };

    $scope.maximize = function() {
        win.maximize();
    };

    $scope.newLogFn = function() {
        $rootScope.$broadcast('add-log');
    };

    $scope.saveLogFn = function() {
        $rootScope.$broadcast('save-log');
    };

    $scope.restoreLogFn = function() {
        $rootScope.$broadcast('restore-log-modal');
    };
}]);