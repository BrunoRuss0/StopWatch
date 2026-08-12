export class GameScene extends Phaser.Scene {
    constructor() {
    super({ key: 'GameScene'});
    console.log ('esceba de juego es creada')
    }

init(){
}

preload(){
this.load.image('background','assets/background.png')
}
create(){
const gameWidth = this.scale.width;
const gameHeight = this.scale.height;
const bg = this.add.image(300,300, 'background');
bg.setPosition(gameWidth /2,gameHeight /2,)
}

update(){
}


}