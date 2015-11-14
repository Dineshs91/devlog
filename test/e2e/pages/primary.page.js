var PrimaryPage = function() {
    var addLog = element(by.css('.add'));
    var titleInput = element(by.css('input.title'));
    var tagsInput = element(by.css('input.tags'));
    var contentInput = element(by.css('textarea.content'));
    var logs = element.all(by.repeater('log in logs'));
    var tagsNav = element.all(by.css('.tags-nav'));
    var trashIcon = element(by.css('.trash'));
    var trashAll = element.all(by.css('.trash'));
    var remLogs = element.all(by.repeater('log in remLogs'));
    var deleteFromRemLogs = element.all(by.css('.negative input'));
    var cancelModalButton = element(by.css('.deny.button'));
    var submitModalButton = element(by.css('.positive.button'));
    
    this.clickAddButton = function() {
        addLog.click();
    };
    
    this.getTitle = function() {
        return titleInput;
    };
    
    this.setTitle = function(title) {
        titleInput.sendKeys(title);
    };
    
    this.getTags = function() {
        return tagsInput;
    };
    
    this.setTags = function(tags) {
        tagsInput.sendKeys(tags);
    };
    
    this.getContentInput = function() {
        return contentInput;
    };
    
    this.setContent = function(content) {
        contentInput.sendKeys(content);
    };
    
    this.getLogCount = function() {
        return logs.count();
    };
    
    this.getTagsNav = function() {
        return tagsNav;
    };
    
    this.getTrashIcon = function() {
        return trashIcon;
    };
    
    this.getTrashAll = function() {
        return trashAll;
    };

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

module.exports = PrimaryPage;
