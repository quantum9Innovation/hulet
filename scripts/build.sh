#!/usr/bin/env bash
echo "Building project"
browserify hulet --s hulet -o dist/hulet.min.js
echo "Minifying result"
terser ./dist/hulet.min.js --keep-classnames --keepfnames --compress -o ./dist/hulet.min.js
echo "Build complete; see dist/hulet.min.js"
