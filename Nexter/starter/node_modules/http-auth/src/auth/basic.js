"use strict";

// Base class.
const Base = require('./base');

// Utility module.
const utils = require('./utils');

// Importing apache-md5 module.
const md5 = require('apache-md5');

// Importing apache-crypt module.
const crypt = require('apache-crypt');

// Bcrypt.
const bcrypt = require('bcryptjs');

// Crypto.
const crypto = require('crypto');

// Define basic auth.
class Basic extends Base {
    // Constructor.
    constructor(options, checker) {
        super(options, checker);
    }

    // Verifies if password is correct.
    validate (hash, password) {
        if (hash.substr(0, 5) === '{SHA}') {
            hash = hash.substr(5);
            return hash === utils.sha1(password);
        } else if (hash.substr(0, 6) === '$apr1$' || hash.substr(0, 3) === '$1$') {
            return hash === md5(password, hash);
        } else if (hash.substr(0, 4) === '$2y$' || hash.substr(0, 4) === '$2a$') {
            return bcrypt.compareSync(password, hash);
        } else if (hash === crypt(password, hash)) {
            return true;
        } else if (hash.length === password.length) {
            return crypto.timingSafeEqual ?
                crypto.timingSafeEqual(new Buffer(hash), new Buffer(password)) : hash === password;
        }
    }

    // Processes line from authentication file.
    processLine (userLine) {
        let lineSplit = userLine.split(":");
        let username = lineSplit.shift();
        let hash = lineSplit.join(":");

        // Push user.
        this.options.users.push({username: username, hash: hash});
    }

    // Generates request header.
    generateHeader () {
        return `Basic realm=\"${this.options.realm}\"`;
    }

    // Parsing authorization header.
    parseAuthorization (header) {
        let tokens = header.split(" ");
        if (tokens[0] === "Basic") {
            return tokens[1];
        }
    }

    // Searching for user.
    findUser(req, hash, callback) {
        // Decode base64.
        let splitHash = utils.decodeBase64(hash).split(":");
        let username = splitHash.shift();
        let password = splitHash.join(":");

        let self = this;

        if (this.checker) {
            // Custom auth.
            this.checker.apply(this, [username, password, (result) => {
                let params = undefined;

                if (result instanceof Error) {
                    params = [result]
                } else {
                    params = [{ user: username, pass: !!result }];
                }

                callback.apply(self, params);
            }, req]);
        } else {
            // File based auth.
            let pass = false;

            // Loop users to find the matching one.
            this.options.users.forEach(user => {
                if (user.username === username && this.validate(user.hash, password)) {
                    pass = true;
                }
            });

            // Call final callback.
            callback.apply(this, [{user: username, pass: pass}]);
        }
    }
}

// Export basic auth.
module.exports = (options, checker) => {
    return new Basic(options, checker);
};