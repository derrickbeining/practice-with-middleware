'use strict';
/* global App queryParser */

// Extra Credit! If you have a working Middler framework, let's try actually writing some middleware for it to use. Change `xdescribe` to `describe` to activate this extra challenge.
xdescribe('middleware', function(){

  var app, request, response;
  beforeEach(function(){
    app = new App();
    request = {
      method: 'GET',
      url: '/'
    };
    response = {
      statusCode: undefined,
      headersSent: false,
      end: function(){}
    };
  });

  describe('queryParser', function(){

    beforeEach(function(){
      app.use(queryParser);
    });

    it('is a function', function(){
      expect(typeof queryParser).toBe('function');
    });

    it('has arity three', function(){
      expect(queryParser.length).toBe(3);
    });

    it('places an object on the `query` property of the request', function(){
      expect(request.query).toBe(undefined);
      app._handleHTTP(request, response);
      expect(request.query).toEqual({});
    });

    it('passes control to the next middleware so later middleware can make use of the query object', function(){
      var queryObject;
      app.use(function(req, res, next){
        queryObject = req.query;
      });
      app._handleHTTP(request, response);
      expect(queryObject).toEqual({});
    });

    it('parses a simple query string in the url, by turning a string key-value pair into an object key-value pair', function(){
      request.url = '/kittens?color=grey';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        color: 'grey'
      });
      request.url = '/users?type=admin';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        type: 'admin'
      });
    });

    it('parses a more complex query string in the url, by turning a string key-value pairs into object key-value pairs', function(){
      request.url = '/kittens?color=grey&breed=siberian';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        color: 'grey',
        breed: 'siberian'
      });
      request.url = '/users?type=admin&status=active&lastname=Smith';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        type: 'admin',
        status: 'active',
        lastname: 'Smith'
      });
    });

    it('does some basic url-style decoding for the space character (%20)', function(){
      request.url = '/users/?name=John%20Smith';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        name: 'John Smith'
      });
      request.url = '/puppies/?color=light%20brown&breed=german%20shepherd%20dog';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        color: 'light brown',
        breed: 'german shepherd dog'
      });
    });

    it('detects number values', function(){
      request.url = '/kittens?ageInWeeks=6';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        ageInWeeks: 6
      });
      request.url = '/puppies/?paws=4&ears=2';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        paws: 4,
        ears: 2
      });
    });

    it('detects boolean values', function(){
      request.url = '/kittens/?cute=true';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        cute: true
      });
      request.url = '/puppies/?adopted=false&name=falsey';
      app._handleHTTP(request, response);
      expect(request.query).toEqual({
        adopted: false,
        name: 'falsey'
      });
    });

  });

});
