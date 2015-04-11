#! /bin/bash

SOURCE=build/Devlog/osx64/
DEST=build/devlog-osx64.dmg
TITLE=Devlog

echo "Building for osx 64"
hdiutil create $DEST -volname "${TITLE}" -fs HFS+ -srcfolder "${SOURCE}"
echo "Build destination: $DEST"