"use strict";

// Exporting connect integration.
module.exports = (auth) => {
    return (req, res, next) => {
        auth.check(req, res, (req, res, err) => {
            if (err) {
                next(err);
            } else {
                next();
            }
        });
    }
};