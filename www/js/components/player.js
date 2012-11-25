require(['lib/crafty','conf'], function(crafty, CONF) {

  Crafty.c('Onibi', {
    essence: 0,
    maxEssence: 0,
    init: function () {
      this.requires('Mouse')
          .areaMap([0, 0], [0, CONF.onibi.size], [CONF.onibi.size, CONF.onibi.size], [CONF.onibi.size, 0]);

      this.essence = CONF.onibi.essence;
      this.maxEssence = CONF.onibi.essence;

      this.requires('Collision').collision();

      // On collision with an enemy
      this.onHit('Enemy', function (target) {
        var degat = 0;
        target[0].obj.each(function(){
          degat += this.getDegat();
        });
        this.looseEssence(degat);
      });

      // On collision with a fountain
      this.onHit('fountain', function (target) {
        this.receiveEssence(CONF.fountain.essence);
        target[0].obj.destroy();
      });

      this.w = 300;
      this.h = 300;

      // Annimation tools
      this.nbLines = CONF.onibi.nbLines;
      this.fireflyLines = { };
      this.lineLength = function( i, baseLength ) {
        var randomInt = function( min, max ) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var frameInt = function( number, min, max ) {
          if ( number < min ) {
            number = min;
          } else if ( number > max ) {
            number = max;
          }
          return number;
        }
        var min = CONF.onibi.beamEvolutionMin * 100;
        var max = CONF.onibi.beamEvolutionMax * 100;
        if ( typeof( this.fireflyLines[ i ] ) == 'undefined' ) {
          this.fireflyLines[ i ] =  randomInt( min, max );
        } else {
          this.fireflyLines[ i ] *= randomInt( 95, 105 ) / 100;
          this.fireflyLines[ i ] =  frameInt( this.fireflyLines[ i ], min, max );
        }
        return baseLength * this.fireflyLines[ i ] / 100;
      }
      this.addColorStops = function( grad ) {
        grad.addColorStop( 0   , '#FFF' );
        grad.addColorStop( 0.7 , 'rgba( 255, 255, 50, 1   )' );
        grad.addColorStop( 1   , 'rgba( 255, 255, 50, 0   )' );
        return grad;
      }

      this.bind('EnterFrame', function () { this.x = this.x; }.bind(this));
    },
    move: function(toX, toY) {
      toX -= this.w / 2;
      toY -= this.h / 2;

      var dx = this.x - toX,
          dy = this.y - toY,
          dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
          speed = Math.round(dist / CONF.onibi.speed);

      this.tween({ x: toX, y: toY }, speed);

      return this;
    },
    loseEssence: function() {
      this.delay(function() {
        this.essence--;
        if (this.essence === 0) {
          Crafty.trigger('Loosing');
        }
        this.loseEssence();
      }, CONF.onibi.loseEssenceTimeout);
    },
    draw: function() {
      var baseLength = Math.sqrt( this.essence );
      this.w = baseLength * CONF.onibi.beamEvolutionMax * 2;
      this.h = this.w;
      var x1 = this.x + this.w / 2;
      var y1 = this.y + this.h / 2;
      Crafty.canvas.context.lineCap   = 'butt';
      Crafty.canvas.context.lineWidth = 2;
      for ( var i=0; i<this.nbLines; i++ ) {
        var length  = this.lineLength( i, baseLength );
        var angle   = i * Math.PI / this.nbLines * 2;
        var x2      = x1 + Math.cos( angle ) * length;
        var y2      = y1 + Math.sin( angle ) * length;
        var grad = this.addColorStops( Crafty.canvas.context.createRadialGradient(x1,y1,0,x1,y1,length) );
        Crafty.canvas.context.strokeStyle = grad;
        Crafty.canvas.context.beginPath();
        Crafty.canvas.context.moveTo( x1, y1 );
        Crafty.canvas.context.lineTo( x2, y2 );
        Crafty.canvas.context.stroke();
      }

      return this;
    },
    receiveEssence: function(essence) {
      if((this.essence + essence) >= this.maxEssence) {
        this.essence = this.maxEssence;
      }
      else {
        this.essence += essence;
      }

      return this;
    },
    looseEssence: function(essence) {
      this.essence -= essence;
      if( this.essence <= 0) {
        Crafty.scene('menu');
      }

      return this;
    }
  });

});
