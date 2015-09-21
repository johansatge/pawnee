module.exports = function(grunt)
{

    'use strict';

    var exec = require('child_process').exec;
    var nwb = require('nw-builder');

    grunt.registerTask('default', []);

    /**
     * Runs the app
     */
    grunt.registerTask('run', function()
    {
        var done = this.async();
        var child = exec('/Applications/nwjs.app/Contents/MacOS/nwjs ./app');
        child.stdout.on('data', grunt.log.write);
        child.stderr.on('data', grunt.log.write);
        child.on('close', done);
    });

    /**
     * Builds the app
     */
    grunt.registerTask('build', function()
    {
        var builder = new nwb(
            {
                files: './app/**/**',
                version: '0.12.3',
                platforms: ['osx'],
                buildDir: './build',
                macCredits: false,
                macIcns: './assets/icns/icon.icns'
            });
        var done = this.async();
        grunt.log.writeln('Building app...');
        builder.build().then(function()
        {
            grunt.log.ok('Build done.');
            if (grunt.option('launch'))
            {
                exec('./build/Pawnee/osx/Pawnee.app/Contents/MacOS/nwjs');
            }
            done();
        }).catch(function(error)
        {
            grunt.log.error(error);
            done();
        });
    });

    /**
     * Basic SASS support
     */
    grunt.registerTask('sass', function()
    {
        var done = this.async();
        var child = exec('cd app/assets && compass watch sass/*');
        child.stdout.on('data', grunt.log.write);
        child.stderr.on('data', grunt.log.write);
        child.on('close', done);
    });

};