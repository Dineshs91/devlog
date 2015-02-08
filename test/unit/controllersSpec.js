describe("DevLog Controllers", function() {
    var scope, logCtrl;
    beforeEach(module('devLog'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        logCtrl = $controller('LogCtrl', {$scope: scope});
    }));

    it('should have a LogCtrl controller', function() {
        expect(logCtrl).not.toBe(null);
    });
});