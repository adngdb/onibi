
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

require(['jquery', 'lib/crafty', 'conf' ,'c/player', 'c/borders', 'c/enemy', 'c/fountain', 'c/spellManager', 'lib/buzz', 'c/impassable'],
  function($,       crafty,       CONF,   player,     borders,     enemy,     fountain,     spellManager,     buzz,       impassable) {

  // -----------------------------------------------------------------
  // Init
  // -----------------------------------------------------------------

  // Global variable containing all levels of the game
  var levels = {};
  var currentLevel = CONF.level.start;

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
    // Loading graphic resources
    Crafty.load([
        CONF.enemy.image,
        'img/fountain.png',
        'img/spells.png',
        'img/sprite-sort-purification.png',
      ],
      function () {
        // Loading levels
        function loadLevel(levelIndex) {
          var lvl = CONF.level.levels[levelIndex];

          $.getJSON('level/' + lvl.filename, function (json) {
            levels[lvl.id] = { 'json': json };
            if (CONF.level.levels.length > levelIndex + 1) {
              loadLevel(levelIndex + 1);
            }
            else {
              nextScene();
            }
          });
        }

        function nextScene() {
          Crafty.scene('menu');
        }

        loadLevel(0);
      });

    //black background with some loading text
    Crafty.background('#000');
    Crafty.e('2D, DOM, Text').attr({ w: 100, h: 20, x: CONF.width/2-50, y: CONF.height/2-10 })
      .text('Loading')
      .css({ 'text-align': 'center', 'color': '#fff' });
  });

  // New level, loads the images and parses the level data
  Crafty.scene('level', function () {
    parseLevel(currentLevel);

    Crafty.load(levels[currentLevel].images, function () {
      Crafty.scene('game');
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
      .text('<a href="#" onmousedown="Crafty.scene(\'level\'); return false;">Play</a>')
      .css({ 'text-align': 'center' });
  });

  // -----------------------------------------------------------------
  // Levels parsing
  // -----------------------------------------------------------------

  function parseLevel(levelId) {
    var level = levels[levelId];
    var json = level.json;

    level.map = {
      'width': json.tilewidth * json.width, // in pixels
      'height': json.tilewidth * json.height, // in pixels
    };
    level.impassables = [];

    for (var l in json.layers) {
      var layer = json.layers[l];
      if (layer.name === 'decor') {
        // Decors, create collision map for non-accessible locations
        for (var o in layer.objects) {
          var obj = layer.objects[o];
          var imp = {
            x: obj.x,
            y: obj.y,
            polygon: null
          };

          if (obj.polyline) {
            // Create a complex polygon as collision map
            var coords = [];
            var maxY = 0, minY = 0, maxX = 0, minX = 0;
            for (var c in obj.polyline) {
              var coord = obj.polyline[c];
              coords.push([coord.x, coord.y]);

              if (minX > coord.x) { minX = coord.x }
              if (minY > coord.y) { minY = coord.y }
              if (maxX < coord.x) { maxX = coord.x }
              if (maxY < coord.y) { maxY = coord.y }
            }
            // imp.polygon = new Crafty.polygon(coords);
            imp.polygon = coords;
            imp.width = maxX - minX;
            imp.height = maxY - minY;
            level.impassables.push(imp);
          }
          else if (obj.width !== 0 && obj.height !== 0) {
            // The collision zone is a square
            var coords = [
              [0, 0],
              [obj.width, 0],
              [obj.width, obj.height],
              [0, obj.height]
            ];
            // imp.polygon = new Crafty.polygon(coords);
            imp.polygon = coords;
            level.impassables.push(imp);
          }
        }
      }
      else if (layer.name === 'interactive') {
        // Interactive objects
      }
    }

    level.images = [];
    for (var i in CONF.level.layers) {
      var filename = 'img/map/' + currentLevel + CONF.level.layers[i];
      level.images.push(filename);
    }
  }

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
    var level = levels[currentLevel];

    Crafty.viewport.y = - level.map.height + Crafty.DOM.window.height + 500;

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
    Crafty.sprite(CONF.fountain.size, 'img/fountain.png', {
      fountain: [0, 0]
    });
    Crafty.sprite(CONF.spell.purify.size, 'img/sprite-sort-purification.png', {
      spellPurify: [0, 0]
    });

    //Add audio for level
    var audioLevel1 = new buzz.sound( 'sfx/Musics/Onibi-map2', {
        formats: [ "ogg" ]
    });
    audioLevel1.play()
        .fadeIn()
        .loop();

    // Load and display background
    for (var i in level.images) {
      var key = 'map' + currentLevel + i;
      var mapping = {};
      mapping[key] = [0, 0];
      Crafty.sprite(level.map.width, level.images[i], mapping);

      Crafty.e('2D, Canvas, ' + key).attr({ z: i * 2 });
    }

    // Click zone for player movements
    var world = Crafty.e('2D, Mouse, Canvas')
                      .attr({
                        x: 0,
                        y: 0,
                        w: level.map.width,
                        h: level.map.height
                      })
                      .bind('Click', function(e) {
                        var newx = e.clientX - Crafty.viewport.x;
                        var newy = e.clientY - Crafty.viewport.y;
                        player.move(newx, newy);
                      });

    // Load all impassable zones
    for (var i in level.impassables) {
      var imp = level.impassables[i];
      Crafty.e('2D, Canvas, Mouse, Collision, WiredHitBox, Impassable')
            .attr({ x: imp.x, y: imp.y, w: imp.width, h: imp.height })
            .collision(new Crafty.polygon(imp.polygon))
            .areaMap(new Crafty.polygon(imp.polygon))
            .bind('Click', function () { /* do nothing */ });
    }

    // Crafty.e('2D, Collision, WiredHitBox, Impassable')
    //       .attr({ x: 30, y: 30, w: 90, h: 90 })
    //       .collision(new Crafty.polygon([0,0], [40,0], [40,40], [0,40]))
          // .areaMap(new Crafty.polygon([0,0], [40,0], [40,40], [0,40]))
          // .bind('Click', function () { /* do nothing */ });

    //Play music of level1
    Crafty.audio.play("level1", -1);

    // Display HUD
    document.getElementById('hud').setAttribute( 'style', 'display: block' );

    // Borders to move the camera around
    Crafty.e('Borders')
          .borders(level.map.width, level.map.height);

    // Display the player
    var player = Crafty.e('2D, Canvas, Tween, Onibi, Delay')
                       .attr({
                         w: CONF.onibi.size,
                         h: CONF.onibi.size,
                         x: 400,
                         y: level.map.height - 880
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
