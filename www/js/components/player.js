require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Onibi', {
      init: function () {
        this.requires('Mouse')
            .areaMap([0, 0], [0, CONF.onibi.size], [CONF.onibi.size, CONF.onibi.size], [CONF.onibi.size, 0])
            .bind('Click', function () {
            console.log('CLICKED');
        });
        

        this.requires('Collision').collision();

      },
      move: function(toX, toY) {
        toX -= this.w / 2;
        toY -= this.h / 2;

        var dx = this.x - toX,
            dy = this.y - toY,
            dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
            speed = Math.round(dist / CONF.onibi.speed);

        this.tween({ x: toX, y: toY }, speed);

        return this;
      }
  });

});