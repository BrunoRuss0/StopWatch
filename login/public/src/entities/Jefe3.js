export default class Jefe extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
      super(scene, x, y, "jefe3");
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setImmovable(true);
      this.body.setCollideWorldBounds(true);
      this.vida = 50;
      this.disableBody(true, true);
    }
    actualizar(player, velocidad = 100) {
      if (!this.active) return;
      this.scene.physics.moveToObject(this, player, velocidad);
    }
    recibirDaño() {
      if (!this.active) return;
      this.vida -= 1;
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(60, () => {
        this.clearTint();
      });
      if (this.vida <= 0) {
        this.disableBody(true, true);
      }
    }
    reiniciarVida() {
      this.vida = 50;
    }
  }
  