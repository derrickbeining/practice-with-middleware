'use strict';

// Helper function you can use in `middler.js`.

function mountMatchesUrl (mount, url) {

  mount = ensureSlash(mount);
  url = ensureSlash(removeQuery(url));
  return mount === url.slice(0, mount.length);

  function removeQuery (path) {
    var queryPosition = path.indexOf('?'),
        hasQuery = Boolean(queryPosition + 1);
    return hasQuery ? path.slice(0, queryPosition) : path;
  }
  function ensureSlash (path) {
    var last = path.length - 1;
    return (path[last] !== '/') ? path + '/' : path;
  }

}

/* -----------------Example:-----------------

If the mount path is:

  /users

The function returns `true` for the following urls:

  /users
  /users/
  /users?lastname=smith
  /users/?lastname=smith
  /users/123
  /users/123/comments
  /users/123/comments?approved=false

However, it returns `false` for the following urls:

  /user
  /users-list
  /api/users

----------------------------------------------*/
