module.exports = function Grunt(grunt) {
  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015'],
      },
      dist: {
        expand: true,
        cwd: 'dist/client',
        src: '*.js',
        dest: 'dist/client',
      },
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
        regexp: '^(ng\n?[\\ ]+(.*)|(module.*))$',
      },
      app: {
        files: [
          {
            expand: true,
            src: ['src/client/**/*.js', '!src/client/**/*.min.js'],
            dest: 'dist/client',
            flatten: true,
          },
        ],
      },
    },
    concat: {
      options: {
        separator: ';',
      },
      bower: {
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-route/angular-route.js',
          'bower_components/angular-sanitize/angular-sanitize.js',
          'bower_components/Chart.js/Chart.js',
          'bower_components/angular-chart.js/dist/angular-chart.js',
          'bower_components/re-tree/re-tree.js',
          'bower_components/ng-device-detector/ng-device-detector.js',
          'bower_components/KaTeX/dist/katex.min.js',
          'bower_components/KaTeX/dist/contrib/auto-render.min.js',
        ],
        dest: 'dist/client/bower.min.js',
      },
      scripts: {
        src: [
          'dist/client/app.js',
          'dist/client/**/*.js',
        ],
        dest: 'dist/client/scripts.min.js',
      },
    },
    watch: {
      express: {
        files: [
          'src/server/**/*',
        ],
        tasks: ['express'],
        options: {
          spawn: false,
        },
      },
      scripts: {
        files: ['src/client/**/*.js'],
        tasks: ['ngAnnotate', 'babel', 'concat:scripts'],
      },
      styles: {
        files: ['src/client/**/*.css', '!src/client/**/*.min.css'],
        tasks: ['cssmin'],
      },
      qa: {
        files: ['src/**/*.js', '!src/**/*.min.js'],
        tasks: ['jsdoc'],
      },
    },
    uglify: {
      options: {
        preserveComments: false,
      },
      scripts: {
        files: {
          'dist/client/bower.min.js': ['dist/client/bower.min.js'],
          'dist/client/scripts.min.js': ['dist/client/scripts.min.js'],
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
          'dist/client/styles.min.css': [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/KaTeX/dist/katex.min.css',
            'src/client/**/*.css',
            '!src/client/**/*.min.css',
          ],
        },
      },
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'src/',
        dest: 'dist/',
        src: [
          'client/index.html',
          'client/**/*.html',
          'client/assets/**',
          'server/**',
        ],
      },
    },
    express: {
      dist: {
        options: {
          script: 'dist/server/server.js',
        },
      },
    },
    clean: {
      dev: ['src/client/scripts.min.js', 'src/client/styles.min.css'],
      scripts: ['dist/client/*.js', '!dist/client/*.min.js'],
      dist: ['dist'],
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

  grunt.registerTask('default', ['base', 'express', 'watch']);

  grunt.registerTask('base',
    ['clean', 'ngAnnotate', 'babel', 'concat', 'clean:scripts', 'cssmin', 'copy']);

  grunt.registerTask('build', ['base', 'uglify']);

  grunt.registerTask('stage', ['build', 'express', 'watch']);

  grunt.loadNpmTasks('grunt-babel');
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
