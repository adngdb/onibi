
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

require(['jquery', 'lib/crafty', 'conf' ,'c/player', 'c/borders', 'c/enemy', 'c/fountain', 'c/spellManager'],
  function($,       crafty,       CONF,   player,     borders,     enemy,     fountain,     spellManager) {

  // -----------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------

  // Instanciate Crafty and create a canvas context
  Crafty.init();
  Crafty.canvas.init();


  // -----------------------------------------------------------------
  // Functions
  // -----------------------------------------------------------------
  var idEnemy = 0;
  var DIRECTIONS = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
  var generateEnemy = function( x, y ) {

    idEnemy++;

    var map = { }
    map[ 'enemy' + idEnemy ] = [0, 0];
    Crafty.sprite( CONF.enemy.size, CONF.enemy.image, map );

    var enemy = Crafty.e( '2D, Canvas, SpriteAnimation, Tween, Enemy, enemy' + idEnemy )
      .attr({ w:CONF.enemy.size, h:CONF.enemy.size, x: x, y: y });

    // Create animations
    for ( i in DIRECTIONS) {
      var dir = DIRECTIONS[i];

      // Standing animation
      enemy.animate("enemy-" + dir, [
        [0, i],[0, i],[0, i],[0, i],
        [1, i],
        [2, i],
        [3, i]
      ] );

      // Moving animation
      enemy.animate("enemy-moving-" + dir, [
        [ 4, i],
        [ 5, i],
        [ 6, i],
        [ 7, i],
        [ 8, i],
        [ 9, i],
        [10, i],
        [11, i]
      ] );

    }
    enemy.animate('enemy-E', 24, -1);

    return enemy;
  }


  // -----------------------------------------------------------------
  // Loader
  // -----------------------------------------------------------------
  //the loading screen that will display while our assets load
  Crafty.scene('loading', function () {
    Crafty.load([
        'img/forest.png',
        'img/fountain.png',
        CONF.enemy.image,
        'img/spells.png',
        'img/sprite-sort-purification.png',
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
      document.getElementById('hud').setAttribute( 'style', 'display: none' ); 
      Crafty.viewport.x = 0;
      Crafty.viewport.y = 0;
      Crafty.scene('menu');
    });

    // Create sprites to use   
    Crafty.sprite(CONF.level1.width, 'img/forest.png', {
      map: [0, 0]
    });
    Crafty.sprite(CONF.fountain.size, 'img/fountain.png', {
      fountain: [0, 0]
    });
    Crafty.sprite(CONF.spell.purify.size, 'img/sprite-sort-purification.png', {
      spellPurify: [0, 0]
    });

    // Display background
    var world = Crafty.e('2D, Canvas, map, Mouse')
          .attr({x: 0, y: 0})
          .bind('Click', function(e) {
            var newx = e.clientX - Crafty.viewport.x;
            var newy = e.clientY - Crafty.viewport.y;
            player.move(newx, newy);
          });

    // Display HUD
    document.getElementById('hud').setAttribute( 'style', 'display: block' );       

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


    var fountain = Crafty.e('2D, Canvas, Tween, Fountain, SpriteAnimation, fountain')
                         .attr({
                           w: CONF.fountain.size,
                           h: CONF.fountain.size,
                           x: CONF.width / 2 + 200,
                           y: CONF.height / 2
                          })
                         .animate('fountain-idle', 0, 0, 3)
                         .animate('fountain-idle', 60, -1);

    var enemies = [ ];
    enemies.push( generateEnemy( CONF.width / 2 + 100, CONF.height / 2 ) );
    enemies.push( generateEnemy( CONF.width / 2 - 100, CONF.height / 2 ) );

    //handle spells
    //purify spell box
    document.querySelector('#hud .purify').addEventListener('click', function() {
            
      //unbind existings event for spells
      for ( var j=0; j<enemies.length; j++ ) {
        enemies[ j ].unbind('EnemyFired')
          .unbind('EnemyStopFired');
      }
      world.unbind('MouseUp');

      var spell;
      var spellCreator;
      if (typeof(spellCreator)=='undefined') {
        spellCreator = Crafty.e('SpellManager').spellManager(CONF.spell.purify.type);
      }
      
      for ( var i=0; i<enemies.length; i++ ) {
        enemies[ i ]
          .bind('EnemyFired', function(e) {
            spell = spellCreator.createSpell(player, this).fire();
          })
          .bind('EnemyStopFired', function(e) {
            if (typeof(spell)!='undefined') spell.stopFire();
            spell.destroy();
          });
      }

    });

    document.querySelector('#hud .teletransport').addEventListener('click', function() {
            
      for ( var j=0; j<enemies.length; j++ ) {
        enemies[ j ].unbind('EnemyFired')
          .unbind('EnemyStopFired');
      }
            
      var spell;
      var spellCreator;
      if (typeof(spellCreator)=='undefined') {
        spellCreator = Crafty.e('SpellManager').spellManager(CONF.spell.teleportation.type);
      }

      world.bind('MouseUp', function(e) { 
        if( e.mouseButton == Crafty.mouseButtons.RIGHT ) {
          var target = { x:e.clientX - Crafty.viewport.x, y:e.clientY - Crafty.viewport.y };
          spell = spellCreator.createSpell(player, target).fire();    
        }
      })

    });

    Crafty.bind('EnterFrame', function () {
      for ( var i=0; i<enemies.length; i++ ) {
        enemies[ i ].seekPlayer(player.x, player.y);
      }
    });
  });

  // -----------------------------------------------------------------
  // Start
  // -----------------------------------------------------------------

  Crafty.scene('loading');
});

// END REQUIRE.JS CODE
// Remove all of this if not using require.js
