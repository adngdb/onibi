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
        this.stop()
          .animate( 'purify-anim', 24, -1);
        this.enemy.looseCorruption(CONF.spell.purify.strength);
        this.player.looseEssence(CONF.spell.purify.strength);
      };

      return this;
    },
    fire: function() {
      
      toX = this.enemy.x;
      toY = this.enemy.y;

      this.x = toX + this.enemy.w/2 - this.w/2 - 10; //magic number
      this.y = toY + this.enemy.h/2 - this.h/2 ; 

      var dx = this.player.x - toX,
          dy = this.player.y - toY;

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
      if (this.dist<=CONF.spell.purify.dist) {
        this.unbind('EnterFrame');
        this.stop();
      }
    }

  });

});