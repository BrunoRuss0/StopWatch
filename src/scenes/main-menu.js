export class MainMenu extends Phaser.Scene {
 constructor() {
 super({ key: 'MainMenu' });
}
 
init() {
}
preload() {
this.load.image('main-menu', 'assets/main-menu.png');
}

create() {
const gameWidth = this.scale.width;
const gameHeight = this.scale.height;
const bg = this.add.image(gameWidth / 2,gameHeight / 2,'main-menu');
bg.setDisplaySize(gameWidth, gameHeight);

const startButton = this.add.text(25,450,'START GAME',
{fontSize: '32px',color: '#000000',backgroundColor: '#ff3636',padding: {left: 30,right: 30,top: 15,bottom: 15}
});
startButton.setInteractive({useHandCursor: true});
startButton.on('pointerdown', () => {this.scene.start('GameScene');});
startButton.on('pointerover', () => {startButton.setStyle({backgroundColor: '#f7ebeb'});
});
 startButton.on('pointerout', () => {startButton.setStyle({backgroundColor: '#ff3636'});});}
 
 update() {

 }
}