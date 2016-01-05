var PrimaryPage = function() {
    var addLog = element(by.css('.add'));
    var titleInput = element(by.css('input.title'));
    var tagsInput = element(by.css('input.tags'));
    var contentInput = element(by.css('textarea.content'));
    var logs = element.all(by.css('.logs-list'));
    var tagsNav = element.all(by.css('.tags-nav'));
    var trashIcon = element(by.css('.trash'));
    var trashAll = element.all(by.css('.trash'));
    var maximizeButton = element(by.css('.maximize'));
    
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

    this.getTagWithText = function(text) {
        var tag = element(by.cssContainingText('.tags-nav .description', text));
        return tag;
    };
    
    this.getTrashIcon = function() {
        return trashIcon;
    };
    
    this.getTrashAll = function() {
        return trashAll;
    };
    
    this.addLog = function(log) {
        this.setTitle(log.title);
        this.setTags(log.tags);
        this.setContent(log.content);  
    };
    
    this.openRestoreDeleteModal = function() {
        // (cmd / ctrl + r) opens the restore/delete modal
        browser.actions().sendKeys(protractor.Key.chord(browser.controlKey, 'r')).perform();
    };

    this.maximizeWindow = function() {
        maximizeButton.click();
    };
};

module.exports = PrimaryPage;
