
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
             'lib/jquery'],
    'c': 'components'
  }
});

var global = this;

require(['jquery', 'lib/crafty', 'conf' ,'c/player', 'c/borders', 'c/enemy'],
  function($,       crafty,       CONF,   player,     borders,     enemy) {

  // -----------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------

  // Instanciate Crafty and create a canvas context
  Crafty.init();
  Crafty.canvas.init();

  // -----------------------------------------------------------------
  // Loader
  // -----------------------------------------------------------------

  //the loading screen that will display while our assets load
  Crafty.scene('loading', function () {
    Crafty.load([
        'img/forest.png',
        'img/onibi.png',
        'img/enemy.png',
        'img/fountain.png'
      ], function () {
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

  // -----------------------------------------------------------------
  // Menu
  // -----------------------------------------------------------------
  Crafty.scene('menu', function () {
    Crafty.background('#ccc');
    Crafty.e('2D, DOM, Text')
      .attr({ w: 100, h: 20, x: 460, y: 220 })
      .text('Onibi')
      .css({ 'text-align': 'center', 'font-size': '42px' });
    Crafty.e('2D, DOM, Text')
      .attr({ w: 100, h: 20, x: 460, y: 280 })
      .text('<a href="#" onmousedown="Crafty.scene(\'game\'); return false;">Play</a>')
      .css({ 'text-align': 'center' });
  });

  // -----------------------------------------------------------------
  // Game
  // -----------------------------------------------------------------

  // Game pause
  var pauseContainer = $('#pauseContainer');
  $('button', pauseContainer).on('click', function () {
    Crafty.pause();
    pauseContainer.hide();
  });

  // Game scene
  Crafty.scene('game', function () {

    // Pausing the game
    Crafty.bind('Pause', function () {
      pauseContainer.show();
    });

    Crafty.bind('KeyDown', function (keyboardEvent) {
      if (keyboardEvent.key === Crafty.keys.ESC) {
        Crafty.pause();
      }
    });

    // Losing the game
    Crafty.bind('Loosing', function () {
      Crafty.viewport.x = 0;
      Crafty.viewport.y = 0;
      Crafty.scene('menu');
    });

    // Create sprites to use
    Crafty.sprite(CONF.enemy.size, 'img/enemy.png', {
      enemy: [0, 0]
    });
    Crafty.sprite(CONF.level1.width, 'img/forest.png', {
      map: [0, 0]
    });
    Crafty.sprite(CONF.fountain.size, 'img/fountain.png', {
      fountain: [0, 0]
    });

    // Display background
    Crafty.e('2D, Canvas, map, Mouse')
          .attr({x: 0, y: 0})
          .bind('Click', function(e) {
            var newx = e.clientX - Crafty.viewport.x;
            var newy = e.clientY - Crafty.viewport.y;
            player.move(newx, newy);
            console.log("enemy(x,y)=("+enemy.x+","+enemy.y+")");
          });

    // Borders to move the camera around
    Crafty.e('Borders')
          .borders(CONF.level1.width, CONF.level1.height);

    // Display the player
    var player = Crafty.e('2D, Canvas, Tween, Onibi, Delay')
                       .attr({
                         w: CONF.onibi.size,
                         h: CONF.onibi.size,
                         x: CONF.width / 2,
                         y: CONF.height / 10 * 9
                       });
    player.loseEssence();

    var enemy = Crafty.e('2D, Canvas, Tween, Enemy, enemy')
                      .attr({
                        w: CONF.enemy.size,
                        h: CONF.enemy.size,
                        x: CONF.width / 2 +100,
                        y: CONF.height / 2
                      });

    var fountain = Crafty.e('2D, Canvas, Tween, Fountain, fountain')
                         .attr({
                           w:CONF.fountain.size,
                           h:CONF.fountain.size,
                           x: CONF.width / 2 + 200,
                           y: CONF.height / 2
                          });

    Crafty.bind('EnterFrame', function () {
      enemy.seekPlayer(player.x, player.y);
    });
  });

  // -----------------------------------------------------------------
  // Start
  // -----------------------------------------------------------------

  Crafty.scene('loading');
});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
