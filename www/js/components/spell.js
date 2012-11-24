require(['lib/crafty','conf'], function(crafty, CONF) {
  spellType:0,
  Crafty.c('Spell', {
    init: function () {  

    },
    spell: function (spellType, playerX, playerY, targetX, targetY){

      this.spellType = spellType;

      return this;
    },
    fire: function(toX, toY, target) {
      
      console.log("fire(toX,toY)=("+toX+","+toY+")");

      switch (this.spellType) {
        case CONF.spell.purify.type:
          console.log("purify");
          toX -= target.w / 2;
          toY -= target.h / 2;

          var dx = this.x - toX,
              dy = this.y - toY,
              dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
              speed = Math.round(dist / CONF.spell.speed);

          this.tween({ x: toX, y: toY }, speed);
          this.bind('TweenEnd', function(e){
            console.log('TweenEnd');
          });

          break;
        case CONF.spell.slowDown.type:

          break;
        case CONF.spell.teleportation.type:

          break;
        default:
          //nothing
          break;
      }

      return this;
    }

  });

});