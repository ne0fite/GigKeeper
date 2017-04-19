"use strict";

require('es6-promise').polyfill();

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	gls = require('gulp-live-server'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	changed = require('gulp-changed'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	htmlify = require('gulp-angular-htmlify'),
	include = require('gulp-include-2'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	plumber = require('gulp-plumber'),
	eslint = require("gulp-eslint"),
	shell = require("gulp-shell"),
	minimist = require("minimist"),
	fs = require('fs');

var globs = {
		config: 'config/config.json',
		staticAssets: 'www/**/*',
		indexHtml: 'www_src/index.html',
		html: ['www_src/index.html', 'www_src/template/**/*.html'],
		styles: 'www_src/styles/**/*.scss',
		scripts: ['www_src/app.js', 'www_src/js/**/*.js'],
		img: 'www_src/images/**/*'
	},
	dirs = {
		html: 'www',
		css: 'www/css',
		js: 'www/js',
		vendor: 'www/bower_components',
		img: 'www/images',
		src: 'www_src'
	};


var options = minimist(process.argv.slice(2), {
    default: {
        env: "development"
    }
});

var server = gls.static(dirs.html, 8001);

function onError(err) {
	console.log(err.toString());
}

function makeDirs() {
	var keys = Object.keys(dirs),
		i;

	for(i = 0; i < keys.length; ++i) {
		if(!fs.existsSync(dirs[keys[i]])) {
			fs.mkdirSync(dirs[keys[i]]);
		}
	}
}

makeDirs();

gulp.task('config', function() {
	var config = require('./config/config.json'),
		appConfig = {},
		appConfigString = 'var appConfig = ';

	appConfig.api = {
		host: config.app.host,
		port: config.app.port
	};

	appConfigString += JSON.stringify(appConfig) + ";";

	fs.writeFileSync('www/js/appConfig.js', appConfigString);
});

gulp.task('sass', function() {
	return gulp.src(globs.styles)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(minifyCss())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dirs.css));
});

gulp.task('html', function() {
	return gulp.src(globs.indexHtml)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(include())
		.pipe(htmlify())
		.pipe(gulp.dest(dirs.html));
});

gulp.task('jshint', function () {
	return gulp.src(globs.scripts)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('scripts', ['jshint'], function() {
	return gulp.src(globs.scripts)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dirs.js));
});

gulp.task('images', function() {
	return gulp.src(globs.img)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(changed(dirs.img))
		.pipe(imagemin({
			optimizationLevel: 5,
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }]
		}))
		.pipe(gulp.dest(dirs.img));
});

gulp.task('watch', ['build'], function() {
	gulp.watch(globs.config, ['config']);
	gulp.watch(globs.html, ['html']);
	gulp.watch(globs.styles, ['sass']);
	gulp.watch(globs.scripts, ['scripts']);
	gulp.watch(globs.img, ['images']);
});

gulp.task('serve', ['watch'], function() {
	server.start();

	gulp.watch(globs.staticAssets, function(file) {
		server.notify.apply(server, [file]);
	});
});

gulp.task('build', ['config', 'html', 'sass', 'scripts', 'images']);

gulp.task('default', ['serve']);



/*** Server tasks ***/

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