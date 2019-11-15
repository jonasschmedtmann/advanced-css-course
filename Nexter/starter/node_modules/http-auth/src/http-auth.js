"use strict";

// Utils.
const utils = require('./auth/utils');

// http integration.
require('./server/http');

// https integration.
require('./server/https');

// http-proxy integration.
if (utils.isAvailable('http-proxy')) {
    require('./server/proxy');
}

// Exports.
module.exports = {
    // Basic authentication.
    basic: (options, checker) => {
        return require('./auth/basic')(options, checker);
    },

    // Digest authentication.
    digest: (options, checker) => {
        return require('./auth/digest')(options, checker);
    },

    // Connect.
    connect: (auth) => {
        return require('./server/connect')(auth);
    },

    // Koa.
    koa: (auth) => {
        return require('./server/koa')(auth);
    },

    // Passport.
    passport: (auth) => {
        return require('./server/passport')(auth);
    },

    // Hapi.
    hapi: () => {
        return require('./server/hapi');
    }
};