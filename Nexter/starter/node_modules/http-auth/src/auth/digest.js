"use strict";

// Base class.
const Base = require('./base');

// Utility module.
const utils = require('./utils');

// Unique id.
const uuid = require('uuid');

// Define digest auth.
class Digest extends Base {
    // Constructor.
    constructor(options, checker) {
        super(options, checker);

        // Array of random strings sent to clients.
        this.nonces = [];

        // Algorithm of encryption, could be MD5 or MD5-sess, default is MD5.
        if ('MD5-sess' !== options.algorithm) {
            this.options.algorithm = "MD5";
        }

        // Quality of protection is by default auth.
        if (options.qop === 'none') {
            this.options.qop = '';
        } else {
            this.options.qop = 'auth';
        }
    }

    // Process user line.
    processLine(line) {
        let tokens = line.split(":");

        // We need only users for given realm.
        if (this.options.realm === tokens[1]) {
            this.options.users.push({username: tokens[0], hash: tokens[2]});
        }
    }

    // Parse authorization heder.
    parseAuthorization(header) {
        let opts = {};
        let parts = header.split(' ');
        let params = parts.slice(1).join(' ');

        // Split the parameters by comma.
        let tokens = params.split(/,(?=(?:[^"]|"[^"]*")*$)/);
        if (parts[0].substr(0, 6) === "Digest") {
            // Parse parameters.
            let i = 0;
            let len = tokens.length;

            while (i < len) {
                // Strip quotes and whitespace.
                let param = /(\w+)=["]?([^"]*)["]?$/.exec(tokens[i]);
                if (param) {
                    opts[param[1]] = param[2];
                }

                ++i;
            }

        }

        // Return options.
        return opts;
    }

    // Validating hash.
    validate(ha2, co, hash) {
        let ha1 = hash;

        // Algorithm.
        if (co.algorithm === 'MD5-sess') {
            ha1 = utils.md5(`${ha1}:${co.nonce}:${co.cnonce}`);
        }

        let response = undefined;

        // Quality of protection.
        if (co.qop) {
            response = utils.md5(`${ha1}:${co.nonce}:${co.nc}:${co.cnonce}:${co.qop}:${ha2}`);
        } else {
            response = utils.md5(`${ha1}:${co.nonce}:${ha2}`);
        }

        // If calculated response is equal to client's response.
        return response === co.response;
    }

    // Searching for user.
    findUser(req, co, callback) {
        let self = this;

        if (this.validateNonce(co.nonce, co.qop, co.nc)) {
            let ha2 = utils.md5(`${req.method}:${co.uri}`);
            if (this.checker) {
                // Custom authentication.
                this.checker.apply(this, [co.username, (hash) => {
                    let params = undefined;

                    if (hash instanceof Error) {
                        params = [hash];
                    } else {
                        params = [{user: co.username, pass: !!self.validate(ha2, co, hash)}];
                    }

                    // Call callback.
                    callback.apply(this, params);
                }, req]);
            } else {
                let pass = false;

                // File based, loop users to find the matching one.
                this.options.users.forEach(user => {
                    if (user.username === co.username && this.validate(ha2, co, user.hash)) {
                        pass = true;
                    }
                });

                callback.apply(this, [{user: co.username, pass: pass}]);
            }
        } else {
            callback.apply(this, [{stale: true}]);
        }
    }

    // Remove nonces.
    removeNonces(noncesToRemove) {
        noncesToRemove.forEach(nonce => {
            let index = this.nonces.indexOf(nonce);
            if (index != -1) {
                this.nonces.splice(index, 1);
            }
        });
    }

    // Validate nonce.
    validateNonce(nonce, qop, nc) {
        let found = false;

        // Current time.
        let now = Date.now();

        // Nonces for removal.
        let noncesToRemove = [];

        // Searching for not expired ones.
        this.nonces.forEach(serverNonce => {
            if ((serverNonce[1] + 3600000) > now) {
                if (serverNonce[0] === nonce) {
                    if (qop) {
                        if (nc > serverNonce[2]) {
                            found = true;
                            ++ serverNonce[2];
                        }
                    } else {
                        found = true;
                    }
                }
            } else {
                noncesToRemove.push(serverNonce);
            }
        });

        // Remove expired nonces.
        this.removeNonces(noncesToRemove);

        return found;
    }

    // Generates and returns new random nonce.
    askNonce() {
        let nonce = utils.md5(uuid());
        this.nonces.push([nonce, Date.now(), 0]);

        return nonce;
    }

    // Generates request header.
    generateHeader(result) {
        let nonce = this.askNonce();
        let stale = result.stale ? true : false;

        // Returning it.
        return `Digest realm=\"${this.options.realm}\", qop=\"${this.options.qop}\", nonce=\"${nonce}\", algorithm=\"${this.options.algorithm}\", stale=\"${stale}\"`;
    }
}

// Export digest auth.
module.exports = (options, checker) => {
    return new Digest(options, checker);
};