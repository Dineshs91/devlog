var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
};

describe('Devlog', function() {
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

    it('should add log1', function() {
        element(by.css('.add')).click();
        element(by.css('input.title')).sendKeys(log1.title);
        element(by.css('input.tags')).sendKeys(log1.tags);
        element(by.css('textarea.content')).sendKeys(log1.content);

        var logs = element.all(by.repeater('log in logs'));
        expect(logs.count()).toEqual(1);
    });

    it('should add log2', function() {
        element(by.css('.add')).click();
        element(by.css('input.title')).sendKeys(log2.title);
        element(by.css('input.tags')).sendKeys(log2.tags);
        element(by.css('textarea.content')).sendKeys(log2.content);

        var logs = element.all(by.repeater('log in logs'));
        expect(logs.count()).toEqual(2);
    });

    it('should get all logs in test tag', function() {
        element.all(by.css('.tags-nav')).get(2).click();

        var logs = element.all(by.repeater('log in logs'));
        expect(logs.count()).toEqual(1);
        expect(element(by.css('input.title')).getAttribute('value')).toEqual(log2.title);
        expect(element(by.css('input.tags')).getAttribute('value')).toEqual(log2.tags);
        expect(element(by.css('textarea.content')).getAttribute('value')).toEqual(log2.content);
    });

    it('should remove log2', function() {
        element(by.css('.trash')).click();

        browser.sleep(100);
        var allTag = element.all(by.css('.tags-nav')).get(0);
        expect(hasClass(allTag, 'active')).toBe(true);
    });

    it('should remove all logs', function() {
        element.all(by.css('.tags-nav')).get(0).click();

        element.all(by.css('.trash')).then(function(items) {
            for(var i = 0; i < items.length; i++) {
                element.all(by.css('.trash')).get(0).click();
                browser.sleep(200);
            }
        });

        var logs = element.all(by.repeater('log in logs'));
        expect(logs.count()).toEqual(0);
    });
});