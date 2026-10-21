export class Dificultad extends Phaser.Scene {
  constructor() {
    super({ key: "Dificultad" });
  }

  init() {}
  preload() {
    this.load.image("dificultad", "assets/dificultad.png");
  }

  create() {
    this.input.setDefaultCursor("default");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const bg = this.add.image(gameWidth / 2, gameHeight / 2, "dificultad");
    bg.setDisplaySize(gameWidth, gameHeight);

    const Facil = this.add.text(600, 250, "Facil", {
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    Facil.setInteractive({ useHandCursor: true });
    Facil.on("pointerdown", () => {
      this.registry.set("difficulty", "easy");
      this.scene.start("Seleccion");
    });
    Facil.on("pointerover", () => {
      Facil.setStyle({ backgroundColor: "#f7ebeb" });
    });
    Facil.on("pointerout", () => {
      Facil.setStyle({ backgroundColor: "#ff3636" });
    });

    const Medio = this.add.text(600, 350, "Medio", {
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    Medio.setInteractive({ useHandCursor: true });
    Medio.on("pointerdown", () => {
      this.registry.set("difficulty", "medium");
      this.scene.start("Seleccion");
    });
    Medio.on("pointerover", () => {
      Medio.setStyle({ backgroundColor: "#f7ebeb" });
    });
    Medio.on("pointerout", () => {
      Medio.setStyle({ backgroundColor: "#ff3636" });
    });

    const Dificil = this.add.text(600, 450, "Dificil", {
      fontSize: "32px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 30, right: 30, top: 15, bottom: 15 },
    });
    Dificil.setInteractive({ useHandCursor: true });
    Dificil.on("pointerdown", () => {
      this.registry.set("difficulty", "hard");
      this.scene.start("Seleccion");
    });
    Dificil.on("pointerover", () => {
      Dificil.setStyle({ backgroundColor: "#f7ebeb" });
    });
    Dificil.on("pointerout", () => {
      Dificil.setStyle({ backgroundColor: "#ff3636" });
    });
  }

  update() {}
}
