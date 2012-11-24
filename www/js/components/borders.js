require(['jquery', 'lib/crafty', 'conf'], function ($, crafty, CONF) {
  Crafty.c('Border', {
    init: function () {
      this.requires('2D, Mouse');
      this.moving = false;
    },

    border: function (direction) {
      this.bind("MouseOver", function() {
            this.moving = true;
          })
          .bind("MouseOut", function() {
            this.moving = false;
          });
    }
  });

  Crafty.c('Borders', {
    init: function () {
      this.up = Crafty.e('Border')
                      .attr({
                        x: 0,
                        y: 0,
                        w: Crafty.DOM.window.width,
                        h: CONF.scrolling.zoneHeight
                      });
      this.down = Crafty.e('Border')
                      .attr({
                        x: 0,
                        y: Crafty.DOM.window.height - CONF.scrolling.zoneHeight,
                        w: Crafty.DOM.window.width,
                        h: CONF.scrolling.zoneHeight
                      });
      this.left = Crafty.e('Border')
                      .attr({
                        x: 0,
                        y: 0,
                        w: CONF.scrolling.zoneWidth,
                        h: Crafty.DOM.window.height
                      });
      this.right = Crafty.e('Border')
                      .attr({
                        x: Crafty.DOM.window.width - CONF.scrolling.zoneWidth,
                        y: 0,
                        w: CONF.scrolling.zoneWidth,
                        h: Crafty.DOM.window.height
                      });

      this.bind('EnterFrame', function() {
        if (this.left.moving && Crafty.viewport.x < 0) {
          Crafty.viewport.x += CONF.scrolling.speed;
          this.scroll("x", - CONF.scrolling.speed);
        }
        if (this.right.moving && Crafty.viewport.x > Crafty.DOM.window.width - LEVEL_WIDTH) {
          Crafty.viewport.x -= CONF.scrolling.speed;
          this.scroll("x", CONF.scrolling.speed);
        }
        if (this.up.moving && Crafty.viewport.y < 0) {
          Crafty.viewport.y += CONF.scrolling.speed;
          this.scroll("y", - CONF.scrolling.speed);
        }
        if (this.down.moving && Crafty.viewport.y > Crafty.DOM.window.height - LEVEL_HEIGHT) {
          Crafty.viewport.y -= CONF.scrolling.speed;
          this.scroll("y", CONF.scrolling.speed);
        }
      });

      // Resize borders when the window is changing
      $(window).resize(function() {
        this.left.h = Crafty.DOM.window.height;

        this.right.h = Crafty.DOM.window.height;
        this.right.x = Crafty.DOM.window.width - CONF.scrolling.zoneWidth - Crafty.viewport.x;

        this.up.w = Crafty.DOM.window.width;

        this.down.w = Crafty.DOM.window.width;
        this.down.y = Crafty.DOM.window.height - CONF.scrolling.zoneHeight - Crafty.viewport.y;
      });
    },

    scroll: function (axis, value) {
      if (axis == "x") {
        this.left.x += value;
        this.right.x += value;
        this.up.x += value;
        this.down.x += value;
      }
      else if (axis == "y") {
        this.left.y += value;
        this.right.y += value;
        this.up.y += value;
        this.down.y += value;
      }
    }
  });

});
