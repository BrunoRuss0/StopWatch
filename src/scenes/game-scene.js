let player;
let teclas;
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
}
create(){
const gameWidth = this.scale.width;
const gameHeight = this.scale.height;
const bg = this.add.image(300,300, 'background');
bg.setPosition(gameWidth /2,gameHeight /2,);
bg.setDisplaySize(gameWidth, gameHeight);
const enemy = this.add.image(0,0, 'enemy')
enemy.setPosition(1050,190).setScale(0.3);
//crear jugador
player = this.add.image(0,0, 'player')
player.setPosition(265,190).setScale(0.5);
this.physics.add.existing(player);
player.body.setCollideWorldBounds(true);
teclas = this.input.keyboard.createCursorKeys();
}

update(){
    //jugador--------------------------------------------------------------
       //movimiento izquierda, derecha--------------------------------------------------------------
    if (teclas.left.isDown) {
        player.body.setVelocityX(-VELOCIDAD_JUGADOR);
      } else if (teclas.right.isDown) {
        player.body.setVelocityX(VELOCIDAD_JUGADOR);
      } else {
        player.body.setVelocityX(0);
      }
     //movimiento arriba, abajo--------------------------------------------------------------
      if (teclas.up.isDown) {
        player.body.setVelocityY(-VELOCIDAD_JUGADOR);
      } else if (teclas.down.isDown) {
        player.body.setVelocityY(VELOCIDAD_JUGADOR);
      } else {
        player.body.setVelocityY(0);
      }
//fin jugador--------------------------------------------------------------
}


}