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
      coverage: paths.test + '/coverage'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: paths.src + '/**/*.js'
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: [paths.test + '/spec/**/*.js']
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
      test: {
        src: [paths.test + '/spec/**/*.js']
      },
      config: {
        src: ['*.js', paths.test + '/{,!(spec)}/*.js']
      }
    },

    coverage: {
      dist: {
        options: {
          thresholds: {
            statements: 97,
            branches: 80,
            functions: 100,
            lines: 97
          },
          dir: 'coverage',
          root: paths.test + ''
        }
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
    },
    karma: {
      dist: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.registerTask('build', ['clean', 'test', 'uglify']);
  grunt.registerTask('test', ['jscs', 'jshint', 'karma', 'coverage']);
  grunt.registerTask('default', ['build']);

};
