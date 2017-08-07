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

  function next() {
    if (index <= finalIndex) {
      const middleware = middlewareChain[index];
      const mount = middleware.mount;
      const isNotRoot = mount !== '/';
      request.url = reqUrl;
      index++;
      if (mountMatchesUrl(mount, request.url)) {
        if (isNotRoot) {
          request.url = reqUrl.slice(mount.length);
        }
        middleware.middleware(request, response, next);
      } else {
        next();
      }
    }
  }

  next(); // starts the chain

};
