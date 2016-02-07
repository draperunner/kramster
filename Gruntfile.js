module.exports = function (grunt) {

    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            scripts: {
                src: ['client/scripts/**/*.js'],
                dest: 'client/scripts.min.js'
            }
        },
        watch: {
            express: {
                files: ['**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            },
            scripts: {
                files: ['client/scripts/**/*.js'],
                tasks: ['concat:scripts']
            },
            styles: {
                files: ['client/styles/**/*.css'],
                tasks: ['cssmin']
            }
        },
        uglify: {
            scripts: {
                files: {
                    'client/scripts.min.js': ['client/scripts.min.js']
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
                    'client/styles.min.css': ['client/styles/*.css']
                }
            }
        },
        copy: {
            prod: {
                files: [
                    // includes files within path and its sub-directories
                    {expand: true, src: ['client/index.html'], dest: 'build/'},
                    {expand: true, src: ['client/app.js'], dest: 'build/'},
                    {expand: true, src: ['client/scripts.min.js'], dest: 'build/'},
                    {expand: true, src: ['client/styles.min.css'], dest: 'build/'},
                    {expand: true, src: ['client/views/**'], dest: 'build/'},
                    {expand: true, src: ['client/icons/**'], dest: 'build/'},
                    {expand: true, src: ['bower_components/**'], dest: 'build/'},
                    {expand: true, src: ['server/**'], dest: 'build/'}
                ]
            }
        },
        express: {
            dev: {
                options: {
                    script: 'server/server.js'
                }
            },
            prod: {
                options: {
                    script: 'build/server/server.js',
                    node_env: 'production'
                }
            }
        },
        clean: {
            dev: ['client/scripts.min.js', 'client/styles.min.css'],
            prod: ['build']
        }
    });

    grunt.registerTask('default', ['clean:dev', 'concat', 'cssmin', 'express:dev', 'watch']);
    grunt.registerTask('prod', ['clean', 'concat', 'uglify', 'cssmin', 'copy:prod', 'express:prod', 'watch']);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-clean');

};
