const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const moduleImporter = require("sass-module-importer");
const browserSync = require('browser-sync').create();
const del = require('del');
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const rename = require('gulp-rename');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const path = {
    root: './build',
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles'
    },
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/*.pug',
        dest: 'build/assets/'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/assets/scripts/'
    }
}
//watch
function watch() {
    gulp.watch(path.styles.src, styles);
    gulp.watch(path.templates.src, templates);
    gulp.watch(path.scripts.src, scripts);
}
//kartinki
function images(){
    return gulp.src('src/images/**/*.*')
    .pipe(gulp.dest('build/assets/images'))
}
// styles
function styles() {
    return gulp.src('src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass({
            outputStyle: "compact",
            importer: moduleImporter()
        }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.styles.dest))
}
//fotorama
function style(){
    return gulp.src('src/styles/css/**.*')
        .pipe(gulp.dest('build/assets/styles/css'))
}
function scripts(){
    return gulp.src(path.scripts.src)
    .pipe(gulp.dest(path.scripts.dest))
}
// pug
function templates() {
    return gulp.src(path.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(path.root))
}
//live-reload
function server() {
    browserSync.init({
        server: path.root
    });
    browserSync.watch(path.root + '/**/*.*', browserSync.reload);
}
//del
function clean() {
    return del(path.root);
}
//перeнос шрифтов
function fonts() {
    return gulp.src('src/fonts/**').pipe(gulp.dest('build/assets/fonts'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.pug = pug;
exports.clean = clean;

gulp.task('default', gulp.series(clean,
    gulp.parallel(styles, templates, scripts, fonts,images,style),
    gulp.parallel(watch, server)
));
