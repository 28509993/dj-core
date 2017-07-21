#!/usr/bin/env bash
node node_modules/webpack/bin/webpack.js
cp ./dist/dj-core.* ./public/static/js/.

rm ./dj-core.tar.gz
cd ./public
tar -czf dj-core.tar.gz ./static
mv dj-core.tar.gz ..
cd ..