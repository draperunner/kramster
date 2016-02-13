module.exports = function (grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            scripts: {
                src: ['src/client/scripts/**/*.js'],
                dest: 'src/client/scripts.min.js'
            }
        },
        watch: {
            express: {
                files: ['src/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['src/client/scripts/**/*.js'],
                tasks: ['concat:scripts']
            },
            styles: {
                files: ['src/client/styles/**/*.css'],
                tasks: ['cssmin']
            }
        },
        uglify: {
            scripts: {
                files: {
                    'src/client/scripts.min.js': ['src/client/scripts.min.js']
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'src/client/styles.min.css': ['src/client/styles/*.css']
                }
            }
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
                    'server/**'
                ]
            },
            package: {
                expand: true,
                src: ['bower.json', 'package.json'],
                dest: 'build/'
            }
        },
        express: {
            dev: {
                options: {
                    script: 'src/server/server.js'
                }
            },
            build: {
                options: {
                    script: 'build/server/server.js',
                    node_env: 'production'
                }
            }
        },
        clean: {
            dev: ['src/client/scripts.min.js', 'src/client/styles.min.css'],
            build: ['build']
        }
    });

    grunt.registerTask('default', ['clean:dev', 'concat', 'cssmin', 'express:dev', 'watch']);
    grunt.registerTask('staging', ['clean', 'concat', 'uglify', 'cssmin', 'copy', 'express:build', 'watch']);
    grunt.registerTask('build', ['clean', 'concat', 'uglify', 'cssmin', 'copy']);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-clean');

};
