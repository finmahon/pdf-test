'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'lib/**/*.js'
      ]
    },

    watch: {
      js: {
        files: ['gruntfile.js', 'application.js', 'lib/**/*.js', 'test/**/*.js'],
        options: {
          livereload: 35799
        }
      },
      html: {
        files: ['public/views/**', 'app/views/**'],
        options: {
          livereload: 35799
        }
      }
    },
    nodemon: {
      dev: {
        script: 'application.js',
        options: {
          args: [],
          ignore: ['public/**'],
          ext: 'js,html',
          nodeArgs: [],
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      serve: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      options: {},
      // environment variables - see https://github.com/jsoverson/grunt-env for more information
      local: {}
    },
    shell: {
      unit: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'env NODE_PATH=. ./node_modules/.bin/mocha -A -u exports --recursive test/unit/'
      },
      accept: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: 'env NODE_PATH=. ./node_modules/.bin/mocha -A -u exports --recursive test/server.js test/accept/'
      },
      coverage_unit: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'rm -rf coverage cov-unit',
          'env NODE_PATH=. ./node_modules/.bin/istanbul cover --dir cov-unit ./node_modules/.bin/_mocha -- -A -u exports --recursive test/unit/',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      },
      coverage_accept: {
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        },
        command: [
          'rm -rf coverage cov-accept',
          'env NODE_PATH=. ./node_modules/.bin/istanbul cover --dir cov-accept ./node_modules/.bin/_mocha -- -A -u exports --recursive test/server.js test/accept/',
          './node_modules/.bin/istanbul report',
          'echo "See html coverage at: `pwd`/coverage/lcov-report/index.html"'
        ].join('&&')
      }
    },
    open: {
      platoReport: {
        path: './plato/index.html',
        app: 'Google Chrome'
      }
    },
    plato: {
      src: {
        options: {
          jshint: grunt.file.readJSON('.jshintrc')
        },
        files: {
          'plato': ['lib/**/*.js']
        }
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  // Testing tasks
  grunt.registerTask('test', ['shell:unit', 'shell:accept']);
  grunt.registerTask('unit', ['shell:unit']);
  grunt.registerTask('accept', ['env:local', 'shell:accept']);

  // Coverate tasks
  grunt.registerTask('coverage', ['shell:coverage_unit', 'shell:coverage_accept']);
  grunt.registerTask('coverage-unit', ['shell:coverage_unit']);
  grunt.registerTask('coverage-accept', ['env:local', 'shell:coverage_accept']);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  grunt.registerTask('analysis', ['plato:src', 'open:platoReport']);

  grunt.registerTask('serve', ['env:local', 'concurrent:serve']);
  grunt.registerTask('default', ['serve']);
};
