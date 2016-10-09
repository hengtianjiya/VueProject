// 引入 gulp
var gulp = require('gulp');
/*var connect = require('gulp-connect');*/

// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-clean-css'),//css压缩
    less = require('gulp-less'),//解less
    sourcemaps = require('gulp-sourcemaps'),//添加map
    jshint = require('gulp-jshint'),//js检测
    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    replace = require('gulp-replace'),//替换字符串
    notify = require('gulp-notify'),//提示信息
    browserify = require("browserify"),//用来 require js 的模块
    del = require('del'),
    source = require("vinyl-source-stream"), //把 browserify 输出的数据进行准换，使之流符合 gulp 的标准
    plumber = require('gulp-plumber');

/*gulp.task('connect', function () {
  connect.server({
    root: 'app'
  });
});*/

// 清理生产目录文件

gulp.task('clean', function(cb) {
    del(['app/build/*.js','app/build/*.css','app/build/*.map','app/img/*.png','app/img/*.jpg','app/img/*.gif']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

//为css,js添加版本号
gulp.task('tmp', function(){
  return gulp.src(['app/source/*.html'])
    .pipe(replace(/\.js/g, '.js?t='+new Date().getTime()))
    .pipe(replace(/\.css/g, '.css?t='+new Date().getTime()))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app/'));
}); 

// 压缩图片
gulp.task('img', function() {
  return gulp.src(['app/source/img/**'])
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('app/img/'))
    .pipe(notify({ message: 'img task ok' }));
});
 
// 合并、压缩、重命名less
gulp.task('less', function() {
  return gulp.src('app/source/less/style.less')
    .pipe(plumber({errorHandler: function(err) {
      console.log(err);
      this.emit('end');
    }}))
    .pipe(sourcemaps.init())
  	.pipe(less())
  	.pipe(sourcemaps.write('/'))
  	.pipe(gulp.dest('app/build/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss({
      processImport:false
    }))
    .pipe(gulp.dest('app/build/'))
    .pipe(notify({ message: 'less task ok' }));
});
 
// 检查js
gulp.task('lint', function() {
  return gulp.src('app/source/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});
 
// 合并、压缩js文件
gulp.task('js', function() {
  return gulp.src([
      'app/source/js/component/**',
      'app/source/js/page/**',
      'app/source/js/filters.js',
      'app/source/js/routers.js',
      'app/source/js/main.js'
    ])
    .pipe(plumber({errorHandler: function(err) {
      console.log(err);
      this.emit('end');
    }}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('app/build/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('app/build/'))
    .pipe(notify({ message: 'js task ok' }));
});
 
// 默认任务
gulp.task('default', ['clean','tmp','less','lint', 'js','img'] , function(){

  gulp.watch('app/source/*.html', ['tmp']);

  // Watch .css files
  gulp.watch('app/source/less/*.less', ['less']);
 
  // Watch .js files
  gulp.watch('app/source/js/**', ['lint', 'js']);
 
  // Watch image files
  gulp.watch('app/source/img/**', ['img']);
});