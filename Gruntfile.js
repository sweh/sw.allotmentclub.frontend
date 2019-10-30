module.exports = function (grunt) {
    "use strict";
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.config.init({
        clean: {
            release: [
                './dist',
            ]
        },
        useminPrepare: {
            html: './index.html',
            options: {
                dest: './dist',
                flow: {
                    steps: {
                        template: ['concat'],
                        js: ['concat', 'uglifyjs'],
                        css: ['concat', 'cssmin']
                    },
                    post: {}
                }
            }
        },
        usemin: {
            html: ['./dist/index.html'],
            options: {
                blockReplacements: {
                    template: function (block) {
                        return '<script src="' + block.dest + '" type="text/x-handlebars-template"></script>';
                    }
                }
            }
        },
        uglify: {
            generated: {
                options: {
                    sourceMap: true
                }
            }
        },
        copy: {
            changes: {
                src: './CHANGES.txt',
                dest: './dist/CHANGES.txt'
            },
            htaccess: {
                src: './htaccess',
                dest: './dist/.htaccess'
            },
            favicon: {
                src: './favicon.ico',
                dest: './dist/favicon.ico',
            },
            maskicon: {
                src: './mask-icon.svg',
                dest: './dist/mask-icon.svg',
            },
            fonts: {
                expand: true,
                src: './fonts/*',
                dest: './dist/'
            },
            img: {
                expand: true,
                src: './img/*',
                dest: './dist/',
            },
            sound: {
                expand: true,
                src: './sound/*',
                dest: './dist/',
            },
            swf: {
                src: './copy_csv_xls.swf',
                dest: './dist/copy_csv_xls.swf'
            },
            letsencrypt: {
                expand: true,
                cwd: './.well-known',
                src: './acme-challenge/*',
                dest: './dist/.well-known/'
            }
        },
        'string-replace': {
            dist: {
                files: {
                    './dist/index.html': './index.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: 'enabled: false',
                            replacement: 'enabled: true'
                        }
                    ]
                }
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            source: {
                files: [{
                    src: [
                        './dist/optimized.js',
                        './dist/optimized.min.css',
                    ]
                }]
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: "ajja.templates",
                    processName: function (filePath) {
                        return filePath.split('/')[2].replace('.hbs', '');
                    }
                },
                files: {
                    "./js/templates.js": "./templates/*.hbs",
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', './js/app.*.js', './spec/javascripts/*.js']
        },
        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },
        bower_concat: {
            all: {
                dest: './js/bower.js',
                mainFiles: {
                    'markdown': ['lib/markdown.js'],
                    'bootstrap-markdown': [
                        'js/bootstrap-markdown.js',
                        'locale/bootstrap-markdown.de.js',
                    ],
                },
            },
        },
        wiredep: {
            task: {
                src: [
                    './index.html'
                ],
                exclude: [
                    './bower_components/bootstrap-markdown/css/bootstrap-markdown.min.css',
                    './bower_components/bootstrapvalidator/dist/css/bootstrapValidator.css',
                    './bower_components/datatables/media/css/jquery.dataTables.css',
                    './bower_components/datatables-colvis/css/dataTables.colVis.css',
                    './bower_components/datatables-tabletools/css/dataTables.tableTools.css',
                    './bower_components/dropzone/dist/min/dropzone.min.css',
                    './bower_components/jasmine/lib/jasmine-core/jasmine.js',
                    './bower_components/jasmine-jquery/lib/jasmine-jquery.js'
                ],
                options: {
                }
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: './dist/',
                    preferOnline: true,
                    verbose: true,
                    timestamp: false,
                    hash: true
                },
                src: [
                    'optimized.*.css',
                    'optimized.*.js',
                    'copy_csv_xls.swf',
                    'fonts/*',
                    'img/*',
                    'sound/*',
                ],
                dest: './dist/manifest.appcache'
            }
        },
        bump: {
            options: {
                files: ['bower.json', 'package.json', './js/app.baseview.js'],
                updateConfigs: [],
                commit: false,
                push: false,
                createTag: false,
                globalReplace: false,
                prereleaseName: 'dev',
                metadata: '',
                regExp: false
            }
        },
        jasmine : {
            allotmentclub: {
                src : [
                    './bower_components/moment/locale/de.js',
                    './js/templates.js',
                    './js/app.utils.js',
                    './js/app.location.js',
                    './js/app.baseview.js',
                    './js/app.navigation.js',
                    './js/app.login.js',
                    './js/app.home.js',
                    './js/app.map.js',
                    './js/app.account.js',
                    './js/app.mail.js',
                    './js/app.depot.js',
                    './js/app.member.js',
                    './js/app.assignment.js',
                    './js/app.protocol.js',
                    './js/app.bulletin.js',
                    './js/app.externals.js',
                    './js/app.keylist.js',
                    './js/app.electricity.js'
                ],
                options : {
                    specs : './spec/javascripts/**/*.js',
                    vendor: ['./js/bower.js', './js/smartadmin.min.js', './js/templates.js'],
                    styles: './dist/optimized.min.*.css',
                    junit: {
                        path: process.env.CIRCLE_TEST_REPORTS + '/backend',
                        consolidate: true
                    },
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage.json',
                        report: {
                            type: 'lcov',
                            options: {
                                dir: 'coverage'
                            }
                        },
                        thresholds: {
                            lines: 55,
                            statements: 55,
                            branches: 25,
                            functions: 45
                        }
                    }
                },
            }
        },
        connect: {
            server: {
                options: {
                    port: 8888,
                    keepalive: true,
                    base: {
                        path: '.',
                        options: {
                            index: '_SpecRunner.html'
                        }
                    },
                    open: true
                }
            }
        }
    });
    grunt.registerTask('default', [
        'handlebars:compile',
        'jshint:all',
        'bower:install',
        'bower_concat:all',
        'wiredep:task'
    ]);
    grunt.registerTask('test', [
        'jshint:all',
        'jasmine:allotmentclub:build',
        'connect',
    ]);
    grunt.registerTask('phantomjs', [
        'jshint:all',
        'jasmine:allotmentclub'
    ]);
    grunt.registerTask('all', [
        'clean',
        'handlebars:compile',
        'jshint:all',
        'bower:install',
        'bower_concat:all',
        'string-replace',
        'copy',
        'wiredep:task',
        'useminPrepare',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'filerev',
        'usemin',
        'manifest',
    ]);
};
