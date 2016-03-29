'use strict'

const chai = require('chai')
chai.should()

const co = require('co')
const pug = require('../index')
const through2 = require('through2')
const vfs = require('vinyl-fs')

function streamShouldError(stream) {
	return new Promise((yes, no) => {
		stream
			.on('error', e => yes())
			.on('end', () => no(new Error('No error was thrown')))
			.on('data', d => d)
	})
}

describe('gulp-pug2', function () {
	it('should render pug templates', function (done) {
		vfs.src('test/sample.pug')
			.pipe(pug({ title: 'World' }))
			.pipe(through2.obj(function (file, enc, callback) {
				file.contents.toString().should.equal('Hello World!')
				done()
			}))
	})

	it('should compile pug templates', function (done) {
		vfs.src('test/sample.pug')
			.pipe(pug.compile())
			.pipe(through2.obj(function (file, enc, callback) {
				var tplFunction = eval(file.contents.toString())
				tplFunction({ title: 'Pug' }).should.equal('Hello Pug!')
				done()
			}))
	})

	it('render should throw errors non-bufferred content', co.wrap(function * (done) {
		yield streamShouldError(vfs.src('test/sample.pug', { buffer: false })
			.pipe(pug()))
	}))

	it('render should throw errors non-read content', co.wrap(function * (done) {
		yield streamShouldError(vfs.src('test/sample.pug', { read: false })
			.pipe(pug()))
	}))

	it('compile should throw errors non-bufferred content', co.wrap(function * (done) {
		yield streamShouldError(vfs.src('test/sample.pug', { buffer: false })
			.pipe(pug.compile()))
	}))

	it('compile should throw errors non-read content', co.wrap(function * (done) {
		yield streamShouldError(vfs.src('test/sample.pug', { read: false })
			.pipe(pug.compile()))
	}))
})
