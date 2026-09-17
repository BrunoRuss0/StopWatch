import { GameScene } from "./scenes/game-scene.js";
import { MainMenu } from "./scenes/main-menu.js";
import { GameOver } from "./scenes/game-over.js";
import { Login } from "./scenes/login.js";
import { Leaderboard } from "./scenes/leaderboard-scene.js";

const config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  backgroundColor: "#f000ff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  dom: {
    createContainer: true, 
  },

  scale: { width: "100%", height: "100%", mode: Phaser.Scale.FIT },
  scene: [Login, MainMenu, GameScene, GameOver, Leaderboard], 
};

const game = new Phaser.Game(config);