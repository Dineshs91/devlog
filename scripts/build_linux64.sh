#! /bin/bash

SOURCE=build/Devlog/linux64/
DEST=build/devlog-linux64.tar.gz

echo "Building for linux64"
tar -zcvf $DEST -c ${SOURCE}
echo "Build destination: $DEST"