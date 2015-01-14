/**
 * Apache utils
 */
(function(app, $)
{

    'use strict';

    var module = {};

    module.confPath = '/etc/apache2/httpd.conf';
    module.modulesPath = '/usr/libexec/apache2';

    app.utils.apache = module;

})(window.App, jQuery);