
const FRAME_MS = 150;

export function actualizarSpriteEnemy(obj, scene) {
  if (!obj.active) return;

  const frame = Math.floor(scene.time.now / FRAME_MS) % 4;

  const sprites = [
    "enemy5",
    "enemy5-2",
    "enemy5-3",
    "enemy5-4"
  ];

  const key = sprites[frame];

  if (obj.texture.key !== key) {
    obj.setTexture(key);
  }
}
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