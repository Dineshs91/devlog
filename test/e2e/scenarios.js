var PrimaryPage = require('./pages/primary.page.js');

var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
};

describe('Devlog', function() {
    var page;
    var log1 = {
        'title': 'e2e test',
        'tags': 'e2e',
        'content': 'e2e test content'
    };

    var log2 = {
        'title': 'e2e test 2',
        'tags': 'e2e,test',
        'content': 'e2e test content 2'
    };
    
    beforeEach(function() {
        page = new PrimaryPage();
    });

    it('should add log1', function() {
        page.clickAddButton();
        browser.sleep(500);
        
        page.setTitle(log1.title);
        page.setTags(log1.tags);
        page.setContent(log1.content);

        expect(page.getLogCount()).toEqual(1);
    });

    it('should add log2', function() {
        page.clickAddButton();
        browser.sleep(500);
        
        page.setTitle(log2.title);
        page.setTags(log2.tags);
        page.setContent(log2.content);

        expect(page.getLogCount()).toEqual(2);
    });
    
    it('should get all logs in test tag', function() {
        page.getTagsNav().get(2).click();

        expect(page.getLogCount()).toEqual(1);
        expect(page.getTitle().getAttribute('value')).toEqual(log2.title);
        expect(page.getTags().getAttribute('value')).toEqual(log2.tags);
        expect(page.getContentInput().getAttribute('value')).toEqual(log2.content);
    });
    
    it('should remove log2', function() {
        page.getTrashIcon().click();
        browser.sleep(100);
        
        var allTag = page.getTagsNav().get(0);
        expect(hasClass(allTag, 'active')).toBe(true);
    });

    it('should remove all logs', function() {
        page.getTagsNav().get(0).click();

        page.getTrashAll().then(function(items) {
            for(var i = 0; i < items.length; i++) {
                page.getTrashAll().get(0).click();
                browser.sleep(200);
            }
        });

        expect(page.getLogCount()).toEqual(0);
    });
});