var gui = require('nw.gui');
var win = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: "menubar" });

if(process.platform === 'darwin') nativeMenuBar.createMacBuiltin("Devlog");

win.menu = nativeMenuBar;