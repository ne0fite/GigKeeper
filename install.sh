#!/bin/bash

sudo gem install sass
sudo npm i -g gulp node-gyp bower sequelize
npm install
bower install
cp -n config/config.json.sample config/config.json