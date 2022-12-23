// подключение модулей 
const gulp = require('gulp')
const less = require('gulp-less')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const coffee = require('gulp-coffee');
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin');
const size = require('gulp-size');
const gulppug = require('gulp-pug');
const newer = require('gulp-newer'); 
const browsersync = require('browser-sync').create();
const ts = require('gulp-typescript');
const del = require('del')


// пути к нашим файлом 
const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist/'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    styles: {
        src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.less'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js', 'node_modules/slick-carousel/slick/slick.js', 'node_modules/mixitup/dist/mixitup.js', 'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js'],
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/**',
        dest: 'dist/img/'
    }
}

// очистка каталога 
function clean() {
    return del(['dist/*', '!dist/img'])
}

// gulp.task('minify', () => {
//     return gulp.src('src/*.html')
//         .pipe(htmlmin({ collapseWhitespace: true }))
//         .pipe(gulp.dest('dist'));
//     }); другой способ подключение 


// минификация html
function html() {
    return gulp.src(paths.html.src)
    .pipe(size({
        showFiles: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}

// задача для обрабоки стилей
function styles(){
    return gulp.src(paths.styles.src )
        .pipe(sourcemaps.init())
        // .pipe(less())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        })) 
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles: true
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browsersync.stream())
}

// задача для обработки скриптов
function scripts(){
    return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    // .pipe(coffee({bare: true}))
    // .pipe(ts({
    //     noImplicitAny: true,
    //     outFile: 'main.min.js'
    // }))  
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size({
        showFiles: true
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())

}

// минификация изображений
async  function img(){
    gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(size({
        showFiles: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}


// для того чтобы стили и js  автоматически компилировались
function watch(){
    browsersync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch(paths.html.dest).on('change', browsersync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
}


const build = gulp.series(clean, html, gulp.parallel(styles, scripts), watch)

exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scripts =scripts
exports.watch =  watch
exports.build = build
exports.default = build


