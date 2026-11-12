
export class Tutorial extends Phaser.Scene {
  constructor() {
    super({ key: "Tutorial" });
  }

  preload() {
    this.load.image("Tutorial", "assets/tutorial.png");
    this.load.image("Salir", "assets/Salir.png");
  }

  create() {
    this.input.setDefaultCursor("default");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const bg = this.add.image(gameWidth / 2, gameHeight / 2, "Tutorial");
    bg.setDisplaySize(gameWidth, gameHeight);

    
    // boton menu
    const menuboton = this.add.image(1200, 60, "Salir");
    menuboton.setDisplaySize(300, 100);
    menuboton.setInteractive({ useHandCursor: true });
    menuboton.on("pointerdown", () => {
      this.scene.start("MainMenu");
    });

 
 
  }
}