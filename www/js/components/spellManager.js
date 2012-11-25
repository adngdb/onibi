require(['lib/crafty','conf', 'c/spellPurify'], function(crafty, CONF, purify) {

  Crafty.c('SpellManager', {
    spellType:0,
    init: function () {  
      return this;
    },
    spellManager: function(spellType) {
      this.spellType = spellType;
      return this;
    },
    createSpell: function (player, enemy){

      var spell;
      switch (this.spellType) {
        case CONF.spell.purify.type: //spell purify
            console.log("PURIFY");
            spell = Crafty.e('2D, Canvas, Tween, SpellPurify')
                          .spellPurify(player, enemy)
                          .attr({x:player.x, y:player.y, w:CONF.spell.purify.size, h:CONF.spell.purify.size});
            this.spellType = 0;
          break;

        default :
          //nothing
          console.log("Spell type not recognized !");
          break;
      }

      return spell;
    }

  });

});