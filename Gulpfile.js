'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var del = require('del');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('clean:build', function() {
  del(['./build'])
})

gulp.task('backend:build', function() {
  return gulp.src([ './app/server.js' ])
    .pipe(gulp.dest('./build'));
});

gulp.task('html', function() {
  gulp.src([ './app/public/**/*.html' ])
    .pipe(gulp.dest( './build/public' ));
});

gulp.task('serve:static', [ 'backend:build', 'webpack', 'html' ], function() {
  nodemon({
    script: './build/server.js'
  })
    .on('restart', function() {
      console.log( 'gulp-nodemon restarted at ' + new Date().getTime() );
    })
});

gulp.task('sync', function() {
  browserSync.init({
    proxy: 'http://localhost:9000'
  })
})

gulp.task('webpack', function() {
  gulp.src([ './app/public/js/master.js' ])
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      }
    }))
    .pipe(gulp.dest('./build/public/js/'))
});

gulp.task('watch', function() {
  gulp.watch(['./app/public/js/**/*.js'], [ 'webpack', reload ]);
  gulp.watch(['./app/server.js'], ['backend:build']);
});

gulp.task('serve:dev', [ 'serve:static', 'sync', 'watch' ]);
