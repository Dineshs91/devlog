devlog.controller('MenuController', ['$scope', 'hotkeys', function($scope, hotkeys) {
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
    
    function hotKeys() {
        hotkeys.add({
            combo: 'ctrl+s',
            description: 'Save current log',
            callback: function() {
                $('.save').click();
            }
        });
    };
}]);