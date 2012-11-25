require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Gardian', {
    corruption: 0,
    init: function () {
      this.requires('Mouse')
          .areaMap(
            [0, 0],[CONF.gardian.size,0], [CONF.gardian.size,CONF.gardian.size], [0,CONF.gardian.size]
          )
          .bind('MouseDown', function(e) {
            if ( e.mouseButton == Crafty.mouseButtons.RIGHT ) {
              this.fired = 1;
              this.trigger('EnemyFired', e);
            }
          })
          .bind('MouseUp', function(e) {
            if ( e.mouseButton == Crafty.mouseButtons.RIGHT ) {
              this.fired = 0;
              this.trigger('EnemyStopFired', e);
            }
          });
      
    },
    isFired: function() {
      return this.fired;
    },
    looseCorruption: function(essence){
      if (this.corruption>0) {
        this.corruption -= essence;
        console.log("Gardian corruption : "+this.corruption);
      }
      else {
        this.becomePure();
      }
    },
    becomePure: function() {
      this.animate( 'gardian-infecte', 24, -1);
    }

  });

});
