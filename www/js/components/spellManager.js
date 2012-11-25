require(['lib/crafty','conf', 'c/spellPurify', 'c/spellTeleportation'], 
  function(crafty,      CONF,         purify,       teleportation) {

  Crafty.c('SpellManager', {
    spellType:0,
    init: function () {  
      return this;
    },
    spellManager: function(spellType) {
      this.spellType = spellType;
      return this;
    },
    createSpell: function (player, target){

      var spell;
      switch (this.spellType) {
        case CONF.spell.purify.type: //spell purify
            console.log("Spell purify");
            spell = Crafty.e('2D, Canvas, Tween, SpellPurify')
                          .spellPurify(player, target)
                          .attr({x:player.x, y:player.y, w:CONF.spell.purify.size, h:CONF.spell.purify.size});
          break;

        case CONF.spell.teleportation.type: //spell purify
            console.log("Spell teleportation");
            spell = Crafty.e('2D, Canvas, Tween, SpellTeleportation')
                          .spellTeleportation(player, target)
                          .attr({x:player.x, y:player.y, w:CONF.spell.teleportation.size, h:CONF.spell.teleportation.size});
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