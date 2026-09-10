export default class Enemy3 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy3");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(0.1);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);

    this.vida = 6;
    this.disableBody(true, true);
  }

  actualizar(player, velocidad = 150) {
    if (!this.active) return;
    this.scene.physics.moveToObject(this, player, velocidad);
  }

  recibirDaño() {
    if (!this.active) return;

    this.vida -= 1;

    if (this.vida <= 0) {
      this.disableBody(true, true);
    }
  }

  reiniciarVida() {
    this.vida = 6;
  }
}
