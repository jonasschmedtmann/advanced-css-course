"use strict";

// HTTP authentication scheme.
const httpScheme = (server, auth) => {
    return {
        authenticate: (request, reply) => {
            // Is auth.
            auth.isAuthenticated(request, (result) => {
                if (result instanceof Error) {
                    return reply(result, null, { credentials: null });
                } else if (!result.pass) {
                    let header = auth.generateHeader(result);
                    return reply(auth.options.msg401).code(401).header('WWW-Authenticate', header);
                } else {
                    return reply.continue({credentials: { name: result.user }});
                }
            });

        }
    }
};

// Export plugin.
exports.register = (plugin, options, next) => {
    plugin.auth.scheme('http', httpScheme);
    next();
};

// Export attributes.
exports.register.attributes = {
    pkg: require('../../package.json')
};
