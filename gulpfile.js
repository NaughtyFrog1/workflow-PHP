const { dest, src, series, parallel, watch } = require('gulp');

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');

// CSS/SASS
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');

// Varios
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

// Tools
const cache = require('gulp-cache');
const clean = require('gulp-clean');
const errorNotifier = require('gulp-error-notifier');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const browserSync = require('browser-sync').create();

// env
// Para crear entorno `$ NODE_ENV=production gulp`
const toDevelopment = process.env.NODE_ENV !== 'production';

// Paths
const paths = {
  img: {
    src: 'src/assets/images/**/*',
    dest: 'build/images'
  },
  js: {
    src: 'src/js/**/*',
    dest: 'build/js'
  },
  scss: {
    src: 'src/scss/**/*',
    dest: 'build/css',
    main: 'src/scss/main.scss'
  },
  web: {
    src: '**/*.{html,php}'
  }
}



//* FUNCTIONS


// Imagenes

function imgmin() {
  return src(paths.img.src)
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugins: [{ removeViewBox: true }]
    })))
    .pipe(dest(paths.img.dest));
}

function imgminToWebp() {
  return src(paths.img.dest + '/**/*')
    .pipe(webp())
    .pipe(dest(paths.img.dest));
}


// CSS/SASS

function buildSass() {
  return src(paths.scss.main)
    .pipe(gulpif(toDevelopment, sourcemaps.init()))
    .pipe(errorNotifier.handleError(sass()))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulpif(toDevelopment, sourcemaps.write('.')))
    .pipe(dest(paths.scss.dest));
}


// JavaScript

function buildJS() {
  return src(paths.js.src)
    .pipe(gulpif(toDevelopment, sourcemaps.init()))
    .pipe(errorNotifier.handleError(terser()))
    .pipe(concat('bundle.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulpif(toDevelopment, sourcemaps.write('.')))
    .pipe(dest(paths.js.dest));
}


// Tools

function rmBuild() {
  return src('build/', {read: false, allowEmpty: true})
    .pipe(clean());
}

function notifyEnd() {
  return src('build/', {read: false, allowEmpty: true})
    .pipe(notify({
      title: 'Build Finalizado', 
      message: 'Build finalizado con éxito',
    }));
}

function reload(done) {
  browserSync.reload();
  done();
}

function serve(done) {
  browserSync.init({
    proxy: 'localhost'
  });
  done();
}

function watchFiles() {
  watch(paths.img.src, series(imagemin, imgminToWebp, reload));
  watch(paths.js.src, series(buildJS, reload));
  watch(paths.scss.src, series(buildSass, reload));
  watch(paths.web.src, reload);
}



//* EXPORTS

exports.img = series(imgmin, imgminToWebp);
exports.js = buildJS;
exports.scss = buildSass;

exports.watch = series(
  parallel(buildJS, buildSass),
  serve,
  watchFiles
);

exports.default = series(
  rmBuild,
  parallel(
    series(imgmin, imgminToWebp),
    buildJS,
    buildSass
  ),
  notifyEnd
);