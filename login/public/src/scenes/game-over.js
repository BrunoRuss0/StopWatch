
export class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  init() {}
  preload() {
    this.load.image("game-over", "assets/game-over.png");
    this.load.image("Salir2", "assets/Salir2.png");
    this.load.image("Reintentar", "assets/Reintentar.png");
    this.load.image("Leaderboard", "assets/Leaderboard.png");
  }
  create() {
    this.input.setDefaultCursor("default");
    const bg = this.add.image(680, 300, "game-over");
    const menuboton = this.add.image(680, 280, "Salir2");
    menuboton.setDisplaySize(200, 70);
    menuboton.setInteractive({ useHandCursor: true });
    menuboton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
    const restartboton = this.add.image(680, 340, "Reintentar");
    restartboton.setDisplaySize(200, 70);
    restartboton.setInteractive({ useHandCursor: true });
    restartboton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
    const leaderboardButton = this.add.image(680, 400, "Leaderboard");
    leaderboardButton.setDisplaySize(200, 70);
    leaderboardButton.setInteractive({ useHandCursor: true });
    leaderboardButton.on("pointerdown", () => {
      this.scene.start("Leaderboard");
    });
  }
  update() {}
}
