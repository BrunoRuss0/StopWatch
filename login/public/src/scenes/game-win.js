export class Gamewin extends Phaser.Scene {
  constructor() {
    super({ key: "Gamewin" });
  }

  init() {}
  preload() {
    this.load.image("game-win", "assets/game-win.png");
  }

  create() {
    this.input.setDefaultCursor("default");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const bg = this.add.image(gameWidth / 2, gameHeight / 2, "game-win");
    bg.setDisplaySize(gameWidth, gameHeight);

    const menuboton = this.add.text(550, 450, "MAIN MENU", {
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    menuboton.setInteractive({ useHandCursor: true });
    menuboton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });
    menuboton.on("pointerover", () => {
      menuboton.setStyle({ backgroundColor: "#f7ebeb" });
    });
    menuboton.on("pointerout", () => {
      menuboton.setStyle({ backgroundColor: "#ff3636" });
    });

    const restartboton = this.add.text(520, 500, "RESTART GAME", {
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    restartboton.setInteractive({ useHandCursor: true });
    restartboton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
    restartboton.on("pointerover", () => {
      restartboton.setStyle({ backgroundColor: "#f7ebeb" });
    });
    restartboton.on("pointerout", () => {
      restartboton.setStyle({ backgroundColor: "#ff3636" });
    });

    const leaderboardButton = this.add.text(545, 560, "LEADERBOARD", {
      fontSize: "28px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    leaderboardButton.setInteractive({ useHandCursor: true });
    leaderboardButton.on("pointerdown", () => {
      this.scene.start("Leaderboard");
    });
    leaderboardButton.on("pointerover", () => {
      leaderboardButton.setStyle({ backgroundColor: "#f7ebeb" });
    });
    leaderboardButton.on("pointerout", () => {
      leaderboardButton.setStyle({ backgroundColor: "#ff3636" });
    });
  }

  update() {}
}
