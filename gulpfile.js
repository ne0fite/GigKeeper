"use strict";

require("es6-promise").polyfill();

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    sourcemaps = require("gulp-sourcemaps"),
    gls = require("gulp-live-server"),
    imagemin = require("gulp-imagemin"),
    uglify = require("gulp-uglify"),
    changed = require("gulp-changed"),
    cleanCss = require("gulp-clean-css"),
    concat = require("gulp-concat"),
    htmlify = require("gulp-angular-htmlify"),
    include = require("gulp-include-2"),
    jshint = require("gulp-jshint"),
    stylish = require("jshint-stylish"),
    plumber = require("gulp-plumber"),
    eslint = require("gulp-eslint"),
    shell = require("gulp-shell"),
    minimist = require("minimist"),
    noop = require("gulp-noop"),
    gkutil = require("./util/gulp-gk.js"),
    config = require("./config/config.js"),
    fs = require("fs"),
    zip = require("gulp-zip");

var globs = {
        config: "config/config.json",
        staticAssets: "www/**/*",
        indexHtml: "www_src/index.html",
        html: ["www_src/index.html", "www_src/template/**/*.html"],
        styles: "www_src/styles/**/*.scss",
        stylesMain: "www_src/styles/main.scss",
        scripts: ["www_src/app.js", "www_src/js/**/*.js"],
        img: "www_src/images/**/*"
    },
    dirs = {
        html: "www",
        css: "www/css",
        js: "www/js",
        vendor: "www/bower_components",
        img: "www/images",
        src: "www_src"
    };

var options = minimist(process.argv.slice(2), {
    default: {
        env: "development"
    }
});

/**
 * Outputs Gulp errors to the console.
 * 
 * @param  {object} err The error
 * @return {void}
 */
function onError(err) {
    console.log(err.toString());
}

/**
 * Ensure that all of the necessary directories exist.
 * 
 * @return {void}
 */
function makeDirs() {
    var keys = Object.keys(dirs),
        i;

    for (i = 0; i < keys.length; ++i) {
        if (!fs.existsSync(dirs[keys[i]])) {
            fs.mkdirSync(dirs[keys[i]]);
        }
    }
}

/**
 * Only perform the operation in the dev environment.
 * 
 * @param  {object} operation The Gulp operation to be performed
 * 
 * @return {object}           The provided operation or noop
 */
function ifDev(operation) {
    var isDev = options.env == "development";
    
    return isDev ? operation : noop();
}

/**
 * Only perform the operation in the prod environment.
 * 
 * @param  {object} operation The Gulp operation to be performed
 * 
 * @return {object}           The provided operation or noop
 */
function ifProd(operation) {
    var isProd = options.env != "development";
    
    return isProd ? operation : noop();
}

makeDirs();

gulp.task("config", function() {
    var config = require("./config/config.js"),
        appConfig = {
            env: config.app.env
        },
        appConfigString = "var appConfig = ";

    appConfig.api = {
        host: config.api.host,
        port: config.api.port
    };

    appConfigString += JSON.stringify(appConfig) + ";";

    fs.writeFileSync("www/js/appConfig.js", appConfigString);
});

gulp.task("sass", function() {
    return gulp.src(globs.stylesMain)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(ifDev(sourcemaps.init()))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(ifProd(cleanCss()))
        .pipe(ifDev(sourcemaps.write()))
        .pipe(gulp.dest(dirs.css));
});

gulp.task("html", function() {
    return gulp.src(globs.indexHtml)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(include())
        .pipe(htmlify())
        .pipe(gulp.dest(dirs.html));
});

gulp.task("jshint", function() {
    return gulp.src(globs.scripts)
        .pipe(jshint({
            node: true,
            browser: true,
            globals: {
                angular: true,
                kendo: true
            }
        }))
        .pipe(jshint.reporter(stylish));
});

gulp.task("scripts", ["jshint"], function() {
    return gulp.src(globs.scripts)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(ifDev(sourcemaps.init()))
        .pipe(ifProd(uglify({
            preserveComments: "license"
        })))
        .pipe(concat("app.js"))
        .pipe(ifDev(sourcemaps.write()))
        .pipe(gulp.dest(dirs.js));
});

gulp.task("images", function() {
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

gulp.task("watch", ["build"], function() {
    gulp.watch(globs.config, ["config"]);
    gulp.watch(globs.html, ["html"]);
    gulp.watch(globs.styles, ["sass"]);
    gulp.watch(globs.scripts, ["scripts"]);
    gulp.watch(globs.img, ["images"]);
});

gulp.task("serve", ["watch"], function() {
    var server = gls.static(dirs.html, 8001);

    server.start();

    gulp.watch(globs.staticAssets, function(file) {
        server.notify.apply(server, [file]);
    });
});

gulp.task("build", ["config", "html", "sass", "scripts", "images"]);

gulp.task("default", ["serve"]);

gulp.task("archive", function() {

    var filename = "gigkeeper.zip";

    gulp.src([ ".ebextensions",
               ".bowerrc", 
               "bower.json", 
               "config/**/*", 
               "LICENSE.md", 
               "main.js", 
               "package.json", 
               "README.md", 
               "server/**/*", 
               "www/**/*", 
               "!www/bower_components/**/*",
               "!config/config.json" ], { base: "./" })
        .pipe(zip(filename))
        .pipe(gulp.dest("dist"));
});

/*** Server tasks ***/

gulp.task("db:dump:schema", shell.task("pg_dump " +
    " -h " + config.db.host +
    " -p " + config.db.port +
    " -U " + config.db.user +
    " -s " + config.db.name + 
    " -f ./sql/GigKeeper-schema.sql"));

gulp.task("db:dump:data", function() {
    return gkutil.dumpData(options.table);
});

gulp.task("db:seed:data", function() {
    return gkutil.seedData();
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
    return gulp.src(["main.js", "server/**/*.js", "www_src/**/*.js", "!node_modules/**", "!www/bower_components/**"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("profile:create", function() {
    return gkutil.createProfile(options.email, options.password);
});

gulp.task("smtp:test", function() {
    return gkutil.smtpTest(options.to, options.from);
});

gulp.task("test", shell.task("lab -e development -m 10000 -v"));