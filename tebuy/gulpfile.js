var gulp           = require('gulp');
var sass           = require('gulp-sass');
var inject         = require('gulp-inject');
var wiredep        = require('wiredep').stream;
var del            = require('del');
var mainBowerFiles = require('main-bower-files');
var filter         = require('gulp-filter');
var concat         = require('gulp-concat');
var csso           = require('gulp-csso');
var livereload     = require('gulp-livereload');


gulp.task('clean', function(cb) {
    del(['dist'], cb);
});

gulp.task('styles', function() {
    var injectAppFiles    = gulp.src('src/styles/*.scss', { read: false });
    var injectGlobalFiles = gulp.src('src/styles/global/*.scss', { read: false });
    var injectMixinsFiles = gulp.src('src/styles/mixins/*.scss', { read: false });

    function transformFilepath(filepath) {
        return '@import "' + filepath + '";';
    }

    var injectAppOptions = {
        transform: transformFilepath,
        starttag: '// inject:app',
        endtag: '// endinject',
        addRootSlash: false
    };

    var injectGlobalOptions = {
        transform: transformFilepath,
        starttag: '// inject:global',
        endtag: '// endinject',
        addRootSlash: false
    };

    var injectMixinsOptions = {
        transform: transformFilepath,
        starttag: '// inject:mixins',
        endtag: '// endinject',
        addRootSlash: false
    };

    return gulp.src('src/main.scss')
        .pipe(wiredep())
        .pipe(inject(injectGlobalFiles, injectGlobalOptions))
        .pipe(inject(injectMixinsFiles, injectMixinsOptions))
        .pipe(inject(injectAppFiles, injectAppOptions))
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('vendors', function() {
    return gulp.src(mainBowerFiles())
        .pipe(filter('*.css'))
        .pipe(concat('vendors.css'))
        .pipe(csso())
        .pipe(gulp.dest('dist/styles'));
});

// Fonts
gulp.task('fonts', function() {
    return gulp.src([
                    'bower_components/font-awesome/fonts/fontawesome-webfont.*'])
            .pipe(gulp.dest('dist/fonts/'));
});

// 服務
// gulp.task('serve', ['sass'], function () {
//     browserSync.init({
//         proxy: "tebuy_pcweb.dev"   // hostname
//     });
// });


gulp.task('default', ['clean', 'vendors', 'styles', 'fonts'], function() {
    var injectFiles = gulp.src(['dist/styles/main.css', 'dist/styles/vendors.css']);

    var injectOptions = {
        addRootSlash: false,
        ignorePath: ['src', 'dist']
    };

    return gulp.src('src/index.html')
        .pipe(inject(injectFiles, injectOptions))
        .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {

    // create livereload server
    livereload.listen();

    // watch all dist/  if files change will reload
    gulp.watch(['dist/**']).on('change', livereload.changed);

    // watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // watch images
    gulp.watch('src/images/**/*', ['images']);

});


// gulp.task('watch', function() {

//     // create livereload server
//     livereload.listen();

//     // watch all dist/  if files change will reload
//     gulp.watch(['dist/**']).on('change', livereload.changed);

// });
