require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('SpellPurify', {
    player:undefined,
    enemy:undefined,
    fireCallback:undefined,
    init: function () {

    },
    spellPurify: function (player, enemy){

      this.player = player;
      this.enemy = enemy;

      this.fireCallback = function() {
        // if (this.enemy.isFired()){
          this.enemy.looseCorruption(CONF.spell.purify.strength);
          this.player.looseEssence(CONF.spell.purify.strength);
        // }
      };

      return this;
    },
    fire: function() {
      
      console.log("purify fire()");
      // toX = this.enemy.x - this.enemy.w/2 ;
      // toY = this.enemy.y - this.enemy.h/2 ;
      toX = this.enemy.x;
      toY = this.enemy.y;

      var dx = this.x - toX,
          dy = this.y - toY,
          dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
          speed = Math.round(dist / CONF.spell.speed);

      this.bind('EnterFrame', this.fireCallback);

      return this;
    },
    stopFire : function() {
      console.log("purify stopfire()");
      this.unbind('EnterFrame');
    }

  });

});