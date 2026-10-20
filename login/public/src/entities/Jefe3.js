export default class Jefe3 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "jefe3");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.vidaMax = 100;
    this.vida = this.vidaMax;
    this.ocupado = false;
    this.disableBody(true, true);
  }

  recibirDaño() {
    if (!this.active) return;
    this.vida -= 1;
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (this.scene) this.clearTint();
    });
    if (this.vida <= 0) {
      this.disableBody(true, true);
    }
  }

  reiniciarVida() {
    this.vida = this.vidaMax;
    this.ocupado = false;
  }
}