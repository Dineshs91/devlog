#! /bin/bash

SOURCE=build/Devlog/win64/
DEST=build/devlog-win64.zip

echo "Building for win 64"

cd ${SOURCE} && zip -ru ../../devlog-win64.zip ./*

echo "Build destination: $DEST"