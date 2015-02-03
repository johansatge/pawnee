/**
 * Apache virtual hosts
 */
(function(app)
{

    'use strict';

    var module = {};

    /**
     * Gets the list of vhosts
     * @param callback
     */
    module.get = function(callback)
    {
        app.utils.apache.conf.getConfiguration(function(stdout)
        {
            var raw_vhosts = _parseConfigurationFile(stdout);
            var vhosts = [];
            for (var index = 0; index < raw_vhosts.length; index += 1)
            {
                vhosts.push(_parseVirtualHost(raw_vhosts[index]));
            }
            callback(vhosts);
        });
    };

    /**
     * Sets a virtual host (adds or edits)
     * @param virtual_host
     * @param data
     * @param callback
     */
    module.set = function(virtual_host, data, callback)
    {
        app.logActivity(app.locale.apache.set_vhost);
        app.utils.apache.conf.getConfiguration(function(stdout)
        {
            var new_virtual_host = '';
            new_virtual_host += '<VirtualHost ' + data.ip + ':' + data.port + '>\n';
            new_virtual_host += data.document_root !== '' ? '    DocumentRoot ' + data.document_root + '\n' : '';
            new_virtual_host += data.server_name !== '' ? '    ServerName ' + data.server_name + '\n' : '';
            new_virtual_host += '</VirtualHost>' + '\n';
            var updated_httpd = virtual_host !== false ? stdout.replace(virtual_host.raw, new_virtual_host) : stdout + '\n' + new_virtual_host;
            app.utils.apache.conf.updateConfiguration(updated_httpd, callback);
        });
    };

    /**
     * Deletes a virtual host
     * @param virtual_host
     * @param callback
     */
    module.delete = function(virtual_host, callback)
    {
        app.logActivity(app.locale.apache.delete_vhost);
        app.utils.apache.conf.getConfiguration(function(stdout)
        {
            var updated_httpd = stdout.replace(virtual_host.raw, '\n');
            app.utils.apache.conf.updateConfiguration(updated_httpd, callback);
        });
    };

    /**
     * Parses the given virtual host
     * @param raw_vhost
     * @returns object
     */
    var _parseVirtualHost = function(raw_vhost)
    {
        var vhost = {};
        vhost.id = app.node.crypto.createHash('md5').update(raw_vhost).digest('hex');
        vhost.raw = raw_vhost;
        var document_root = new RegExp(/DocumentRoot[ "]+([^";\n]+)/i).exec(raw_vhost);
        vhost.document_root = document_root !== null && typeof document_root[1] !== 'undefined' ? document_root[1] : '';
        var server_name = new RegExp(/ServerName[ "]+([^";\n]+)/i).exec(raw_vhost);
        vhost.server_name = server_name !== null && typeof server_name[1] !== 'undefined' ? server_name[1] : '';
        var ip = new RegExp(/<VirtualHost +([^:]+):([^>]+)>/i).exec(raw_vhost);
        vhost.ip = ip !== null && typeof ip[1] !== 'undefined' ? ip[1] : '';
        vhost.port = ip !== null && typeof ip[2] !== 'undefined' ? ip[2] : '';
        vhost.name = vhost.server_name !== '' ? vhost.server_name : '--';
        return vhost;
    };

    /**
     * Looks for vhosts in httpd.conf
     * @param httpd
     * @returns Array
     */
    var _parseConfigurationFile = function(httpd)
    {
        var lines = httpd.split('\n');
        var raw_vhosts = [];
        var current_vhost = false;
        for (var index = 0; index < lines.length; index += 1)
        {
            if (lines[index].search(/ *?<VirtualHost/i) !== -1)
            {
                current_vhost = raw_vhosts.length;
                raw_vhosts[current_vhost] = '';
            }
            if (current_vhost !== false)
            {
                raw_vhosts[current_vhost] += lines[index] + '\n';
            }
            if (lines[index].search(/ *?<\/VirtualHost>/i) !== -1)
            {
                current_vhost = false;
            }
        }
        return raw_vhosts;
    };

    app.utils.apache.virtualhost = module;

})(window.App);