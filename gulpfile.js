var gulp = require('gulp');
var babel = require('gulp-babel');
var rename = require('gulp-rename');

gulp.task('default', function () {
    return gulp.src('src/*.es6.js')
        .pipe(babel())
        .pipe(rename(function (path) {
          var filename = path.basename;
          // remove es6
          var idx = filename.indexOf('.es6');
          path.basename = filename.substring(0, idx);
        }))
        .pipe(gulp.dest('compiled'));
});
