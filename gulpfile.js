const gulp = require('gulp');
const scss = require('gulp-sass');

gulp.task('scss', _ => {
	return gulp.src('./scss/app.scss')
		.pipe(scss({ errLogToConsole: true }))
		.pipe(gulp.dest('./public/css'));
});

/*
gulp.task('browserSync', _ => {
	browserSync.init(['./public'], {
		server: {
			baseDir: './public'
		}
	});
});
*/

/*
gulp.task('server', cb => {
	exec('nodemon server.js', (err, stdout, stderr) => {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});
*/

gulp.task('watch', _ => {
	gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('default', ['scss', 'watch']);
