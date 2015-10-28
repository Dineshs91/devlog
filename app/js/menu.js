var gui = require('nw.gui');
var win = gui.Window.get();
var menu = new gui.Menu({ type: "menubar" });

var customMenu = function() {
    var optionsMenu = new gui.Menu();

    optionsMenu.append(new gui.MenuItem({
        label: "restore/delete",
        key: "r",
        modifiers: process.platform === 'darwin' ? "cmd" : "ctrl",
        click: function() {
            $('.standard.modal').modal('show');
        }
    }));

    var logsMenu = new gui.Menu();

    logsMenu.append(new gui.MenuItem({
        label: "Add new log",
        key: "n",
        modifiers: process.platform === 'darwin' ? "cmd" : "ctrl",
        click: function() {
            $('.add').click();
        }
    }));

    logsMenu.append(new gui.MenuItem({
        label: "Save",
        key: "s",
        modifiers: process.platform === 'darwin' ? "cmd" : "ctrl",
        click: function() {
            $('.save').click();
        }
    }));

    menu.append(new gui.MenuItem({
        label: 'Logs',
        submenu: logsMenu
    }));

    menu.append(new gui.MenuItem({
        label: 'Options',
        submenu: optionsMenu
    }));

    win.menu = menu;
};

if(process.platform === 'darwin') {
    menu.createMacBuiltin("Devlog");
    customMenu();
}