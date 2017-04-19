/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var gulp = require("gulp");
var eslint = require("gulp-eslint");
var shell = require("gulp-shell");
var minimist = require("minimist");
var gkutil = require("./util/gulp-gk.js");

var options = minimist(process.argv.slice(2), {
    default: {
        env: "development"
    }
});

console.log("Environment: " + options.env);

gulp.task("default", function () {
    // place code for your default task here
});

/**
 * Process sequelize migration.
 */
gulp.task("db:migrate", shell.task("sequelize db:migrate --env " + options.env + " --migrations-path server/migrations --models-path server/models --config config/dbconfig.js"));

/**
 * Undo most recent sequelize migration.
 */
gulp.task("db:migrate:undo", shell.task("sequelize db:migrate:undo --env " + options.env + " --migrations-path server/migrations --models-path server/models --config config/dbconfig.js"));

gulp.task("lint", function() {
    return gulp.src([ "main.js", "server/**/*.js", "www/**/*.js", "!node_modules/**", "!www/bower_components/**" ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("profile:create", function() {
    return gkutil.createProfile(options.email, options.password);
});