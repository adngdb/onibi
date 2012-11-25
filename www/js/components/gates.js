require(['jquery', 'lib/crafty', 'conf'], function ($, crafty, CONF) {
  Crafty.c('Gate', {
    init: function () {
      this.requires('2D, Mouse, Canvas, Color');
      this.moving = false;
    },

    gate: function () {
      this.bind("Click", function() {
            Crafty.scene('worldMap');
          });
      return this;
    }
  });

  Crafty.c('Gates', {
    gates: function (levelWidth, levelHeight) {
      var gates = CONF.level1.gates;
      for(var gateKey in gates) {
        var gate = gates[gateKey];
        var attr = {x: 0, y: 0, width: 0, height: 0};
        switch(gate.position) {
          case 'up':
              attr.x = 12;
              attr.y = 12;
              attr.width = Crafty.DOM.window.width;
              attr.height = 50;
            break;
          case 'right':
              attr.x = 12;
              attr.y = 12;
              attr.width = 50;
              attr.height = Crafty.DOM.window.height;
            break;
          case 'down':
              attr.x = 12;
              attr.y = 12;
              attr.width = Crafty.DOM.window.width;
              attr.height = 50;
            break;
          case 'left':
              attr.x = 12;
              attr.y = 12;
              attr.width = 50;
              attr.height = Crafty.DOM.window.height;
            break;
        }
        var entity = Crafty.e('Gate')
                      .attr({
                        x: attr.x,
                        y: attr.y,
                        w: attr.w,
                        h: attr.h
                      })
                      .gate();
      }
    }
  });

});
