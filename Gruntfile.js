module.exports = function (grunt) {

  grunt.initConfig({
    ngAnnotate: {
      options: {
        singleQuotes: true,
        regexp: '^(ng\n?[\\ ]+(.*)|(module.*))$',
      },
      bower: {
        files: [
          {
            expand: true,
            src: [
              'bower_components/angular/angular.js',
              'bower_components/angular-route/angular-route.js',
              'bower_components/angular-sanitize/angular-sanitize.js',
              'bower_components/angular-chart.js/dist/angular-chart.js',
              'bower_components/Chart.js/Chart.js',
              'bower_components/re-tree/re-tree.js',
              'bower_components/ng-device-detector/ng-device-detector.js',
            ],
            ext: '.annotated.js',
            extDot: 'last',
          },
        ],
      },
      app: {
        files: [
          {
            expand: true,
            src: [
              'src/client/app.js',
              'src/client/scripts/**/*.js',
            ],
            ext: '.annotated.js',
            extDot: 'last',
          },
        ],
      },
    },
    concat: {
      options: {
        separator: ';',
      },
      scripts: {
        src: [
          'bower_components/angular/angular.annotated.js',
          'bower_components/angular-route/angular-route.annotated.js',
          'bower_components/angular-sanitize/angular-sanitize.annotated.js',
          'bower_components/Chart.js/Chart.annotated.js',
          'bower_components/angular-chart.js/dist/angular-chart.annotated.js',
          'bower_components/re-tree/re-tree.annotated.js',
          'bower_components/ng-device-detector/ng-device-detector.annotated.js',
          'bower_components/KaTeX/dist/katex.min.js',
          'bower_components/KaTeX/dist/contrib/auto-render.min.js',
          'src/client/app.annotated.js',
          'src/client/scripts/**/*.annotated.js',
        ],
        dest: 'src/client/scripts.min.js',
      },
    },
    watch: {
      express: {
        files: ['src/**/*'],
        tasks: ['express:dev'],
      },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['ngAnnotate', 'concat', 'clean:annotated', 'express:dev'],
      },
      styles: {
        files: ['src/**/*.css'],
        tasks: ['cssmin'],
      },
      qa: {
        files: ['src/**/*.js', '!src/**/*.min.js'],
        tasks: ['jsdoc'],
        options: {
          spawn: false,
        },
      },
    },
    uglify: {
      options: {
        preserveComments: false,
      },
      scripts: {
        files: {
          'src/client/scripts.min.js': ['src/client/scripts.min.js'],
        },
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
      },
      target: {
        files: {
          'src/client/styles.min.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'src/client/styles/*.css',
            'bower_components/KaTeX/dist/katex.min.css',
          ],
        },
      },
    },
    copy: {
      build: {
        expand: true,
        cwd: 'src/',
        dest: 'build/',
        src: [
            'client/index.html',
            'client/app.js',
            'client/scripts.min.js',
            'client/styles.min.css',
            'client/views/**',
            'client/icons/**',
            'server/**',
        ],
      },
    },
    express: {
      dev: {
        options: {
          script: 'src/server/server.js',
        },
      },
      build: {
        options: {
          script: 'build/server/server.js',
          node_env: 'production',
        },
      },
    },
    clean: {
      annotated: ['**/*.annotated.js'],
      annotatedClient: ['src/client/**/*.annotated.js'],
      dev: ['src/client/scripts.min.js', 'src/client/styles.min.css'],
      build: ['build'],
    },
    jsdoc: {
      dist: {
        src: ['src/**/*.js', '!src/**/*.min.js'],
        options: {
          destination: 'doc',
          template: './node_modules/ink-docstrap/template',
          configure: './node_modules/ink-docstrap/template/jsdoc.conf.json',
        },
      },
    },
  });

  grunt.registerTask('default',
    ['clean:dev', 'ngAnnotate', 'concat', 'clean:annotated', 'cssmin', 'express:dev', 'watch']);

  grunt.registerTask('build',
    ['clean', 'ngAnnotate', 'concat', 'clean:annotated', 'uglify', 'cssmin', 'copy']);

  grunt.registerTask('stage',
    ['build', 'express:build', 'watch']);

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-ng-annotate');

};
