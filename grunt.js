module.exports = function(grunt) {
    grunt.initConfig({
        min: {
            dist: {
                src: [
                    'public/resources/js/json2.js',
                    'public/resources/js/jquery.restjson.js',
                    'public/resources/js/jquery.roundabout.js',
                    'public/resources/js/jquery.roundabout-shapes.js',
                    'public/resources/js/jquery.countdown.js',
                    'public/resources/js/jquery.countdown-he.js',
                    'public/resources/js/dust-full-1.1.1.js',
                    'public/resources/js/dust-helpers-1.1.0.js',
                    'public/resources/js/jquery.cloudinary.js',
                    'public/resources/js/compiled_templates.js',
                    'public/resources/js/scripts.js'
                ],
                dest: 'public/resources/js/build.min.js'
            }
        },

        mincss: {
            compress: {
                files: {
                    "public/resources/css/build.min.css": [
                        'public/resources/css/style.css'
                    ]
                }
            }
        }
    });

    //don't forget to npm install grunt-contrib-mincss :)
    grunt.loadNpmTasks('grunt-contrib-mincss');

    grunt.registerTask('default', 'min mincss');
};