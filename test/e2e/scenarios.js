var PrimaryPage = require('./pages/primary.page.js');
var RestoreDeletePage = require('./pages/restoreDelete.page.js');

var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
};

describe('Devlog', function() {
    var primaryPage;
    var restoreDeletePage;

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
        primaryPage = new PrimaryPage();
        restoreDeletePage = new RestoreDeletePage();

        browser.controlKey = protractor.Key.CONTROL;
        browser.getCapabilities().then(function(capabilities) {
            if(capabilities.caps_.platform === "DARWIN") {
                browser.controlKey = protractor.Key.COMMAND;
            }
        });
    });

    it('should add log1', function() {
        primaryPage.clickAddButton();
        browser.sleep(300);

        primaryPage.addLog(log1);

        expect(primaryPage.getLogCount()).toEqual(1);
    });

    it('should add log2', function() {
        primaryPage.clickAddButton();
        browser.sleep(300);
        
        primaryPage.addLog(log2);

        expect(primaryPage.getLogCount()).toEqual(2);
    });
    
    it('should get all logs in test tag', function() {
        primaryPage.getTagWithText('test').click();

        expect(primaryPage.getLogCount()).toEqual(1);
        expect(primaryPage.getTitle().getAttribute('value')).toEqual(log2.title);
        expect(primaryPage.getTags().getAttribute('value')).toEqual(log2.tags);
        expect(primaryPage.getContentInput().getAttribute('value')).toEqual(log2.content);
    });

    it('should get all logs in e2e tag', function() {
        primaryPage.getTagWithText('e2e').click();

        expect(primaryPage.getLogCount()).toEqual(2);
    });
    
    it('should remove log2', function() {
        primaryPage.getTagWithText('test').click();
        primaryPage.getTrashIcon().click();
        browser.sleep(100);
        
        var allTag = primaryPage.getTagWithText('all');
        expect(hasClass(allTag, 'active')).toBe(true);
    });

    it('should open delete/restore modal', function() {
        primaryPage.openRestoreDeleteModal();

        browser.sleep(200);
        expect(restoreDeletePage.getRemLogCount()).toEqual(1);
        restoreDeletePage.clickCancelModalButton();
        browser.sleep(200);
    });

    it('should remove all logs', function() {
        primaryPage.getTagWithText('all').click();

        primaryPage.getTrashAll().then(function(items) {
            for(var i = 0; i < items.length; i++) {
                primaryPage.getTrashAll().get(0).click();
                browser.sleep(200);
            }
        });

        // Permanently remove all deleted logs from restore/delete modal.
        primaryPage.openRestoreDeleteModal();
        browser.sleep(300);
        restoreDeletePage.getDeleteFromRemLogs().then(function(items) {
            for(var i = 0; i < items.length; i++) {
                restoreDeletePage.getDeleteFromRemLogs().get(i).click();
                browser.sleep(100);
            }
        });
        browser.sleep(100);
        restoreDeletePage.clickSubmitModalButton();
        browser.sleep(300);
        expect(primaryPage.getLogCount()).toEqual(0);
    });
});
