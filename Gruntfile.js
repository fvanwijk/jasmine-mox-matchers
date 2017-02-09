module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var paths = {
    src: 'src',
    test: 'test',
    dist: 'dist'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: paths.dist,
      coverage: 'coverage'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: paths.src + '/**/*.js'
      },
      config: {
        src: ['*.js', paths.test + '/{,!(spec)}/*.js']
      }
    },
    jscs: {
      options: {
        config: './.jscsrc'
      },
      all: {
        files: {
          src: [paths.src + '/**/*.js']
        }
      },
      config: {
        src: ['*.js', paths.test + '/{,!(spec)}/*.js']
      }
    },
    concat: {
      dist: {
        src: [
          paths.src + '/**/*.js'
        ],
        dest: paths.dist + '/<%= pkg.name %>.js'
      }
    },
    uglify: {
      build: {
        expand: true,
        cwd: 'src/',
        src: '*.js', // dist when using concat
        dest: paths.dist,
        ext: '.min.js'
      }
    }
  });

  grunt.registerTask('build', ['clean', 'test', 'uglify']);
  grunt.registerTask('test', ['jscs', 'jshint']);
  grunt.registerTask('default', ['build']);

};
