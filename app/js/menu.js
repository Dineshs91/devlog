var gui = require('nw.gui');
var win = gui.Window.get();
var menu = new gui.Menu({ type: "menubar" });

if(process.platform === 'darwin') menu.createMacBuiltin("Devlog");

var optionsMenu = new gui.Menu();

optionsMenu.append(new gui.MenuItem({
    label: "restore/delete",
    click: function() {
        $('.standard.modal').modal('show');
    }
}));

menu.append(new gui.MenuItem({
    label: 'Options',
    submenu: optionsMenu
}));

win.menu = menu;