export class Seleccion extends Phaser.Scene {
    constructor() {
      super({ key: "Seleccion" });
    }
  
    init() {}
    preload() {
      this.load.image("seleccion", "assets/seleccion.png");
    }
  
    create() {
      this.input.setDefaultCursor("default");
      const gameWidth = this.scale.width;
      const gameHeight = this.scale.height;
      const bg = this.add.image(gameWidth / 2, gameHeight / 2, "seleccion");
      bg.setDisplaySize(gameWidth, gameHeight);
  
      const Personaje1 = this.add.text(550, 450, "Personaje 1", {
        fontSize: "32px",
        color: "#000000",
        backgroundColor: "#ff3636",
        padding: { left: 30, right: 30, top: 15, bottom: 15 },
      });
      Personaje1.setInteractive({ useHandCursor: true });
      Personaje1.on("pointerdown", () => {
        this.scene.start("GameScene");
      });
      Personaje1.on("pointerover", () => {
        Personaje1.setStyle({ backgroundColor: "#f7ebeb" });
      });
      Personaje1.on("pointerout", () => {
        Personaje1.setStyle({ backgroundColor: "#ff3636" });
      });
  
      const Personaje2 = this.add.text(550, 350, "Personaje 2", {
        fontSize: "32px",
        color: "#000000",
        backgroundColor: "#ff3636",
        padding: { left: 30, right: 30, top: 15, bottom: 15 },
      });
      Personaje2.setInteractive({ useHandCursor: true });
      Personaje2.on("pointerdown", () => {
        this.scene.start("GameScene");
      });
      Personaje2.on("pointerover", () => {
        Personaje2.setStyle({ backgroundColor: "#f7ebeb" });
      });
      Personaje2.on("pointerout", () => {
        Personaje2.setStyle({ backgroundColor: "#ff3636" });
      });
  

      const Personaje3 = this.add.text(550, 250, "Personaje 3", {
        fontSize: "32px",
        color: "#000000",
        backgroundColor: "#ff3636",
        padding: { left: 30, right: 30, top: 15, bottom: 15 },
      });
      Personaje3.setInteractive({ useHandCursor: true });
      Personaje3.on("pointerdown", () => {
        this.scene.start("GameScene");
      });
      Personaje3.on("pointerover", () => {
        Personaje3.setStyle({ backgroundColor: "#f7ebeb" });
      });
      Personaje3.on("pointerout", () => {
        Personaje3.setStyle({ backgroundColor: "#ff3636" });
      });
  

    
    }
  
    update() {}
  }
  