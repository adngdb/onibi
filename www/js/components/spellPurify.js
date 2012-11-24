require(['lib/crafty','conf'], function(crafty, CONF) {
  spellType:0,
  Crafty.c('SpellPurify', {
    sourceX:0,
    sourceY:0,
    destX:0,
    destY:0,
    init: function () {  

    },
    spell: function (playerX, playerY, targetX, targetY){

      this.sourceX = playerX;
      this.sourceY = playerY;
      this.destX = targetX;
      this.destY = targetY;

      return this;
    },
    fire: function(toX, toY, target) {
      
      console.log("fire(toX,toY)=("+toX+","+toY+")");
     
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

      return this;
    }

  });

});