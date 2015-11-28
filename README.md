# Middler

## A Connect/Express-Style Middleware Implementation Exercise

[**Express.js**](http://expressjs.com/) is a popular server framework (way to more easily handle HTTP requests and reponses) for [**Node.js**](https://nodejs.org/en/) (a machine process that executes JavaScript and provides filesystem / network APIs). Express actually wraps around and extends the [**Connect**](https://github.com/senchalabs/connect) middleware system with additional methods and capabilities.

Novices to these concepts often express (hah!) confusion over "middleware." **Middler** is a small [Testem](https://github.com/testem/testem)-based test spec that implements a very simple Connect-style middleware framework. It purposely omits many important features of Connect/Express, including error handling, mount path parsing, matching full urls to base baths, temporary `req.url` modification, method matching, etc. to focus solely on the idea of an asynchronous middleware chain triggered by `next` calls.

### Instructions

We assume you already have working versions of Node.js and npm on your machine.

1. Fork this repo and `git clone` your fork.
* `cd` into the directory and `npm install`.
* execute the `testem` command and open the URL displayed.
* Work in `middler.js` and follow the spec in `middler.spec.js`.

### Notes & Hints

* Methods named with a leading underscore (e.g. `app._handleHTTP`) are "internal" functions or variables which are part of the underlying machinery but are not typically accessed by the user.
* `_handleHTTP` can (and probably should) be implemented with no loops.
