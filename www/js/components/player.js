require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Onibi', {
      init: function () {
        this.requires('Mouse')
            .areaMap([0, 0], [0, CONF.onibi.size], [CONF.onibi.size, CONF.onibi.size], [CONF.onibi.size, 0]);
        this.bind('Click', function () {
          var selected = Crafty('Selected');
          if (selected.length) {
            for (var i = 0; i < selected.length; i++) {
              Crafty(selected[i]).removeComponent('Selected');
            }
          }
          this.addComponent('Selected');
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