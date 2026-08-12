

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
this.load.image ("jugador", "assets/personaje.png")
}

create(){
const gameWidth = this.scale.width;
const gameHeight = this.scale.height;
const bg = this.add.image(300,300, 'background');
bg.setPosition(gameWidth /2,gameHeight /2,)
this.jugador = this.physics.add.sprite(400, 300, "jugador");
this.cursors = this.input.keyboard.createCursorKeys();

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