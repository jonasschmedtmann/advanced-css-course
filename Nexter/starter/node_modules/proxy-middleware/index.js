var os = require('os');
var http = require('http');
var https = require('https');
var owns = {}.hasOwnProperty;

module.exports = function proxyMiddleware(options) {
  //enable ability to quickly pass a url for shorthand setup
  if(typeof options === 'string'){
      options = require('url').parse(options);
  }

  var httpLib = options.protocol === 'https:' ? https : http;
  var request = httpLib.request;

  options = options || {};
  options.hostname = options.hostname;
  options.port = options.port;
  options.pathname = options.pathname || '/';

  return function (req, resp, next) {
    var url = req.url;
    // You can pass the route within the options, as well
    if (typeof options.route === 'string') {
      if (url === options.route) {
        url = '';
      } else if (url.slice(0, options.route.length) === options.route) {
        url = url.slice(options.route.length);
      } else {
        return next();
      }
    }

    //options for this request
    var opts = extend({}, options);
    if (url && url.charAt(0) === '?') { // prevent /api/resource/?offset=0
      if (options.pathname.length > 1 && options.pathname.charAt(options.pathname.length - 1) === '/') {
        opts.path = options.pathname.substring(0, options.pathname.length - 1) + url;
      } else {
        opts.path = options.pathname + url;
      }
    } else if (url) {
      opts.path = slashJoin(options.pathname, url);
    } else {
      opts.path = options.pathname;
    }
    opts.method = req.method;
    opts.headers = options.headers ? merge(req.headers, options.headers) : req.headers;

    applyViaHeader(req.headers, opts, opts.headers);

    if (!options.preserveHost) {
      // Forwarding the host breaks dotcloud
      delete opts.headers.host;
    }

    var myReq = request(opts, function (myRes) {
      var statusCode = myRes.statusCode
        , headers = myRes.headers
        , location = headers.location;
      // Fix the location
      if (((statusCode > 300 && statusCode < 304) || statusCode === 201) && location && location.indexOf(options.href) > -1) {
        // absoulte path
        headers.location = location.replace(options.href, slashJoin('/', slashJoin((options.route || ''), '')));
      }
      applyViaHeader(myRes.headers, opts, myRes.headers);
      rewriteCookieHosts(myRes.headers, opts, myRes.headers, req);
      resp.writeHead(myRes.statusCode, myRes.headers);
      myRes.on('error', function (err) {
        next(err);
      });
      myRes.pipe(resp);
    });
    myReq.on('error', function (err) {
      next(err);
    });
    if (!req.readable) {
      myReq.end();
    } else {
      req.pipe(myReq);
    }
  };
};

function applyViaHeader(existingHeaders, opts, applyTo) {
  if (!opts.via) return;

  var viaName = (true === opts.via) ?  os.hostname() : opts.via;
  var viaHeader = '1.1 ' + viaName;
  if(existingHeaders.via) {
    viaHeader = existingHeaders.via + ', ' + viaHeader;
  }

  applyTo.via = viaHeader;
}

function rewriteCookieHosts(existingHeaders, opts, applyTo, req) {
  if (!opts.cookieRewrite || !owns.call(existingHeaders, 'set-cookie')) {
    return;
  }

  var existingCookies = existingHeaders['set-cookie'],
      rewrittenCookies = [],
      rewriteHostname = (true === opts.cookieRewrite) ? os.hostname() : opts.cookieRewrite;

  if (!Array.isArray(existingCookies)) {
    existingCookies = [ existingCookies ];
  }

  for (var i = 0; i < existingCookies.length; i++) {
    var rewrittenCookie = existingCookies[i].replace(/(Domain)=[a-z\.-_]*?(;|$)/gi, '$1=' + rewriteHostname + '$2');

    if (!req.connection.encrypted) {
      rewrittenCookie = rewrittenCookie.replace(/;\s*?(Secure)/i, '');
    }
    rewrittenCookies.push(rewrittenCookie);
  }

  applyTo['set-cookie'] = rewrittenCookies;
}

function slashJoin(p1, p2) {
  var trailing_slash = false;

  if (p1.length && p1[p1.length - 1] === '/') { trailing_slash = true; }
  if (trailing_slash && p2.length && p2[0] === '/') {p2 = p2.substring(1); }

  return p1 + p2;
}

function extend(obj, src) {
  for (var key in src) if (owns.call(src, key)) obj[key] = src[key];
  return obj;
}

//merges data without changing state in either argument
function merge(src1, src2) {
    var merged = {};
    extend(merged, src1);
    extend(merged, src2);
    return merged;
}
