module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    concat: {
      options: {
        separator: ';'
      },
      dest: {
        src: ['/public/**/*.js']
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },
//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    uglify: {
      files: [
        {
          cwd:'./public',
          src:['**/*.js'],
          dest: './public/dist',
          ext:'.min.js',
          extDot:'first'
        },
      ],
    },

    jshint: {
      files: [
        // Add filespec list here
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
        ]
      }
    },
//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    cssmin: {
      files: [
        {
          cwd: './public',
          src: ['./*.css'],
          dest: './public/dist',
          ext:'.min.css',
          extDot: 'first',
        }
      ],

        
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    grunt.task.run(['concat', 'uglify', 'cssmin'])
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      grunt.task.run(['server-dev']);
      // add your production server task here
    } else {
      grunt.task.run(['jshint', 'test', 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
      grunt.task.run(['build', 'upload'])
  ]);


};
