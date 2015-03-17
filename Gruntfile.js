module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist'],
    jshint: {
      beforeconcat: ['src/**/*.js']
    },
    concat: {
      dist: {
        src: [
          'src/**/*.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      build: {
        expand: true,
        cwd: 'src/',
        src: '*.js', // dist when using concat
        dest: 'dist',
        ext: '.x.min.js'
      }
    },
    karma: {
      1: {
        configFile: 'karma.1.x.conf.js'
      },
      2: {
        configFile: 'karma.2.x.conf.js'
      }
    },
    watch: {
      karma: {
        files: ['src/**/*.js', 'test/spec/**/*.js'],
        tasks: ['karma:unit:run']
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'test', 'clean', 'uglify']);
  grunt.registerTask('test', ['karma:2']);
  grunt.registerTask('test:watch', ['karma:unit:start','watch']);
  grunt.registerTask('default', ['test']);

};