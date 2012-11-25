require(['lib/crafty','conf', 'c/spellPurify'], function(crafty, CONF, purify) {

  Crafty.c('SpellManager', {
    init: function () {  
      return this;
    },
    createSpell: function (spellType, player, enemy){

      console.log("createSpell");
      var spell;
      switch (spellType) {
        case CONF.spell.purify.type: //spell purify
            spell = Crafty.e('2D, Canvas, Tween, Spell, SpellPurify').
                          .spellPurify(player, enemy)
                          .attr({x:player.x, y:player.y, w:CONF.spell.purify.size, h:CONF.spell.purify.size});
          break;

        default :
          //nothing
          break;
      }

      return spell;
    }

  });

});