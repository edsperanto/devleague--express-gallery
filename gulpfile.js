const gulp = require('gulp');
const scss = require('gulp-sass');

gulp.task('scss', _ => {
	return gulp.src('./scss/app.scss')
		.pipe(scss({ errLogToConsole: true }))
		.on('error', process.exit)
		.pipe(gulp.dest('./public/css'));
});

gulp.task('watch', _ => {
	gulp.watch('./scss/**/*.scss', ['scss']);
	gulp.watch('./gulpfile.js', process.exit);
});

gulp.task('default', ['watch']);
