"use strict";

// Export middleware.
module.exports = (auth) => {
    // Middleware for koa.
    const koa = (req, res, next) => {
        auth.check(req, res, (req, res, err) => {
            if (err) {
                throw err;
            } else {
                next();
            }
        });
    };

    // Return middleware.
    return function *(next) {
        yield koa.bind(null, this.req, this.res);
        yield next;
    };
};