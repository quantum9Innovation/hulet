#!/usr/bin/env bash
echo "Transpiling from Typescript"
tsc -p tsconfig.json
echo "Building project"
browserify dist/ts --s hulet -o dist/hulet.min.js
echo "Minifying result"
terser dist/hulet.min.js --keep-classnames --keepfnames --compress -o dist/hulet.min.js
echo "Build complete; see dist/hulet.min.js"
