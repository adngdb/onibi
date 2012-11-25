require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Enemy', {
    fired: 0,
    degat: 0,
    corruption: 0,
    init: function () {

      var collisionerSizeX = CONF.enemy.size / 2;
      var collisionerSizeY = (CONF.enemy.size / 4) * 3 - 9;
      var realSizeX = CONF.enemy.realSizeX / 2 + 2;
      var realSizeY = CONF.enemy.realSizeY / 2 + 2;
      this.requires('Collision').collision(new Crafty.polygon(
          [collisionerSizeX - realSizeX, collisionerSizeY - realSizeY],
          [collisionerSizeX + realSizeX, collisionerSizeY - realSizeY],
          [collisionerSizeX + realSizeX, collisionerSizeY + realSizeY],
          [collisionerSizeX - realSizeX, collisionerSizeY + realSizeY]
      ));

      this.requires('Mouse')
          .areaMap([0, 0], [0, CONF.enemy.size], [CONF.enemy.size, CONF.enemy.size], [CONF.enemy.size, 0])
          .bind('MouseDown', function(e) {
            console.log('Fired');
            this.fired = 1;
            this.trigger('EnemyFired', e);
          })
          .bind('MouseUp', function(e) {
            console.log('Not fired');
            this.fired = 0;
            this.trigger('EnemyStopFired', e);
          })

      // On collision with an onibi
      this.onHit('Onibi', function (target) {
        var degat = this.degat;
        target[0].obj.each(function(){
          this.looseEssence(degat);
        });
      });

      this.degat = CONF.enemy.degat;

      this.DIRECTIONS = [ 'W', 'SW', 'S', 'SE', 'E', 'NE', 'N', 'NW'];

      this.corruption = CONF.enemy.corruption;
    },

    move: function (toX, toY) {
      toX -= this.w / 2;
      toY -= this.h / 2;

      var dx = this.x - toX,
          dy = this.y - toY,
          dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
          speed = Math.round(dist / CONF.enemy.speed),
          angle = Math.atan2(dy, dx) + Math.PI,
          dir   = Math.round( angle / ( Math.PI / 4 ) ) % 8;

      if (dist !== 0) {
        this.stop()
          .animate( 'enemy-moving-' + this.DIRECTIONS[dir], 24, -1)
          .tween({ x: toX, y: toY }, speed)
          .bind( 'TweenEnd' , function(e) {
            this.stop()
              .animate( 'enemy-' + this.DIRECTIONS[dir], 24, -1)
              .unbind( 'TweenEnd' );
          } );
      }
      
      return this;
    },

    seekPlayer: function (playerX, playerY) {

      if (this.corruption > 0) { 

        playerX += CONF.onibi.size / 2;
        playerY += CONF.onibi.size / 2;

        var dx = Math.abs( this.x - playerX ) + CONF.onibi.size / 2;
        var dy = Math.abs( this.y - playerY ) + CONF.onibi.size / 2;
        var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (dist <= CONF.enemy.vision) {
          this.move(playerX, playerY);
        }

      }

      return this;
    },
    getDegat: function() {
      return this.degat;
    },
    isFired: function() {
      return this.fired;
    },
    looseCorruption: function(essence){
      if (this.corruption>0) {
        this.corruption -= essence;
        console.log("Enemy corruption : "+this.corruption);
      }
    }

  });

});
