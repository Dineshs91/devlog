var PrimaryPage = function() {
    var addLog = element(by.css('.add'));
    var titleInput = element(by.css('input.title'));
    var tagsInput = element(by.css('input.tags'));
    var contentInput = element(by.css('textarea.content'));
    var logs = element.all(by.repeater('log in logs'));
    
    this.clickAddButton = function() {
        addLog.click();
    };
    
    this.setTitle = function(title) {
        titleInput.sendKeys(title);
    };
    
    this.setTags = function(tags) {
        tagsInput.sendKeys(tags);
    };
    
    this.setContent = function(content) {
        contentInput.sendKeys(content);
    };
    
    this.getLogCount = function() {
        return logs.count();
    };
};

module.exports = PrimaryPage;