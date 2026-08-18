
let player;
let teclas;
let enemy;
let time = 100;
let timerText;  
let hitCooldown = false;
let puedeDisparar = true;
const DELAY_BALA = 300;
const VELOCIDAD_JUGADOR = 300;

export class GameScene extends Phaser.Scene {
constructor() {
super({ key: 'GameScene'});
}

init(){
}

preload(){
this.load.image('background','assets/background.png')
this.load.image('player','assets/player.png')
this.load.image('enemy','assets/enemy.png')
this.load.image("cursor", "assets/cursor.png")
this.load.image("balas", "assets/bala.png")
this.load.image("player-back", "assets/player-back.png")
this.load.image("cursor", "assets/cursor.png")

}
create(){
time = 30;
hitCooldown = false;
this.input.setDefaultCursor('none');
this.cursor = this.add.image(0, 0, 'cursor');
this.cursor.setScale(0.1);
this.cursor.setDepth(100000000);



//BACKGROUND-------------------------------------------------------------------------------------------------
const gameWidth = this.scale.width;
const gameHeight = this.scale.height;
const bg = this.add.image(300,300, 'background');
bg.setPosition(gameWidth /2,gameHeight /2,);
bg.setDisplaySize(gameWidth, gameHeight);

//PLAYER-------------------------------------------------------------------------------------------------
player = this.add.image(0,0, 'player')
player.setPosition(265,190).setScale(0.2);
this.physics.add.existing(player);
player.body.setCollideWorldBounds(true);
teclas = this.input.keyboard.createCursorKeys();

//ENEMY-------------------------------------------------------------------------------------------------
enemy = this.physics.add.image(1050, 190, 'enemy');
enemy.setScale(0.7);
enemy.setImmovable(true);
enemy.body.setCollideWorldBounds(true);
this.physics.add.collider(player, enemy, () => {
if (hitCooldown) return;
time -= 3;
if (time < 0) {
time = 0;
}
timerText.setText('Time: ' + time);
hitCooldown = true;
this.tweens.add({
targets: player,
alpha: 0,
duration: 100,
ease: 'Linear',
yoyo: true,
repeat: 1,
});

  this.time.delayedCall(500, () => {
      hitCooldown = false;
  });
});

//TIMES-------------------------------------------------------------------------------------------------
timerText = this.add.text(580, 10, 'Time: ' + time, { fontSize: '32px', fill: '#8a1ee3',fontStyle: 'bold italic'});
this.time.addEvent({ delay: 1000,callback: actualizarTiempo,callbackScope: this,loop: true });
function actualizarTiempo() {
if (time > 0) {
time -= 1;
}
if (time <= 0) {
time = 0;
timerText.setText('Time: 0');
this.physics.pause();
this.scene.start('GameOver');
}
else 
{timerText.setText('Time: ' + time);}
}
//BALAS-------------------------------------------------------------------------------------------------
this.balas = this.physics.add.group({defaultKey: 'balas',maxSize: 1000000,});
  
this.physics.add.overlap(this.balas, enemy, (bala, enemy) => {bala.disableBody(true, true);enemy.disableBody(true, true);});

this.input.on('pointerdown', (pointer) => {
this.disparar(pointer);   
});
}  
//FIN CREATE-------------------------------------------------------------------------------------------------

//DISPARAR-------------------------------------------------------------------------------------------------
disparar(pointer) {
  if (!puedeDisparar) {
    return;
  }
  let bala = this.balas.get(player.x, player.y);


  if (bala) {
    puedeDisparar = false;
      bala.enableBody(true, player.x, player.y, true, true);
      bala.setScale(0.2);
      let angle = Phaser.Math.Angle.Between(
          player.x,
          player.y,
          pointer.x,
          pointer.y
      );
      bala.setRotation(angle);
      this.physics.velocityFromRotation(
          angle,
          400,
          bala.body.velocity
      );
      this.time.delayedCall(DELAY_BALA, () => {
        puedeDisparar = true;
    });
  }
}



update(){
  this.cursor.x = this.input.activePointer.x;
this.cursor.y = this.input.activePointer.y;
//ENEMY MOVEMENT-------------------------------------------------------------------------------------------------
this.physics.moveToObject(enemy, player, 150);
//MOVIMIENTO IZQ, DER----------------------------------------------------------------------------------------
if (teclas.left.isDown) {
player.body.setVelocityX(-VELOCIDAD_JUGADOR);
} else if (teclas.right.isDown) {
player.body.setVelocityX(VELOCIDAD_JUGADOR);
} else {
player.body.setVelocityX(0);
player.setTexture('player');
}
//MOVIMIENTO ARR, ABA--------------------------------------------------------------
if (teclas.up.isDown) {
player.body.setVelocityY(-VELOCIDAD_JUGADOR);
player.setTexture('player-back'); 
} else if (teclas.down.isDown) {
player.body.setVelocityY(VELOCIDAD_JUGADOR);
} else {
player.body.setVelocityY(0);
player.setTexture('player');
}
}
}
//165 lineas de pura dinamita