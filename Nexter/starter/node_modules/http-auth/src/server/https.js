"use strict";

// HTTPS module.
const https = require('https');

// Base module.
const Base = require('../auth/base');

// Backup old server creation.
let oldCreateServer = https.createServer;

// Mutate server.
https.createServer = function() {
    let server = undefined;

    if (arguments[0] instanceof Base) {
        let auth = arguments[0];

        if (arguments[2]) {
            let listener = arguments[2];
            let newListener = (req, res) => {
                auth.check(req, res, (req, res, err) => {
                    if (err) {
                        console.error(err);
                        res.statusCode = 400;
                        res.end(err.message);
                    } else {
                        listener(req, res);
                    }
                });
            };

            // HTTPS options and listener.
            server = oldCreateServer.apply(https, [arguments[1], newListener]);
        } else {
            // Only HTTPS options.
            server = oldCreateServer.apply(https, [arguments[1]]);
            server.on('request', (req, res) => {
                auth.check(req, res);
            });
        }
    } else {
        server = oldCreateServer.apply(https, arguments);
    }

    // Return server.
    return server;
};