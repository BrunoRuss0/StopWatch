export const VIDA_JEFE2 = 40;

export default class Jefe2 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "jefe2");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.vida = VIDA_JEFE2;
    this.puedemoverse = false;
  }

  actualizar(player, velocidad = 120) {
    if (!this.active || this.puedemoverse) return;
    this.scene.physics.moveToObject(this, player, velocidad);
  }

  recibirDaño() {
    if (!this.active) return;
    this.vida -= 1;

    if (!this.puedemoverse) {
      this.setTintFill(0xffffff);
      this.scene.time.delayedCall(60, () => {
        if (this.active && !this.puedemoverse) this.clearTint();
      });
    }

    if (this.vida <= 0) {
      this.disableBody(true, true);
    }
  }

  reiniciarVida() {
    this.vida = VIDA_JEFE2;
    this.puedemoverse = false;
    this.clearTint();
    this.setAlpha(1);
  }
}
