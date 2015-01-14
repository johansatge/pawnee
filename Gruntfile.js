module.exports = function(grunt)
{

    'use strict';

    var exec = require('child_process').exec;
    var nwb = require('node-webkit-builder');

    grunt.registerTask('default', []);

    /**
     * Runs the app
     * Use the "--dev" option to enable toolbars and debug
     */
    grunt.registerTask('run', function()
    {
        setDevMode(grunt.option('dev') === true);
        var done = this.async();
        var child = exec('/Applications/nwjs.app/Contents/MacOS/nwjs ./app');
        child.stdout.on('data', grunt.log.write);
        child.stderr.on('data', grunt.log.write);
        child.on('close', done);
    });

    /**
     * Toggles dev mode
     * @param enable
     */
    function setDevMode(enable)
    {
        grunt.file.write('./app/.dev', enable ? '1' : '0', {encoding: 'utf8'});
    }

};