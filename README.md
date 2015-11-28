# Middler

## A Connect/Express-Style Middleware Implementation Exercise

[**Express.js**](http://expressjs.com/) is a popular server framework (way to more easily handle HTTP requests and reponses) for [**Node.js**](https://nodejs.org/en/) (a machine process that executes JavaScript and provides filesystem / network APIs). Express actually wraps around and extends the [**Connect**](https://github.com/senchalabs/connect) middleware system with additional methods and capabilities.

Novices to these concepts often express (hah!) confusion over "middleware." **Middler** is a [Testem](https://github.com/testem/testem)-based test spec that implements a simple Connect-style middleware framework. It does not result in a robust solution for actual use, nor does it simulate many features of Connect or Express (especially the latter). It is deliberately limited to illustrating the concept of a middleware chain.

Core topics that this implementation covers include:

* Registering successive middleware with `app.use`, with or without mount paths.
* Parsing an incoming `request` object.
* Passing requests into the first matching normal middleware (arity 3 or less with correct mount path).
* Enabling every middleware invoked to pass control on to the next middleware by explicitly calling a `next` function provided by the framework.
* Enabling control to be handed off to error-handling middleware (arity of 4) by passing a truthy value to `next`.
* Default (internal) error-handling middleware behavior (defaulting to `500` but respecting `err.status` if present).

### Instructions

We assume you already have working versions of Node.js and npm on your machine.

1. Fork this repo and `git clone` your fork.
* `cd` into the directory and `npm install`.
* execute the `testem` command and open the URL displayed.
* Work in `middler.js` and follow the spec in `middler.spec.js`.

### Notes & Hints

* Methods named with a leading underscore (e.g. `app._hearRequest`) are "internal" functions or variables which are part of the underlying machinery but are not typically accessed by the user.
