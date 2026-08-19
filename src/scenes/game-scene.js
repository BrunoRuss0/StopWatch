
let player;
let teclas;
let enemy;
let time = 100;
let timerText;  
let hitCooldown = false;
let puedeDisparar = true;
let gun;
let puedeDispararEnemigo = true;
let enemy2;
const DELAY_BALA = 300;
const VELOCIDAD_JUGADOR = 300;
const DELAY_BALA_ENEMIGO = 1200;


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
this.load.image('enemy2','assets/agustin.jpg')
this.load.image("cursor", "assets/cursor.png")
this.load.image("balas", "assets/bala.png")
this.load.image("player-back", "assets/player-back.png")
this.load.image("cursor", "assets/cursor.png")
this.load.image('gun', 'assets/gun.png')
this.load.image('bala-enemigo', 'assets/bala-enemigo.png')

}
create(){
puedeDisparar = true;
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
teclas = this.input.keyboard.addKeys({
  up: Phaser.Input.Keyboard.KeyCodes.W,
  down: Phaser.Input.Keyboard.KeyCodes.S,
  left: Phaser.Input.Keyboard.KeyCodes.A,
  right: Phaser.Input.Keyboard.KeyCodes.D
});

//GUN-----------------------------------------------------------------------------------------------------
gun = this.add.image(player.x, player.y, 'gun');
gun.setScale(0.03);
gun.setOrigin(0.1, 0.5);
gun.setDepth(player.depth + 1);

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
//ENEMY 2-------------------------------------------------------------------------------------------------------
enemy2 = this.physics.add.image(500, 400, 'enemy2');
enemy2.setScale(0.05);
enemy2.setCollideWorldBounds(true);
this.time.addEvent({
  delay: 500,
  callback: this.moverenemigoAleatorio,
  callbackScope: this,
  loop: true
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
this.physics.add.overlap(this.balas, enemy2, (bala, enemy2) => {bala.disableBody(true, true);enemy2.disableBody(true, true);});


this.input.on('pointerdown', (pointer) => {
this.disparar(pointer);   
});
// BALAS DEL ENEMIGO
this.balasEnemy = this.physics.add.group({defaultKey: 'bala-enemigo', maxSize: 100});
this.time.addEvent({
  delay: DELAY_BALA_ENEMIGO,
  callback: () => {this.dispararenemy();
  },
  callbackScope: this,
  loop: true
});
this.physics.add.overlap(
  this.balasEnemy,
  player,
  this.recibirDisparo,
  null,
  this
);
  }


  
//FIN CREATE-------------------------------------------------------------------------------------------------

moverenemigoAleatorio() {
const velocidad = 300;
const direcciones = [
    
   { x: velocidad, y: 0 },
   { x: -velocidad, y: 0 },
   { x: 0, y: velocidad },
   { x: 0, y: -velocidad }
  ];

const nuevaDireccion = Phaser.Math.RND.pick(direcciones);

enemy2.setVelocity(
nuevaDireccion.x,
nuevaDireccion.y
  );
}

//DISPARAR-------------------------------------------------------------------------------------------------
disparar(pointer){
  if (!puedeDisparar) {
  return;
   }
  let bala = this.balas.get(gun.x, gun.y);
   if (bala) {
    puedeDisparar = false;
     bala.enableBody(true, gun.x, gun.y, true, true);
    bala.setScale(0.1);
    let angle = Phaser.Math.Angle.Between(
    gun.x,
    gun.y,
    pointer.x,
    pointer.y
    );
    bala.setRotation(angle);
    this.physics.velocityFromRotation(
    angle,
    700 ,
    bala.body.velocity
  );
   this.time.delayedCall(DELAY_BALA, () => {
    puedeDisparar = true;
    });
  }
}
// BALAS ENEMIGO--------------------------------------------------------------------------------------------------
dispararenemy() {
  if (!enemy2.active) {
      return;
  }

  if (! puedeDispararEnemigo) {
      return;
  }

  let balaenemy = this.balasEnemy.get(
      enemy2.x,
      enemy2.y
  );

  if (balaenemy) {
      puedeDispararEnemigo = false;

      balaenemy.enableBody(
          true,
          enemy2.x,
          enemy2.y,
          true,
          true
      );

      balaenemy.setScale(0.12);

      const angle = Phaser.Math.Angle.Between(
          enemy2.x,
          enemy2.y,
          player.x,
          player.y
      );

      balaenemy.setRotation(angle);

      this.physics.velocityFromRotation(
          angle,
          500,
          balaenemy.body.velocity
      );

      this.time.delayedCall(DELAY_BALA_ENEMIGO, () => {
          puedeDispararEnemigo = true;
      });
  }
}




recibirDisparo(jugador,bala,) {
  bala.disableBody(true,true);
  if (hitCooldown) {
   return;
  }
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
    repeat: 2
  });
  this.time.delayedCall(500, () => {
   hitCooldown = false;
  });
}

update(){
//GUN------------------------------------------------------------------------------------------------------
const angle = Phaser.Math.Angle.Between(
player.x,
player.y,
this.input.activePointer.x,
this.input.activePointer.y
);
const distancia = 35;
gun.x = player.x + Math.cos(angle) * distancia;
gun.y = player.y + Math.sin(angle) * distancia;
gun.rotation = angle;

this.cursor.x = this.input.activePointer.x;
this.cursor.y = this.input.activePointer.y;
//ENEMY MOVEMENT-------------------------------------------------------------------------------------------------
this.physics.moveToObject(enemy, player, 175);

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
//303 lineas de pura dinamita