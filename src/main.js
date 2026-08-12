import { GameScene } from "./scenes/game-scene.js"; 

const VELOCIDAD_PLAYER = 200;
const config ={
type: Phaser.AUTO, 
scene: GameScene,
scale: {
 width: '100%',
 height: '100%',
 mode: Phaser.Scale.FIT,
 physics: { default: "arcade",
    arcade: {
        gravity: { y: 0 },
        debug: false
  }
}

},
 backgroundColor: '#f000ff',
};

const game = new Phaser.Game(config);   