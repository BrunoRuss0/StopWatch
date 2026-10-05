const FRAME_MS = 300;

export function actualizarSpriteEnemy(obj, scene) {
  if (!obj.active) return;

  const arriba = obj.body.velocity.y < 0;
  const frame2 = Math.floor(scene.time.now / FRAME_MS) % 2 === 1;

  const key = arriba
    ? frame2
      ? "enemy-back-2frame"
      : "enemy-back"
    : frame2
    ? "enemy-2frame"
    : "enemy";

  if (obj.texture.key !== key) obj.setTexture(key);
}

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

  actualizar(player, velocidad = 233) {
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
    this.vida = 3;
  }
}
