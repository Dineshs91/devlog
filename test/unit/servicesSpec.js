describe("DevLog Services", function() {
    var dbService;
    beforeEach(module('devLog'));

    beforeEach(inject(function(_dbService_) {
        dbService = _dbService_;
    }));

    it('should contain a dbService', function() {
        expect(dbService).not.toBe(null);
    });
});