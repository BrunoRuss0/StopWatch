export default class Enemy extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.35);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.vida = 2;
    this.disableBody(true, true);
  }
  actualizar(player) {
    if (!this.active) return;
    this.scene.physics.moveToObject(this, player, 233);
  }
  recibirDanio() {
    if (!this.active) return;
    this.vida -= 1;
    if (this.vida <= 0) {
      this.disableBody(true, true);
    }
  }
  reiniciarVida() {
    this.vida = 2;
  }
}
