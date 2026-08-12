

export class GameScene extends Phaser.Scene {
    constructor() {
    super({ key: 'GameScene'});
    console.log ('escena de juego es creada')
    const speed = 200;
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
const player = this.add.image(0,0, 'player')
player.setPosition(265,190).setScale(0.5);
const enemy = this.add.image(0,0, 'enemy')
enemy.setPosition(1050,190).setScale(0.3);
}

update(){
    this.jugador.setVelocity(0);

if (this.cursors.left.isDown) {
    this.jugador.setVelocityX(-speed);
} else if (this.cursors.right.isDown) {  
    this.jugador.setVelocityX(speed);
}

if (this.cursors.up.isDown) {
    this.jugador.setVelocityY(-speed);
} else if (this.cursors.down.isDown) {
    this.jugador.setVelocityY(speed);
}
}



}