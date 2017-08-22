var gulp = require('gulp');
var postcss =require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var cssnano = require('cssnano');
var stylelint = require('stylelint');
var reporter = require('postcss-reporter');
var scss = require('gulp-sass');
var cssvar = require('postcss-css-variables');
var cssmixins = require('postcss-mixins');
var calc = require('postcss-calc');

gulp.task('lint-styles',['scss'],function(){
	return gulp.src("src/css/*.css")
			.pipe(postcss([stylelint({
					"rules" : {
						"color-no-invalid-hex": true,
					}
				}),
				reporter({
					clearMessage : true,
				})
			]))
})

gulp.task('scss',function(){
	return gulp.src('src/scss/**/*.scss')
				.pipe(scss().on('error',scss.logError))
				.pipe(gulp.dest('src/css'));
})

gulp.task('styles',function(){
	return gulp.src('src/css/*.css')
			.pipe(postcss([
				autoprefixer,
				cssvar(),
				cssmixins(),
				calc()
			]))
			.pipe(gulp.dest('dist/css/'));
});

gulp.task('minify',['styles'],function(){
	return gulp.src('dist/css/*.css')
			.pipe(postcss([ cssnano ]))
			.pipe(rename({
				suffix: ".min"
			}))
			.pipe(gulp.dest("dist/css/min"));
});

gulp.task('sourcemaps',['minify'],function(){
	return gulp.src('dist/css/**/*.css')
	.pipe(sourcemaps.init())
	.pipe(sourcemaps.write(''))
	.pipe(gulp.dest("dist/css/"));
})



gulp.task('default',['styles']);

var watcher = gulp.watch('src/css/*.css',['default']);
watcher.on('change',function(event){
	console.log('File'+event.path+'was'+event.type+'running tasks...');
});