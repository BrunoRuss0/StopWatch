export default class Enemy4 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy4");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.04);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.vida = 4;
    this.disableBody(true, true);
  }
  moverAleatorio() {
    if (!this.active) return;
    const velocidad = 200;
    const direcciones = [
      { x: velocidad, y: 0, dir: "-right" },
      { x: -velocidad, y: 0, dir: "-left" },
      { x: 0, y: velocidad, dir: "" },
      { x: 0, y: -velocidad, dir: "-back" },
    ];
    const d = Phaser.Math.RND.pick(direcciones);
    this.setVelocity(d.x, d.y);
    this.dir = d.dir;
  }
  recibirDaño() {
    if (!this.active) return;
    this.vida -= 1;
    if (this.vida <= 0) {
      this.disableBody(true, true);
    }
  }
  reiniciarVida() {
    this.vida = 4;
  }
}
