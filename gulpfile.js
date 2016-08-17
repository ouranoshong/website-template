var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var clean = require('gulp-dest-clean');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var vendorPath = 'vendors';

var vendors = require('./bower.json').vendors;


gulp.task('fonts', function(){
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('sass', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'  // 此配置使文件编译并输出压缩过的文件
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('dist'));
});

gulp.task('tpl', function() {
    return gulp.src('src/tpl/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('dist'));
});


gulp.task('sass:dev', function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('temp'))
        .pipe(reload({stream: true}));
});

gulp.task('js:dev', function () {
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('temp'))
        .pipe(reload({stream: true}));
});

gulp.task('tpl:dev', function () {
    return gulp.src(['src/tpl/*.pug', '!src/tpl/_*.pug'])
        .pipe(pug())
        .pipe(gulp.dest('temp'))
        .pipe(reload({stream: true}));
});

gulp.task('clean', function(){
    return gulp.src('src')
        .pipe(clean('dist'));
});

gulp.task('clean:dev', function(){
    return gulp.src('src')
        .pipe(clean('temp'));
});

gulp.task('dev', ['clean:dev','js:dev', 'sass:dev', 'tpl:dev'], function () {
    browserSync.init({
        server: {
            baseDir: ["./src", "./temp", "./" + vendorPath]  // 设置服务器的根目录为dist目录
        }
        // notify: false  // 开启静默模式
    });

    // 我们使用gulp的文件监听功能，来实时编译修改过后的文件
    gulp.watch('src/js/*.js', ['js:dev']);
    gulp.watch('src/sass/**/*.scss', ['sass:dev']);
    gulp.watch(['src/tpl/**/*.pug', 'src/tpl/**/*.html'], ['tpl:dev']);
});


gulp.task('build', ['clean','fonts', 'js', 'tpl', 'sass']);

gulp.task('vendors:clean', function(){
    return gulp.src('/')
        .pipe(clean(vendorPath));
});

gulp.task('vendors:jquery', function(){
    var destPath = vendorPath + '/jquery';
    return gulp.src(vendors.jquery.src)
        .pipe(clean(destPath))
        .pipe(gulp.dest(destPath));
});

gulp.task('vendors:materialize', function(){
    var destPath = vendorPath + '/materialize';
    return gulp.src(vendors.materialize.src)
        .pipe(clean(destPath))
        .pipe(gulp.dest(destPath));
});

gulp.task('vendors:materialize:sass', function(){
    var destPath = 'src/sass';
    return gulp.src(vendors.materialize.sass)
        .pipe(gulp.dest(destPath));
});

gulp.task('vendors:materialize:fonts', function(){
    var destPath = 'src/fonts';
    return gulp.src(vendors.materialize.fonts)
        .pipe(gulp.dest(destPath));
});
