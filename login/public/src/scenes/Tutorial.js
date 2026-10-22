
export class Tutorial extends Phaser.Scene {
  constructor() {
    super({ key: "Tutorial" });
  }

  preload() {
    this.load.image("Tutorial", "assets/tutorial.png");
  
  }

  create() {
    this.input.setDefaultCursor("default");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const bg = this.add.image(gameWidth / 2, gameHeight / 2, "Tutorial");
    bg.setDisplaySize(gameWidth, gameHeight);

    
    // boton menu
    const menuboton = this.add.text(1000, 10, "MAIN MENU", {
      fontSize: "42px",
      color: "#000000",
      backgroundColor: "#ff3636",
      padding: { left: 50, right: 50, top: 30, bottom: 30 },
    });
    menuboton.setInteractive({ useHandCursor: true });
    menuboton.on("pointerdown", () => this.scene.start("MainMenu"));
    menuboton.on("pointerover", () => menuboton.setStyle({ backgroundColor: "#f7ebeb" }));
    menuboton.on("pointerout", () => menuboton.setStyle({ backgroundColor: "#ff3636" }));
  }

 
 
  }
