export default class Enemy10 extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "enemy10");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1);
    this.setImmovable(true);
    this.body.setCollideWorldBounds(true);
    this.vida = 4;
    this.disableBody(true, true);
  }
  actualizar(player, velocidad = 100) {
    if (!this.active) return;
    this.scene.physics.moveToObject(this, player, velocidad);
  }
  recibirDaño() {
    if (!this.active) return;
    this.vida -= 1;
    if (this.vida <= 0) {
         this.setTexture("muerte");
   this.scene.time.delayedCall(300, () => {
        this.setTexture("enemy10");
                    this.disableBody(true, true);

              });
    }
  }
  reiniciarVida() {
    this.vida = 4;
  }
}
