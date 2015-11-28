'use strict';

// completed constructor function for a middleware chain
var App = function () {
  this._chain = [];
};

/*======== Follow the spec in middler.spec.js ========*/

// user interface (API) for registering middleware
App.prototype.use = function() {
  // ...define this function

};

// internal method triggered by a hypothetical HTTP request
App.prototype._handleHTTP = function(request, response) {
  // ...define this, called once per HTTP request

  function next(){
    // ...and this, called for each middleware

  };
  next(); // starts the chain
};
