define(
  {
    width: 960,
    height: 640,
    onibi: {
      size: 32,
      speed: 5,
      essence: 300,
      loseEssenceTimeout: 2500,
      nbLines: 60,
      beamEvolutionMin: 0.9,
      beamEvolutionMax: 1.2
    },
    scrolling: {
      speed: 10,
      zoneWidth: 50,
      zoneHeight: 50
    },
    level1: {
      width: 1900,
      height: 1900
    },
    enemy: {
      vision: 200,
      size: 128,
      realSizeX: 40,
      realSizeY: 35,
      image: 'img/spider-color.png',
      imagePurified: 'img/spider-color2-purifie.png',
      speed: 3,
      degat: 2,
      corruption: 20
    },
    fountain: {
      essence: 200,
      size:    119
    },
    spell: {
      uiBoxSize : 50,
      purify : {
        size : 120,
        dist : 400,
        type : 1,
        strength : 0.2
      },
      slowDown : {
        size:32,
        type : 2,
        strength : 5
      },
      teleportation : {
        dist : 800,
        type : 3,
        strength : 50
      },
    },
    level: {
      levels: [
        {
          id: 1,
          filename: '1.json'
        },
        {
          id: 2,
          filename: '2.json'
        },
        {
          id: 3,
          filename: '3.json'
        },
      ],
      start: 1,
      layers: ['a.jpg', 'b.png']
    },
    gardian : {
      size: 236,
      corruption:150
    }
  }
);
