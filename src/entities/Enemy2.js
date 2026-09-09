export default class Enemy2 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy2");
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
      { x: velocidad, y: 0 },
      { x: -velocidad, y: 0 },
      { x: 0, y: velocidad },
      { x: 0, y: -velocidad },
    ];
    const dir = Phaser.Math.RND.pick(direcciones);
    this.setVelocity(dir.x, dir.y);
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
