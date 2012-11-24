require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Enemy', {

    init: function () {
      this.requires('Collision').collision();

      // On collision with an enemy
      this.onHit('onibi', function (entities) {
        //console.log('onibi hit');
      });
    },

    move: function (toX, toY) {
      toX -= this.w / 2;
      toY -= this.h / 2;

      var dx = this.x - toX;
      var dy = this.y - toY;
      var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      var speed = Math.round(dist / CONF.enemy.speed);

      if (dist !== 0) {
        this.tween({ x: toX, y: toY }, speed);
      }

      return this;
    },

    seekPlayer: function (playerX, playerY) {
      playerX += CONF.onibi.size / 2;
      playerY += CONF.onibi.size / 2;

      var dx = this.x - playerX;
      var dy = this.y - playerY;
      var dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (dist <= CONF.enemy.vision) {
        this.move(playerX, playerY);
      }

      return this;
    }

  });

});
