module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  var paths = {
    src: 'src',
    test: 'test'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    }
  });

  grunt.registerTask('test', ['jscs', 'jshint']);
  grunt.registerTask('default', ['test']);

};
