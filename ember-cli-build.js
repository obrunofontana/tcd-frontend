'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('node_modules/framework7/css/framework7.bundle.min.css');
  app.import('node_modules/framework7/js/framework7.bundle.min.js');


  return app.toTree();
};
