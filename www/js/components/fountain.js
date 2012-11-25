require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Fountain', {
    init: function () {
      this.requires('Collision').collision();

      // On collision with an enemy
      this.onHit('onibi', function (target) {
        console.log('onibi hit');
      });
    }
  });
});