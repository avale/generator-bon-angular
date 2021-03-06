'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles-reload', ['styles'], function() {
  return buildStyles()
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return buildStyles();
});

var buildStyles = function() {
<% if (props.cssPreprocessor.extension === 'scss') { -%>
  var sassOptions = {
    outputStyle: 'expanded',
    precision: 10
  };
<% } -%>

  var injectFiles = gulp.src([
<% if (props.cssPreprocessor.extension === 'scss') { -%>
    path.join(conf.paths.src, '/assets/styles/base.scss'),
<% } -%>
    path.join(conf.paths.src, '/app/**/*.<%- props.cssPreprocessor.extension %>'),
    path.join('!' + conf.paths.src, '/app/app.<%- props.cssPreprocessor.extension %>')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/app/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

<% if (props.cssPreprocessor.key === 'ruby-sass') { -%>
  var cssFilter = $.filter('**/*.css', { restore: true });
<% } -%>

  return gulp.src([
    path.join(conf.paths.src, '/app/app.<%- props.cssPreprocessor.extension %>')
  ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
<% if (props.cssPreprocessor.key === 'ruby-sass') { -%>
    .pipe($.rubySass(sassOptions)).on('error', conf.errorHandler('RubySass'))
    .pipe(cssFilter)
    .pipe($.sourcemaps.init({ loadMaps: true }))
<% } else { -%>
    .pipe($.sourcemaps.init())
<% } if (props.cssPreprocessor.key === 'node-sass') { -%>
    .pipe($.sass(sassOptions)).on('error', conf.errorHandler('Sass'))
<% } -%>
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
<% if (props.cssPreprocessor.key === 'ruby-sass') { -%>
    .pipe(cssFilter.restore)
<% } -%>
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
};
