var RestoreDeletePage = function() {
    var remLogs = element.all(by.repeater('log in remLogs'));
    var deleteFromRemLogs = element.all(by.css('.negative input'));
    var cancelModalButton = element(by.css('.deny.button'));
    var submitModalButton = element(by.css('.positive.button'));

    this.getRemLogCount = function() {
        return remLogs.count();
    };

    this.getDeleteFromRemLogs = function() {
        return deleteFromRemLogs;
    };

    this.clickCancelModalButton = function() {
        cancelModalButton.click();
    };

    this.clickSubmitModalButton = function() {
        submitModalButton.click();
    };
};

module.exports = RestoreDeletePage;