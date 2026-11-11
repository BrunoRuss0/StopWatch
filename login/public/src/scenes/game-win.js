export class Gamewin extends Phaser.Scene {
  constructor() {
    super({ key: "Gamewin" });
  }

  init() {}
  preload() {
    this.load.image("game-win", "assets/Victory.png");
    this.load.image("Play-Again", "assets/Play-Again.png");
    this.load.image("Salir", "assets/Salir.png");
    this.load.image("Leaderboard", "assets/Leaderboard.png");
  }

  create() {
    this.input.setDefaultCursor("default");
;
    const bg = this.add.image( 680, 300,"game-win");
    
    const menuboton = this.add.image(680, 320, "Salir");
    menuboton.setDisplaySize(200, 70);
    menuboton.setInteractive({ useHandCursor: true });
    
    const restartboton = this.add.image(680, 375, "Play-Again");
    restartboton.setDisplaySize(200, 70);
    restartboton.setInteractive({ useHandCursor: true });
    
    const leaderboardButton = this.add.image(680, 430, "Leaderboard");
    leaderboardButton.setDisplaySize(200, 70);
    leaderboardButton.setInteractive({ useHandCursor: true });
  }

  update() {}
}
