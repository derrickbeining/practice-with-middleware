'use strict';

// Helper function you can use in `middler.js`. See `helper.spec.js` for matching and non-matching mount and url examples.

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
