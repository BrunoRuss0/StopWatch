import { GameScene } from "./scenes/game-scene.js"; 

const config ={
type: Phaser.AUTO, 
scene: GameScene,
scale: {
 width: '100%',
 height: '100%',
 mode: Phaser.Scale.FIT,

},
 backgroundColor: '#f000ff',
};

const game = new Phaser.Game(config);   