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
     */
    module.updateConfiguration = function(conf)
    {
        var tmp_path = app.node.os.tmpdir() + 'PawneeTemp.' + Date.now();
        app.node.exec('cat << "EOF" > ' + tmp_path + "\n" + conf + 'EOF', function(error, stdout, stderr)
        {
            app.logActivity(stderr);
            app.node.exec('sudo mv ' + tmp_path + ' ' + app.models.apache.confPath, function(error, stdout, stderr)
            {
                app.logActivity(stderr);
                if (stderr.search(/[^ \n]/g) !== -1)
                {
                    cached = conf;
                }
            });
        });
    };

    app.utils.apache.conf = module;

})(window.App);