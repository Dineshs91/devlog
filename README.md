[![Build Status](https://travis-ci.org/Dineshs91/devlog.svg?branch=master)](https://travis-ci.org/Dineshs91/devlog)
[![Join the chat at https://gitter.im/Dineshs91/devlog](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Dineshs91/devlog?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Devlog
### A log book for developers.

Devlog - Devlog is designed to assist you keep track of your ideas, notes, etc in a simple yet intutive way. 

<b><i> Key Features </i></b>
1. Index: 
Lists a index of previous entries with Title and Date making it easy to find your notes.
![Alt text](https://github.com/satish28/devlog/Loglist.png?raw=true "Sample screenshot") 

2. Tags: 
Tags allow you to group similar log entries together. 
Ex: Say you are working on a project called "Devlog" and you have identifed additional features to add and issues. Tagging allows you to group similar ideas or notes and selecting the tag from the index displays only relevant tagged entries.

![Alt text](https://github.com/satish28/devlog/Tagging.png?raw=true "Sample screenshot") 

Devlog is built using 
1. <a href="https://github.com/nwjs/nw.js/">NW.js (Node-Webkit)</a>
2. <a href="https://angularjs.org/">ANGULARJS</a>
3. <a href="https://github.com/louischatriot/nedb"> NeDB (Node embedded databse)</a> 
<h4>Testing</h4>
1. <a href = "http://karma-runner.github.io/0.12/index.html">Karma </a>
2. <a href = "https://angular.github.io/protractor/#/"> Protractor </a>

#### Hacking
1. git clone 
2. npm install
3. npm start (To run the app from source) or npm start --remote-debugging 9222 (To use chrome devtools).
4. npm test (Complete testing. includes both unittests and e2e tests)

#### Other available commands
1. grunt jshint (Jshint)
2. npm run unittest (Run only the unittests)
3. npm run e2e (Run only e2e tests)

#### Todo
- [x] Add keyboard bindings.
- [x] Restore/Delete removed logs.
- [ ] During first time use, show an introduction log.
- [ ] Add an option to show all stats, like no. of logs etc.
- [ ] Import/Export logs.
- [ ] In app updates.
- [ ] Draggable logs. 
