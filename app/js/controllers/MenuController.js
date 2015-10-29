devlog.controller('MenuController', ['$scope', function($scope) {
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

    // Emit menu events
    $scope.$emit('save-log');
    $scope.$emit('add-log');
    $scope.$emit('restore-log-modal');
}]);