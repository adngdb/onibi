require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Fountain', {
    init: function () {
      this.requires('Mouse')
          .areaMap([0, 0], [0, CONF.fountain.size], [CONF.fountain.size, CONF.fountain.size], [CONF.fountain.size, 0]);

      this.requires('Collision').collision();

      // On collision with an enemy
      this.onHit('onibi', function (target) {
        console.log('onibi hit');
      });
    }
  });
});