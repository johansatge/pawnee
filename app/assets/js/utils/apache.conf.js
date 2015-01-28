/**
 * httpd.conf file manager
 * @todo backup httpd.conf before editing
 */
(function(app)
{

    'use strict';

    var module = {};

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
            if (callback)
            {
                callback();
            }
        });
    };

    app.utils.apache.conf = module;

})(window.App);