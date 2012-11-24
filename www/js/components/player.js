require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Onibi', {
    essence: 0,

    init: function () {
      this.requires('Mouse')
          .areaMap([0, 0], [0, CONF.onibi.size], [CONF.onibi.size, CONF.onibi.size], [CONF.onibi.size, 0]);


      this.essence = CONF.onibi.essence;

      this.requires('Collision').collision();

      // On collision with an enemy
      this.onHit('enemy', function (entities) {
        console.log('enemy hit');
      });
    },
    move: function(toX, toY) {
      toX -= this.w / 2;
      toY -= this.h / 2;

      var dx = this.x - toX,
          dy = this.y - toY,
          dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
          speed = Math.round(dist / CONF.onibi.speed);

      console.log("player(x,y)=("+this.x+","+this.y+")");
      this.tween({ x: toX, y: toY }, speed);

      this.tween({ x: toX, y: toY }, speed);

      return this;
    },
    loseEssence: function() {
      this.delay(function() {
        this.essence--;
        console.log(this.essence);
        if (this.essence === 0) {
          Crafty.trigger('Loosing');
        }
        this.loseEssence();
      }, CONF.onibi.loseEssenceTimeout);
    }
  });

});