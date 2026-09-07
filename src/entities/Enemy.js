export default class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.35);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);

    this.vida = 3;

    this.disableBody(true, true);
  }

  moverAleatorio() {
    if (!this.active) return;

    const velocidad = 233;

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
    this.vida = 3;
  }
}
