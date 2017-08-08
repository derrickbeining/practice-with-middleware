'use strict';
/* global mountMatchesUrl */

/*----------- Helper function you can use -----------*/

// `mountMatchesUrl` is a function defined in `helper.js`, accessible here.

// It returns true if mount path matches beginning of url.
// Properly ignores query string and handles implicit trailing slash.
// Check out the `helper.js` file for more details & examples.

/*--------- Main App Constructor and Factory --------*/

var App = function () {
  this._chain = [];
};

var Middler = function(){
  return new App();
};

/*======== Follow the spec in middler.spec.js ========*/

// user interface (API) for registering middleware
App.prototype.use = function(...args) {
  const hasMountPath = typeof args[0] === 'string';
  const mount = hasMountPath ? args[0] : '/';
  const callbacks = hasMountPath ? args.slice(1) : args;
  const middleware = callbacks.map(el => {
    return { mount: mount, middleware: el }
  })
  this._chain.push(...middleware)
};

// internal method triggered by a hypothetical HTTP request
App.prototype._handleHTTP = function (request, response) {
  // debugger;
  const reqUrl = request.url;
  const middlewareChain = this._chain;
  const finalIndex = middlewareChain.length - 1;
  let index = 0;

  function next(err) {
    request.url = reqUrl; // reassign original req.url
    if (index <= finalIndex) { // stop calling next() after last middleware
      try {
        const current = middlewareChain[index];
        const middleware = current.middleware;
        const mount = current.mount;
        index++;

        if (mountMatchesUrl(mount, request.url)) { // else call next()

          if (mount !== '/') { // perspectivize req.url for route
            request.url = reqUrl.slice(mount.length);
          }

          if (err) { // route errors to error handlers
            if (middleware.length === 4) { //Express error handlers have arity 4
              middleware(err, request, response, next);
            } else {
              next(err);
            }
          } else if (middleware.length < 4) { // regular middleware has arity 3
            middleware(request, response, next)
          } else {
            next();
          }

        } else { // mount mismatch, try next middleware
          next(err);
        }
      }
      catch (error) {
        next(error);
      }

    // all middleware in chain has been visited,
    } else if (err) { // set up default error handling
      if (err.status) {
        response.statusCode = err.status;
      } else {
        response.statusCode = 500;
      }
      response.end(err);
    } else { // no errors, if no response was sent yet, send 404
      if (!response.headersSent) {
        response.statusCode = 404;
        response.end();
      }
    }
  }

  next();
};

