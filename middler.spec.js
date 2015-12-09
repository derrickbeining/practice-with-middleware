describe('app', function(){

  function goToNext (req, res, next) { if (next) next(); }

  var app, middleware1, middleware2, middleware3, middleware4, middleware5;
  beforeEach(function(){
    app = new App();
    // spies are just functions that keep track of whether they were called, what they were called with, how many times they were called, etc. These spies all call a third parameter `next`, if it is defined.
    middleware1 = jasmine.createSpy('middleware1').and.callFake(goToNext);
    middleware2 = jasmine.createSpy('middleware2').and.callFake(goToNext);
    middleware3 = jasmine.createSpy('middleware3').and.callFake(goToNext);
    middleware4 = jasmine.createSpy('middleware4').and.callFake(goToNext);
    middleware5 = jasmine.createSpy('middleware5').and.callFake(goToNext);
  });

  describe('.use', function(){

    it('registers a given middleware function, mounted by default at the root', function(){
      app.use(middleware1);
      expect(app._chain).toEqual([
        { mount: '/', middleware: middleware1 }
      ]);
    });

    it('registers multiple middleware via successive calls', function(){
      app.use(middleware1);
      app.use(middleware2);
      app.use(middleware3);
      expect(app._chain).toEqual([
        { mount: '/', middleware: middleware1 },
        { mount: '/', middleware: middleware2 },
        { mount: '/', middleware: middleware3 }
      ]);
    });

    it('registers multiple middleware through a single call', function(){
      // don't hard code many params; use `arguments`
      app.use(middleware1, middleware2, middleware3);
      expect(app._chain).toEqual([
        { mount: '/', middleware: middleware1 },
        { mount: '/', middleware: middleware2 },
        { mount: '/', middleware: middleware3 }
      ]);
    });

    describe('custom mounting', function(){

      it('registers a given middleware function for a specific mount path', function(){
        app.use('/bagels', middleware1);
        expect(app._chain).toEqual([
          { mount: '/bagels', middleware: middleware1 }
        ]);
      });

      it('registers given middleware for multiple mount paths', function(){
        app.use('/cereal', middleware1);
        app.use('/cereal/cheerios', middleware2);
        app.use('/', middleware3);
        app.use('/admin', middleware4);
        expect(app._chain).toEqual([
          { mount: '/cereal', middleware: middleware1 },
          { mount: '/cereal/cheerios', middleware: middleware2 },
          { mount: '/', middleware: middleware3 },
          { mount: '/admin', middleware: middleware4 }
        ]);
      });

      it('registers multiple middleware for a specific mount path', function(){
        app.use('/bagels', middleware1, middleware2, middleware3);
        expect(app._chain).toEqual([
          { mount: '/bagels', middleware: middleware1 },
          { mount: '/bagels', middleware: middleware2 },
          { mount: '/bagels', middleware: middleware3 }
        ]);
      });

      it('registers multiple middleware for multiple mount paths', function(){
        app.use('/cereal', middleware1, middleware2, middleware4);
        app.use('/cereal/cheerios', middleware3);
        app.use('/', middleware2, middleware1);
        app.use('/admin', middleware4);
        expect(app._chain).toEqual([
          { mount: '/cereal', middleware: middleware1 },
          { mount: '/cereal', middleware: middleware2 },
          { mount: '/cereal', middleware: middleware4 },
          { mount: '/cereal/cheerios', middleware: middleware3 },
          { mount: '/', middleware: middleware2 },
          { mount: '/', middleware: middleware1 },
          { mount: '/admin', middleware: middleware4 }
        ]);
      });

    });

  });

  describe('._handleHTTP', function(){

    var request, response;
    beforeEach(function(){
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

    it('calls a registered middleware function with the request and response objects created by a Node.js server, plus a `next` function', function(){
      app.use(middleware1); // mounted by default at the `/` URI
      expect(middleware1).not.toHaveBeenCalled();
      app._handleHTTP(request, response);
      expect(middleware1).toHaveBeenCalledWith(request, response, jasmine.any(Function));
    });

    it('calls multiple registered middleware functions in order', function(){
      var log = '';
      function writeA (req, res, next) { log += 'A'; if (next) next(); }
      function writeB (req, res, next) { log += 'B'; if (next) next(); }
      function writeC (req, res, next) { log += 'C'; if (next) next(); }
      app.use(writeA, writeB, writeC, middleware4);
      expect(log).toBe('');
      app._handleHTTP(request, response);
      expect(log).toBe('ABC');
      expect(middleware4).toHaveBeenCalledWith(request, response, jasmine.any(Function));
    });

    it('skips middleware whose mount path does not equal the request url', function(){
      // simulate an HTTP request for the `/puppies` URI
      request.url = '/puppies';
      // m1 on wrong mount path
      app.use('/kittens', middleware1);
      app._handleHTTP(request, response);
      expect(middleware1).not.toHaveBeenCalled();
      // m2 on correct mount path
      app.use('/puppies', middleware2);
      app._handleHTTP(request, response);
      expect(middleware1).not.toHaveBeenCalled();
      expect(middleware2).toHaveBeenCalledWith(request, response, jasmine.any(Function));
    });

    // REMEMBER: we are giving you a convenient `mountMatchesUrl` function!
    it('skips middleware whose mount path does not *match* the request url', function(){
      // simulate an HTTP request for all the contented sounds Felix makes
      request.url = '/kittens/felix/sounds?type=contented';
      // m1 on various non-matching mount paths: m1 is not called
      app.use('/kitten', middleware1);
      app.use('/api/kittens', middleware1);
      app.use('/puppies', middleware1);
      app.use('/kittens/felix/siblings', middleware1);
      app._handleHTTP(request, response);
      expect(middleware1).not.toHaveBeenCalled();
      // m2, 3, 4, 5 on matching mount paths: m1 – 5 all called
      app.use('/kittens', middleware2);
      app.use('/kittens/', middleware3);
      app.use('/kittens/felix', middleware4);
      app.use('/kittens/felix/sounds', middleware5);
      app._handleHTTP(request, response);
      expect(middleware1).not.toHaveBeenCalled();
      expect(middleware2).toHaveBeenCalledWith(request, response, jasmine.any(Function));
      expect(middleware3).toHaveBeenCalledWith(request, response, jasmine.any(Function));
      expect(middleware4).toHaveBeenCalledWith(request, response, jasmine.any(Function));
      expect(middleware5).toHaveBeenCalledWith(request, response, jasmine.any(Function));
    });

    it('only continues on to the next middleware when the current middleware calls `next`', function(){
      var log = '';
      app.use(function f1 (req, res, next){
        log += 'called f1.';
        next();
      });
      app.use(function f2 (req, res, next){
        log += ' called f2.';
        // does not call next!
      });
      app.use(function f3 (req, res, next){
        log += ' called f3.';
        next();
      });
      expect(log).toBe('');
      app._handleHTTP(request, response);
      expect(log).toBe('called f1. called f2.'); // never got to f3
    });

    it('can handle async middleware by letting the `next` call asynchronously trigger the next middleware in the chain.', function(done){
      var log = '';
      app.use(function f1 (req, res, next){
        log += 'called f1.';
        next();
      });
      app.use(function f2 (req, res, next){
        log += ' called f2.';
        setTimeout(function(){
          next();
        }, 100); // calls `next` only after 0.1 seconds
      });
      app.use(function f3 (req, res, next){
        log += ' called f3.';
        next();
      });
      expect(log).toBe('');
      app._handleHTTP(request, response);
      expect(log).toBe('called f1. called f2.'); // hasn't called f3 yet!
      setTimeout(function(){
        expect(log).toBe('called f1. called f2. called f3.');
        done();
      }, 200); // 0.2 seconds later, f3 was called after calling `next`.
    });

  });

});
