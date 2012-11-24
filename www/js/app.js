
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

  //the loading screen that will display while our assets load
  Crafty.scene('loading', function () {
      //load takes an array of assets and a callback when complete
      Crafty.load(['img/forest.png' /*,'img/others.png' */], function () {
        // ONLY FOR LOCAL TEST
        setTimeout(function() { //wait 2 seconds to see loading in local test 
           Crafty.scene('menu'); // Play the main scene
        }, 2000);
        // USE THIS IN PROD
        //Crafty.scene('menu'); //when everything is loaded, run the main scene
      });

     //black background with some loading text
      Crafty.background('#000');
      Crafty.e('2D, DOM, Text').attr({ w: 100, h: 20, x: CONF.width/2-50, y: CONF.height/2-10 })
              .text('Loading')
              .css({ 'text-align': 'center', 'color': '#fff' });

  });

  Crafty.scene('menu', function () {
    Crafty.background('#ccc');
    Crafty.e('2D, DOM, Text')
      .attr({ w: 100, h: 20, x: 350, y: 220 })
      .text('Onibi')
      .css({ 'text-align': 'center', 'font-size': '42px' });
    Crafty.e('2D, DOM, Text')
      .attr({ w: 100, h: 20, x: 350, y: 280 })
      .text('<a href="#" onclick="Crafty.scene(\'game\'); return false;">Play</a>')
      .css({ 'text-align': 'center' });
  });
  Crafty.scene('game', function () {
    Crafty.background('#ccc');
    Crafty.e('2D, DOM, Text')
      .attr({ w: 100, h: 20, x: 350, y: 280 })
      .text('Game')
      .css({ 'text-align': 'center' });

    // Create sprites to use
    Crafty.sprite(1, "img/forest.png", {
        map: [0, 0]
    });
    // Create the map in the background
    Crafty.e("2D, DOM, map")
          .attr({ w: CONF.width, h: CONF.height, x: 0, y: 0 });

  });

  //start 
  Crafty.scene('loading');
});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
