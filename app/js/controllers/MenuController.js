devlog.controller('MenuController', ['$scope', function($scope) {
    $scope.customMenu = true;
    
    $scope.quit = function() {
        window.close();
    };
    
    $scope.minimize = function() {
        win.minimize();
    };
    
    $scope.maximize = function() {
        win.maximize();
    };
}]);