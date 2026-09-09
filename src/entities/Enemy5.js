export default class Enemy5 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy5");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.vida = 3;
    this.disableBody(true, true);
  }
  actualizar(player, velocidad = 200) {
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
    this.vida = 3;
  }
}
