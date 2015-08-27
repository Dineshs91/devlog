# Change Log
All notable chanages to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased][unreleased]
### Changed
- Version is being changed. According to semver the initial version should
  be 0.1.0 not 0.0.1. So the next release would be 0.1.0 not 0.0.3

### Fixed
- Issue with windows is fixed by using npm@3.0
- Unselect all radio buttons in restore/delete modal when cancel button is
  pressed

## [0.0.2] - 2015-05-08
### Note
- This release is not working in windows. This is due to design feature in windows.
  It has a character limit of 256 chars in file path.

### Added
- Keyboard shortcuts for saving and bringing restore/delete modal.
- Ability to restore/permanently delete removed logs.

### Fixed
- User unable to click on empty log.
- User able to create multiple new logs without title or content.

## [0.0.1] - 2015-04-11
Initial release

### Note
- This release is not working in windows. This is due to design feature in windows.
  It has a character limit of 256 chars in file path.

### Added
- Create/edit/remove logs.
- Attach tags to logs.
- Auto save (After 1000ms of typing).
- Manual save (Clicking on save button).
- Available for os x, linux and win (64 bit only).