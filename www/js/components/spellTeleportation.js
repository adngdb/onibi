require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('SpellTeleportation', {
    player:undefined,
    targetX:0,
    targetY:0,
    fireCallback:undefined,
    dist:0,
    audioEffect:undefined,
    init: function () {

      this.audioEffect = new buzz.sound( 'sfx/Sfxs/Spere_01', {
            formats: [ "ogg" ]
        });

    },
    spellTeleportation: function (player, target){

      this.player = player;
      this.targetX = target.x;
      this.targetY = target.y;

      return this;
    },
    fire: function() {
      
      toX = this.targetX - this.player.w/2;
      toY = this.targetY - this.player.h/2;

      var dx = this.player.x - toX,
          dy = this.player.y - toY;
      
      this.dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (this.dist<=CONF.spell.teleportation.dist) {
        this.audioEffect.play();
        var spell = this;
        setTimeout(function() {
          //wait for audio before continue
          spell.player.x = toX;
          spell.player.y = toY;
          spell.player.looseEssence(CONF.spell.teleportation.strength);
        }, 500);
        
      }
      else {
        console.log('Destination too far for teleportation !');
      }

      return this;
    }

  });

});