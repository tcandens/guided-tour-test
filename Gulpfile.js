'use strict';

var gulp = require('gulp');
var webpack = require('webpack-stream');
var del = require('del');
var nodemon = require('gulp-nodemon');
var stylus = require('gulp-stylus');
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

gulp.task('stylus', function() {
  gulp.src([ './app/public/stylus/master.styl' ])
    .pipe( stylus() )
    .pipe( gulp.dest('./build/public/css/'))
})

gulp.task('serve:static', [ 'backend:build', 'webpack', 'html', 'stylus' ], function() {
  nodemon({
    script: './build/server.js'
  })
    .on('restart', function() {
      var t = new Date();
      console.log( 'gulp-nodemon restarted at ' + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() );
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
  gulp.watch(['./app/public/**/*.html'], ['html', reload ])
  gulp.watch(['./app/public/stylus/**/*.styl'], ['stylus', reload ])
});

gulp.task('serve:dev', [ 'serve:static', 'sync', 'watch' ]);

gulp.task('build', [ 'backend:build', 'webpack', 'html', 'stylus' ]);
