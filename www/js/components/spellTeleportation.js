require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('SpellTeleportation', {
    player:undefined,
    targetX:0,
    targetY:0,
    fireCallback:undefined,
    dist:0,
    init: function () {

    },
    spellTeleportation: function (player, target){

      this.player = player;
      this.targetX = target.x;
      this.targetY = target.y;

      return this;
    },
    fire: function() {
      
      console.log("teleportation fire()");
      toX = this.targetX - this.player.w/2;
      toY = this.targetY - this.player.h/2;

      var dx = this.player.x - toX,
          dy = this.player.y - toY;
      
      this.dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (this.dist<=CONF.spell.teleportation.dist) {
        this.player.x = toX;
        this.player.y = toY;
        this.player.looseEssence(CONF.spell.teleportation.strength);
      }
      else {
        console.log('Destination too far for teleportation !');
      }

      return this;
    }

  });

});