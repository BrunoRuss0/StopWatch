import { getScores } from "../utils/leaderboard.js";

export class Leaderboard extends Phaser.Scene {
  constructor() {
    super({ key: "Leaderboard" });
  }

  init(data) {
    this.victoria = !!(data && data.victory);
    this.ultimoTiempo =
      data && data.lastTime !== undefined ? data.lastTime : null;
    this.yaMarcado = false;
  }

  preload() {}

  create() {
    this.input.setDefaultCursor("default");

    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.cameras.main.setBackgroundColor("#1b1b1b");

    let y = 50;

    if (this.victoria) {
      this.add
        .text(gameWidth / 2, y, "¡JEFE DERROTADO!", {
          fontSize: "36px",
          color: "#ff3636",
          fontStyle: "bold",
        })
        .setOrigin(0.5, 0);
      y += 50;

      this.add
        .text(gameWidth / 2, y, "Tiempo restante: " + this.ultimoTiempo, {
          fontSize: "24px",
          color: "#ffffff",
        })
        .setOrigin(0.5, 0);
      y += 50;
    }

    this.add
      .text(gameWidth / 2, y, "TABLA DE CLASIFICACIÓN", {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);
    y += 60;

    const scores = getScores();

    if (scores.length === 0) {
      this.add
        .text(gameWidth / 2, y, "Todavía no hay puntajes guardados.", {
          fontSize: "20px",
          color: "#cccccc",
        })
        .setOrigin(0.5, 0);
      y += 40;
    } else {
      scores.forEach((entry, index) => {
        const esElNuevo =
          this.victoria && !this.yaMarcado && this.ultimoTiempo === entry.time;

        if (esElNuevo) this.yaMarcado = true;

        const color = esElNuevo ? "#ffd700" : "#ffffff";
        const usuario = entry.usuario || "Invitado";
        const texto = `${index + 1}.  ${usuario}  —  ${entry.time}s   (${
          entry.date
        })`;

        this.add
          .text(gameWidth / 2, y, texto, {
            fontSize: "22px",
            color,
          })
          .setOrigin(0.5, 0);
        y += 32;
      });
    }

    y += 30;

    // BOTON MAIN MENU-------------------------------------------------------
    const offsetX = this.victoria ? 120 : 0;

    const menuboton = this.add
      .text(gameWidth / 2 - offsetX, y, "MAIN MENU", {
        fontSize: "28px",
        color: "#000000",
        backgroundColor: "#ff3636",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5, 0);
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

    if (this.victoria) {
      const jugarboton = this.add
        .text(gameWidth / 2 + offsetX, y, "JUGAR DE NUEVO", {
          fontSize: "28px",
          color: "#000000",
          backgroundColor: "#ff3636",
          padding: { left: 20, right: 20, top: 10, bottom: 10 },
        })
        .setOrigin(0.5, 0);
      jugarboton.setInteractive({ useHandCursor: true });
      jugarboton.on("pointerdown", () => {
        this.scene.start("GameScene");
      });
      jugarboton.on("pointerover", () => {
        jugarboton.setStyle({ backgroundColor: "#f7ebeb" });
      });
      jugarboton.on("pointerout", () => {
        jugarboton.setStyle({ backgroundColor: "#ff3636" });
      });
    }
  }

  update() {}
}
