/**
 * httpd.conf file manager
 * @todo backup httpd.conf before editing
 */
(function(app)
{

    'use strict';

    var module = {};
    var cached = false;

    /**
     * Gets httpd.conf
     * @param callback
     */
    module.getConfiguration = function(callback)
    {
        if (cached !== false)
        {
            callback(cached);
        }
        else
        {
            app.node.exec('cat ' + app.models.apache.confPath, function(error, stdout, stderr)
            {
                app.logActivity(stderr);
                callback(stdout);
            });
        }
    };

    /**
     * Updates httpd.conf
     * @param conf
     * @param callback
     */
    module.updateConfiguration = function(conf, callback)
    {
        var update_command = 'sudo cat << "EOF" > ' + app.models.apache.confPath + "\n" + conf + 'EOF';
        app.node.exec(update_command, function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            if (stderr.search(/[^ \n]/g) !== -1)
            {
                cached = conf;
            }
            if (callback)
            {
                callback();
            }
        });
    };

    app.utils.apache.conf = module;

})(window.App);