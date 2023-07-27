#!/usr/bin/env bash
echo "Transpiling from Typescript"
yarn run tsc -p tsconfig.json
if [ ! -d dist/ts/test/baseline ]; then
    mkdir -p dist/ts/test/baseline
fi
cp test/baseline/* dist/ts/test/baseline
echo "Building project"
browserify dist/ts/hulet --s hulet -o dist/hulet.min.js
echo "Minifying result"
terser dist/hulet.min.js --keep-classnames --keepfnames --compress -o dist/hulet.min.js
echo "Build complete; see dist/hulet.min.js"
