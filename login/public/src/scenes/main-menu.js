import { getLoggedInUser, logout } from "../utils/auth.js";

export class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenu" });
  }

  init() {}
  preload() {
    this.load.image("main-menu", "assets/main-menu.png");
    this.load.image("titulo", "assets/titulo.png");
  }

  create() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const bg = this.add.image(gameWidth / 2, gameHeight / 2, "main-menu");
    bg.setDisplaySize(gameWidth, gameHeight);
    this.add.image(700, 200, "titulo");

    const startButton = this.add.text(25, 350, "START GAME", {
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    startButton.setInteractive({ useHandCursor: true });
    startButton.on("pointerdown", () => {
      this.scene.start("GameScene");
    });
    startButton.on("pointerover", () => {
      startButton.setStyle({ backgroundColor: "#f7ebeb" });
    });
    startButton.on("pointerout", () => {
      startButton.setStyle({ backgroundColor: "#ff3636" });
    });

    // BOTON LEADERBOARD---------------------------------------------------
    const leaderboardButton = this.add.text(25, 420, "LEADERBOARD", {
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

    //boton configuracion
    const configuracionButton = this.add.text(25, 485, "CONFIGURACION", {
      fontSize: "28px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    configuracionButton.setInteractive({ useHandCursor: true });
    configuracionButton.on("pointerdown", () => {
      this.scene.start("Configuracion");
    });
    configuracionButton.on("pointerover", () => {
      configuracionButton.setStyle({ backgroundColor: "#f7ebeb" });
    });
    configuracionButton.on("pointerout", () => {
      configuracionButton.setStyle({ backgroundColor: "#ff3636" });
    });

    const usuario = getLoggedInUser();

    this.add
      .text(
        gameWidth - 20,
        20,
        usuario ? `Sesión: ${usuario}` : "Jugando como invitado",
        {
          fontSize: "18px",
          color: "#ffffff",
        }
      )
      .setOrigin(1, 0);

    if (usuario) {
      const logoutButton = this.add
        .text(gameWidth - 20, 46, "CERRAR SESIÓN", {
          fontSize: "16px",
          color: "#ffffff",
          backgroundColor: "#333333",
          padding: { left: 10, right: 10, top: 6, bottom: 6 },
        })
        .setOrigin(1, 0);
      logoutButton.setInteractive({ useHandCursor: true });
      logoutButton.on("pointerdown", () => {
        logout();
        this.scene.start("Login");
      });
      logoutButton.on("pointerover", () => {
        logoutButton.setStyle({ backgroundColor: "#555555" });
      });
      logoutButton.on("pointerout", () => {
        logoutButton.setStyle({ backgroundColor: "#333333" });
      });
    }
  }

  update() {}
}
