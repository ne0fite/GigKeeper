var publicPlugin = {
    register: function (server, options, next) {

        server.route({
            method: "GET",
            path: "/{param*}",
            config: {
                cors: {
                    origin: ["*"]
                },
                auth: false
            },
            handler: {
                directory: {
                    path: "www"
                }
            }
        });
        
        next();
    }
};

publicPlugin.register.attributes = {
    name: "publicPlugin",
    version: "0.0.1"
};

module.exports = publicPlugin;
