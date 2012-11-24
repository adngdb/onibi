require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Enemy', {

    degat: 0,

    init: function () {
      this.requires('Collision').collision();

      // On collision with an onibi
      this.onHit('Onibi', function (target) {
        var degat = this.degat;
        target[0].obj.each(function(){
          this.looseEssence(degat);
        });
      });

      this.degat = CONF.enemy.degat;
      this.DIRECTIONS = [ 'W', 'SW', 'S', 'SE', 'E', 'NE', 'N', 'NW'];
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
      playerX += CONF.onibi.size / 2;
      playerY += CONF.onibi.size / 2;

      var dx = Math.abs( this.x - playerX ) + CONF.onibi.size / 2;
      var dy = Math.abs( this.y - playerY ) + CONF.onibi.size / 2;
      var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (dist <= CONF.enemy.vision) {
        this.move(playerX, playerY);
      }

      return this;
    },
    getDegat: function() {
      return this.degat;
    }

  });

});
