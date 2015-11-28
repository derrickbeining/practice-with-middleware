describe('app', function(){

  var app;
  beforeEach(function(){
    app = new App();
  });

  it('has `use` and `_hearRequest` methods', function(){
    expect(typeof app.use).toBe('function');
    expect(typeof app._hearRequest).toBe('function');
  });

  describe('`.use`', function(){

    var middleware1 = function m1 (req, res, next) {},
        middleware2 = function m2 (req, res, next) {},
        middleware3 = function m3 (req, res, next) {},
        middleware4 = function m4 (req, res, next) {};

    it('registers a given middleware function, mounted by default at the root', function(){
      app.use(middleware1);
      expect(app._registry).toEqual([
        { mount: '/', middleware: middleware1 }
      ]);
    });

    it('registers multiple middleware via successive calls', function(){
      app.use(middleware1);
      app.use(middleware2);
      app.use(middleware3);
      expect(app._registry).toEqual([
        { mount: '/', middleware: middleware1 },
        { mount: '/', middleware: middleware2 },
        { mount: '/', middleware: middleware3 }
      ]);
    });

    it('registers multiple middleware through a single call', function(){
      // don't hard code many params; use `arguments`
      app.use(middleware1, middleware2, middleware3);
      expect(app._registry).toEqual([
        { mount: '/', middleware: middleware1 },
        { mount: '/', middleware: middleware2 },
        { mount: '/', middleware: middleware3 }
      ]);
    });

    describe('mounting', function(){

      it('registers a given middleware function with a specific mount path', function(){
        app.use('/bagels', middleware1);
        expect(app._registry).toEqual([
          { mount: '/bagels', middleware: middleware1 }
        ]);
      });

      it('registers multiple middleware with specific mount paths', function(){
        app.use('/cereal', middleware1);
        app.use('/cereal/cheerios', middleware2);
        app.use('/', middleware3);
        app.use('/admin', middleware4);
        expect(app._registry).toEqual([
          { mount: '/cereal', middleware: middleware1 },
          { mount: '/cereal/cheerios', middleware: middleware2 },
          { mount: '/', middleware: middleware3 },
          { mount: '/admin', middleware: middleware4 }
        ]);
      });

    });

  });

  describe('`._hearRequest`', function(){

    var request, response;
    beforeEach(function(){
      request = {
        headers: { /* would have things like `content-type: 'json'` etc. */ },
        method: 'GET',
        url: '/',
        params: {},
        query: {}
      };
      response = {
        statusCode: undefined,
        setHeader: jasmine.createSpy('setHeader'),
        end: jasmine.createSpy('end'),
        headersSent: false
      };
    });



  });

});
