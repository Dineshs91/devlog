[![Build Status](https://travis-ci.org/Dineshs91/devlog.svg?branch=master)](https://travis-ci.org/Dineshs91/devlog)
[![Join the chat at https://gitter.im/Dineshs91/devlog](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Dineshs91/devlog?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Devlog
### A log book for developers.

Devlog - As the name suggests, it is mainly designed to be used as a log book. Log your daily events. It's not just
limited to logging, only our imagination is the limit.
A great app to organize your thoughts. You can also tag your logs, making it easy to group similar logs. Don't worry 
about your data getting lost, auto save takes care of that. If you have accidentally clicked on remove, relax as the 
logs are not removed permanently. Go to restore/delete option from options menu, and restore the removed log. It also
restores the corresponding tags.

It is built using nw.js (Nodewebkit), angular and nedb. For testing karma and protractor is used. 

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

