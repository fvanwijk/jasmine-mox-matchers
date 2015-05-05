module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      src: 'src',
      test: 'test',
      dist: 'dist'
    },
    clean: {
      dist: 'dist',
      coverage: 'test/coverage'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= paths.src %>/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['<%= paths.test %>/spec/{,*/}*.js']
      }
    },
    jscs: {
      options: {
        config: './.jscsrc'
      },
      all: {
        files: {
          src: ['<%= paths.src %>/src/{,**/}*.js']
        }
      },
      test: {
        src: ['test/{,**/}*.js']
      }
    },

    lintspaces: {
      options: {
        newline: true,
        newlineMaximum: 2,
        trailingspaces: true
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= paths.src %>/{,**/}*.js'
        ]
      },
      test: {
        src: [
          'test/{,**/}*.js'
        ]
      }
    },

    jsonlint: {
      src: '<%= paths.test %>/mock/**/*.json'
    },
    coverage: {
      dist: {
        options: {
          thresholds: {
            statements: 10,
            branches: 10,
            functions: 10,
            lines: 10
          },
          dir: 'coverage',
          root: 'test'
        }
      }
    },
    concat: {
      dist: {
        src: [
          '<%= paths.src %>/**/*.js'
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