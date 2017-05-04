#!/bin/bash

gulp watch &
nodemon --config nodemon.config.js server/main.js