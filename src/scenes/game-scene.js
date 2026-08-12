//cuando se pierde: this.scene.start('GameOver');
let player;
let teclas;
let enemy;
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
//BACKGROUND-------------------------------------------------------------------------------------------------
const gameWidth = this.scale.width;
const gameHeight = this.scale.height;
const bg = this.add.image(300,300, 'background');
bg.setPosition(gameWidth /2,gameHeight /2,);
bg.setDisplaySize(gameWidth, gameHeight);
//BACKGROUND-------------------------------------------------------------------------------------------------

//PLAYER-------------------------------------------------------------------------------------------------
player = this.add.image(0,0, 'player')
player.setPosition(265,190).setScale(0.5);
this.physics.add.existing(player);
player.body.setCollideWorldBounds(true);
teclas = this.input.keyboard.createCursorKeys();
//PLAYER-------------------------------------------------------------------------------------------------

//ENEMY-------------------------------------------------------------------------------------------------
enemy = this.physics.add.image(1050, 190, 'enemy');
enemy.setScale(0.3);
this.physics.add.overlap(player, enemy, (player, enemy) => {
this.physics.pause();
//ENEMY-------------------------------------------------------------------------------------------------

});


}
update(){
//ENEMY MOVEMENT-------------------------------------------------------------------------------------------------
this.physics.moveToObject(enemy, player, 150);
//MOVIMIENTO IZQ DER----------------------------------------------------------------------------------------
if (teclas.left.isDown) {
player.body.setVelocityX(-VELOCIDAD_JUGADOR);
} else if (teclas.right.isDown) {
player.body.setVelocityX(VELOCIDAD_JUGADOR);
} else {
player.body.setVelocityX(0);
}
//MOVIMIENTO ARR ABA--------------------------------------------------------------
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
