require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('SpellPurify', {
    player:null,
    enemy:null,
    init: function () {

    },
    spellPurify: function (player, enemy){

      this.player = player;
      this.enemy = enemy;

      return this;
    },
    fire: function() {
      
      console.log("purify fire()");

      if (this.enemy.isFired()){
        console.log("Enemy is fired !");
        // toX = this.enemy.x - this.enemy.w/2 ;
        // toY = this.enemy.y - this.enemy.h/2 ;
        toX = this.enemy.x;
        toY = this.enemy.y;

        var dx = this.x - toX,
            dy = this.y - toY,
            dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
            speed = Math.round(dist / CONF.spell.speed);

        // this.tween({ x: toX, y: toY }, speed);

      
      }
      else {
        console.log("Enemy not fired");
      }

      return this;
    }

  });

});