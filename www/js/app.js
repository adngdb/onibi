
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define
//
// You don't have to use require.js, and you can delete all of this if
// you aren't (make sure to uncomment the script tags in index.html also)


// Set the path to jQuery, which will fall back to the local version
// if google is down
require.config({
  baseUrl: 'js',
  paths: {
    'jquery':
            ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
             'lib/jquery']
  }
});

var global = this;

require(['jquery', 'lib/crafty', 'conf' ,'components/player', 'components/ennemi'], function($, crafty, CONF, player, ennemi) {

  // -----------------------------------------------------------------
  // Configuration
  // -----------------------------------------------------------------

  // Instanciate Crafty and create a canvas context
  Crafty.init();
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
    Crafty.load(['img/forest.png', 'img/onibi.png', 'img/ennemi.png'], function () {
      // ONLY FOR LOCAL TEST
      setTimeout(function() { //wait 2 seconds to see loading in local test
        Crafty.scene('menu'); // Play the main scene
      }, 500);
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
      .attr({ w: 100, h: 20, x: 460, y: 220 })
      .text('Onibi')
      .css({ 'text-align': 'center', 'font-size': '42px' });
    Crafty.e('2D, DOM, Text')
      .attr({ w: 100, h: 20, x: 460, y: 280 })
      .text('<a href="#" onclick="Crafty.scene(\'game\'); return false;">Play</a>')
      .css({ 'text-align': 'center' });
  });
  Crafty.scene('game', function () {
    Crafty.bind('Pause', function () {
      var pauseContainer = $('#pauseContainer');
      pauseContainer.show();
      $('button', pauseContainer).on('click', function () {
        Crafty.pause();
        pauseContainer.hide();
      });
    });

    Crafty.bind('Loosing', function () {
      Crafty.scene('menu');
    });

    Crafty.bind('KeyDown', function (keyboardEvent) {
      if (keyboardEvent.key === Crafty.keys.ESC) {
        Crafty.pause();
      }
    });

    Crafty.background('url(img/forest.png)');

    // Display background
    Crafty.background('url(img/forest.png)');

    // Create sprites to use
    Crafty.sprite(CONF.onibi.size, 'img/onibi.png', {
      onibi: [0, 0]
    });
    
    Crafty.sprite(CONF.ennemi.size, 'img/ennemi.png', {
      ennemi: [0, 0]
    });

    Crafty.e("2D, Canvas, Color, Mouse")
      .color("red")
      .attr({ w:50, h:50 })
      .bind("Click", function() {
        Crafty.pause();
      });

    // Display the player
    var player = Crafty.e('2D, Canvas, Tween, Onibi, onibi, Delay')
      .attr({ w:CONF.onibi.size, h:CONF.onibi.size, x: CONF.width / 2, y: CONF.height / 10 * 9 });
    player.loseEssence();

    var ennemi = Crafty.e('2D, Canvas, Tween, Ennemi, ennemi')
      .attr({ w:CONF.ennemi.size, h:CONF.ennemi.size, x: CONF.width / 2 +100, y: CONF.height / 2 });

    // Bind the click to move the player's avatar
    Crafty.addEvent(this, Crafty.stage.elem, 'click', function(e) {
      var newx = e.clientX,
          newy = e.clientY;
      player.move(newx, newy);
    })
    Crafty.bind('EnterFrame', function () {
      ennemi.seekPlayer(player.x, player.y);  
    });
    

  });

  //start
  Crafty.scene('loading');
});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
