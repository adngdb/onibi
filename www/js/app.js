
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define
//
// You don't have to use require.js, and you can delete all of this if
// you aren't (make sure to uncomment the script tags in index.html also)


// Set the path to jQuery, which will fall back to the local version
// if google is down
require.config({
  baseUrl: 'js/lib',
  paths: {
    'jquery':
            ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
             'lib/jquery']
  }
});

var global = this;

require(['jquery', 'crafty'], function($) {

  // -----------------------------------------------------------------
  // Configuration
  // -----------------------------------------------------------------

  // Because it's good to use configuration
  var CONF = {
    width: 960,
    height: 640,
    'onibi': {
      'size': 32,
      'speed': 5
    }
  }

  // Instanciate Crafty and create a canvas context
  Crafty.init(CONF.width, CONF.height);
  Crafty.canvas.init();

  // -----------------------------------------------------------------
  // Components
  // -----------------------------------------------------------------

  // You might want to create some components of your own

  // Crafty.c('MyComponent', {});

  // -----------------------------------------------------------------
  // Functions
  // -----------------------------------------------------------------

  // Some functions could be useful

  // -----------------------------------------------------------------
  // Scenes
  // -----------------------------------------------------------------

  // Scenes help you keep your game organized, with well separated layers

  // Crafty.scene('my-scene', function () {});
  // And then, to call the scene:
  // Crafty.scene('my-scene');

});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
