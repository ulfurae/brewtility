'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint');
 
 
gulp.task('inspect', function() {
	return gulp.src(['./**/*.js', '!node_modules/**/*.js', '!brewtility/**/*.js'])
    	.pipe(jshint('project.jshintrc'))
	    .pipe(jshint.reporter('jshint-stylish'));
});
 
gulp.task('default', ['inspect']);