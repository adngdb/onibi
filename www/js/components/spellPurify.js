require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('SpellPurify', {
    player:undefined,
    enemy:undefined,
    fireCallback:undefined,
    dist:0,
    init: function () {

    },
    spellPurify: function (player, enemy){

      this.player = player;
      this.enemy = enemy;

      this.fireCallback = function() {
        
        this.enemy.looseCorruption(CONF.spell.purify.strength);
        this.player.looseEssence(CONF.spell.purify.strength);
      };

      return this;
    },
    fire: function() {
      
      console.log("purify fire()");
      toX = this.enemy.x;
      toY = this.enemy.y;

      var dx = this.x - toX,
          dy = this.y - toY;

      this.dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (this.dist<=CONF.spell.purify.dist) {
        this.bind('EnterFrame', this.fireCallback);
      }
      else {
        console.log('Player is too far from the enemy for the spell !');
      }

      return this;
    },
    stopFire : function() {
      console.log("purify stopfire()");
      if (this.dist<=CONF.spell.purify.dist) {
        this.unbind('EnterFrame');
      }
    }

  });

});