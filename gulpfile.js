const gulp = require('gulp');
const ghPages = require('gulp-gh-pages-will');

gulp.task('deploy', () => gulp.src('./dashboard/**/*').pipe(ghPages()));
