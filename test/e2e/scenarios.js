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
    })

    it('should add log1', function() {
        //page.clickAddButton();
        //browser.wait(1000);
        element(by.css('.add')).click().then(function() {
            browser.wait(function() {
                page.setTitle(log1.title);
                page.setTags(log1.tags);
                page.setContent(log1.content);
        
                expect(page.getLogCount()).toEqual(1);
            }, 1000);
            
        });
        
    });

    it('should add log2', function() {
        //page.clickAddButton();
        element(by.css('.add')).click().then(function() {
            browser.wait(function() {
                page.setTitle(log2.title);
                page.setTags(log2.tags);
                page.setContent(log2.content);
        
                expect(page.getLogCount()).toEqual(2);
            }, 1000);
            
        });
    });
});