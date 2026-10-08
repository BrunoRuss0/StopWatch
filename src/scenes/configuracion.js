import { getVolumen, setVolumen, volEfecto, aplicarMaster } from "../utils/audioconfig.js";

export class Configuracion extends Phaser.Scene {
  constructor() {
    super({ key: "Configuracion" });
  }

  preload() {
    this.load.image("configuracion", "assets/configuracion.jpg");
    this.load.audio("bala", "assets/bala.wav"); 
  }

  create() {
    this.input.setDefaultCursor("default");
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    const bg = this.add.image(gameWidth / 2, gameHeight / 2, "configuracion");
    bg.setDisplaySize(gameWidth, gameHeight);

    aplicarMaster(this);

    const x = gameWidth * 0.35;
    const ancho = gameWidth * 0.3;
    this.crearSlider(x, 180, ancho, "Volumen general", "master");
    this.crearSlider(x, 290, ancho, "Volumen música", "musica");
    this.crearSlider(x, 400, ancho, "Volumen efectos", "efectos");

    // boton menu
    const menuboton = this.add.text(25, 450, "MAIN MENU", {
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

  crearSlider(x, y, ancho, etiqueta, tipo) {
    const inicial = getVolumen(tipo);
    const estiloTexto = { fontSize: "32px", color: "#000000", fontStyle: "bold" };
    this.add.text(x, y - 55, etiqueta, estiloTexto);
    const porcentaje = this.add.text(x + ancho + 30, y - 18, "", estiloTexto);
    this.add.rectangle(x, y, ancho, 12, 0x333333).setOrigin(0, 0.5);
    const relleno = this.add.rectangle(x, y, ancho * inicial, 12, 0xff3636).setOrigin(0, 0.5);
    const manija = this.add.circle(x + ancho * inicial, y, 18, 0xf7ebeb);
    manija.setStrokeStyle(4, 0x000000);
    manija.setInteractive({ draggable: true, useHandCursor: true });
    const actualizar = (valor) => {
      valor = Phaser.Math.Clamp(valor, 0, 1);
      setVolumen(tipo, valor);
      if (tipo === "master") aplicarMaster(this);
      relleno.width = ancho * valor;
      manija.x = x + ancho * valor;
      porcentaje.setText(Math.round(valor * 100) + "%");
    };
    actualizar(inicial);
    const probarSonido = () => {
      if (tipo === "efectos" || tipo === "master") {
        this.sound.play("bala", { volume: volEfecto(0.5) });
      }
    };
    manija.on("drag", (pointer, dragX) => actualizar((dragX - x) / ancho));
    manija.on("dragend", probarSonido);
    const zona = this.add.zone(x, y, ancho, 40).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    zona.on("pointerdown", (pointer) => {
      actualizar((pointer.x - x) / ancho);
      probarSonido();
    });
  }
}