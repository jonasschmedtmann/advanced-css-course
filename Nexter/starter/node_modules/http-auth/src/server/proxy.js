"use strict";

// Proxy module.
const httpProxy = require('http-proxy');

// Base module.
const Base = require('../auth/base');

// Backup old server creation.
const oldCreateServer = httpProxy.createServer;

// New create server.
const newCreateServer = function(auth, options) {
    // Mutated mode.
    if (auth instanceof Base) {
        // Set proxy flag.
        auth.proxy = true;
    } else {
        // Set correct options.
        options = auth;

        // Clear authentication value.
        auth = null;
    }

    // Default listener plus authentication check.
    let server = oldCreateServer.apply(httpProxy, [options]);

    // Authentication provided.
    if (auth) {
        // Override proxyRequest.
        let oldProxyRequest = server.web;
        server.web = function (req, res) {
            // Fetch external arguments.
            let externalArguments = arguments;

            // Check for authentication.
            auth.check(req, res, (req, res, err) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 400;
                    res.end (err.message);
                } else {
                    oldProxyRequest.apply(server, externalArguments)
                }
            });
        };
    }

    // Return server.
    return server;
};

// Add authentication method.
httpProxy.createServer = httpProxy.createProxyServer = httpProxy.createProxy = newCreateServer;