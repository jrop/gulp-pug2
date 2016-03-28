'use strict'

const del = require('del')
const frontMatter = require('gulp-front-matter')
const gulp = require('gulp')
const pug = require('gulp-pug2')

gulp.task('default', function () {
	gulp.src([ 'src/**/*.pug', '!src/layout.pug' ])
		.pipe(frontMatter())
		.pipe(pug())
		.pipe(gulp.dest('build'))
})

gulp.task('clean', () => del('build'))
