import Enemy from "../entities/Enemy.js";
import Enemy2 from "../entities/Enemy2.js";
import Enemy3 from "../entities/Enemy3.js";
import Enemy4 from "../entities/Enemy4.js";
import Enemy5 from "../entities/Enemy5.js";
import Enemy6 from "../entities/Enemy6.js";
import Enemy7 from "../entities/Enemy7.js";
import Enemy8 from "../entities/Enemy8.js";
import Jefe from "../entities/Jefe.js";
import { addScore } from "../utils/leaderboard.js";
import { getLoggedInUser } from "../utils/auth.js";

let player;
let teclas;
let enemy;
let enemy2;
let enemy3;
let enemy4;
let enemy5;
let enemy6;
let enemy7;
let enemy8;
let jefe;
let enemies;
let enemies2;
let enemies3;
let enemies4;
let enemies5;
let enemies6;
let enemies7;
let enemies8;
let currentRoom = 0;
let time = 300;
let timerText;
let gun;
let hitCooldown = false;
let puedeDisparar = true;
let parryActivo = false;
let puedeParry = true;
let mostrandoPuedeParry = false;
let puedeDispararEnemy4 = true;
let jefePatron = 1;
const REF_WIDTH = 1280;
const REF_HEIGHT = 720;
const DELAY_BALA_ENEMIGO = 1200;
const DELAY_BALA_ENEMY4 = 3000;
const COOLDOWN_parry = 3000;
const DURACION_parry = 300;
const DELAY_BALA = 300;
const VELOCIDAD_JUGADOR = 300;
const DELAY_PATRON_JEFE = 3500;
const VELOCIDAD_MOVIMIENTO_JEFE = 60;
const CANTIDAD_BALAS_RADIAL_JEFE = 12;
const VELOCIDAD_BALA_RADIAL_JEFE = 350;
const CANTIDAD_BALAS_ESCOPETA_JEFE = 10;
const SEPARACION_ESCOPETA_JEFE = 0.15;
const VELOCIDAD_BALA_ESCOPETA_JEFE = 300;
const VELOCIDAD_ENEMY5 = 130;
const VELOCIDAD_DASH_ENEMY5 = 1000;
const DURACION_DASH_ENEMY5 = 700;
const DASH_MIN_ENEMY5 = 2000;
const DASH_MAX_ENEMY5 = 5000;
const DELAY_TELEGRAPH_LASER_ENEMY7 = 800;
const DURACION_LASER_ENEMY7 = 180;
const DELAY_LASER_ENEMY7 = 3000;
const ANCHO_LASER_ENEMY7 = 10;
const DAÑO_LASER_ENEMY7 = 8;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {}

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("background2", "assets/background2.JPG");
    this.load.image("player", "assets/player.png");
    this.load.image("player-left", "assets/player-left.png");
    this.load.image("player-right", "assets/player-right.png");
    this.load.image("player-back", "assets/player-back.png");
    this.load.image("player-back-right", "assets/player-back-right.png");
    this.load.image("player-back-left", "assets/player-back-left.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("enemy2", "assets/agustin.jpg");
    this.load.image("puerta", "assets/puerta.jPG");
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("gun", "assets/gun.png");
    this.load.image("balas", "assets/bala.png");
    this.load.image("bala-enemigo", "assets/bala-enemigo.png");
    this.load.image("GameOver", "assets/game-over.png");
    this.load.image("bala-jefe", "assets/bala-jefe.png");
    this.load.image("parry", "assets/parry.png");
    this.load.image("puede-parry", "assets/puedeparry.png");
    this.load.image("enemy3", "assets/enemy3.jpg");
    this.load.image("enemy4", "assets/enemy4.jpg");
    this.load.image("enemy5", "assets/enemy5.jpg");
    this.load.image("enemy6", "assets/enemy6.png");
    this.load.image("enemy7", "assets/enemy7.png");
    this.load.image("enemy8", "assets/enemy8.png");
    this.load.image("jefe", "assets/jefe.png");
    this.load.audio("parry", "assets/parry.mp3");
    this.load.audio("verity", "assets/Verity.mp3");
    this.load.audio("phonk", "assets/Phonk.mp3");
    this.load.audio("mario", "assets/Mario.mp3");
    this.load.audio("quagmire", "assets/Quagmire.mp3");
    this.load.audio("bala", "assets/bala.wav");
    this.load.audio("bala_enemigo", "assets/bala_enemigo.wav");
  }

  px(x) {
    return x * this.escalaX;
  }
  py(y) {
    return y * this.escalaY;
  }
  pos(x, y) {
    return { x: this.px(x), y: this.py(y) };
  }
  esc(valorEscala) {
    return valorEscala * this.escala;
  }

  v(valor) {
    return valor * this.escala;
  }

  create() {
    currentRoom = 0;
    puedeDisparar = true;
    puedeParry = true;
    time = 300;
    hitCooldown = false;
    puedeDispararEnemy4 = true;
    parryActivo = false;
    mostrandoPuedeParry = false;
    jefePatron = 1;
    this.jefeDerrotadoFlag = false;

    //ESCALADO-------------------------------------------------------------------------------------------------
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.escalaX = this.gameWidth / REF_WIDTH;
    this.escalaY = this.gameHeight / REF_HEIGHT;
    this.escala = Math.min(this.escalaX, this.escalaY);
    this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);

    this.input.setDefaultCursor("none");
    this.cursor = this.add.image(0, 0, "cursor");
    this.cursor.setScale(this.esc(0.1));
    this.cursor.setDepth(100000000);
    this.parry = this.sound.add("parry");
    this.cancion = this.sound.add("verity");
    this.cancion2 = this.sound.add("phonk");
    this.cancionJ2 = this.sound.add("quagmire");

    this.cancionJ = this.sound.add("mario", {
      volume: 1.5,
    });
    this.bala_enemigo = this.sound.add("bala_enemigo", {
      volume: 0.5,
    });
    this.bala = this.sound.add("bala", {
      volume: 0.5,
    });
    //BACKGROUND-------------------------------------------------------------------------------------------------
    const bg = this.add.image(300, 300, "background");
    bg.setPosition(this.gameWidth / 2, this.gameHeight / 2);
    bg.setDisplaySize(this.gameWidth, this.gameHeight);
    //BACKGROUND2-------------------------------------------------------------------------------------------------
    this.bg = this.add.image(300, 300, "background2");
    this.bg.setPosition(this.gameWidth / 2, this.gameHeight / 2);
    this.bg.setDisplaySize(this.gameWidth, this.gameHeight);
    this.bg.setAlpha(0);
    //PLAYER-------------------------------------------------------------------------------------------------
    player = this.add.image(0, 0, "player");
    const posPlayer = this.pos(265, 190);
    player.setPosition(posPlayer.x, posPlayer.y).setScale(this.esc(0.2));
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    teclas = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      parry: Phaser.Input.Keyboard.KeyCodes.Q,
    });
    this.input.keyboard.on("keydown-Q", () => {
      if (!puedeParry) {
        return;
      }
      puedeParry = false;
      parryActivo = true;
      player.setTexture("parry");
      this.time.delayedCall(DURACION_parry, () => {
        parryActivo = false;
        player.setTexture("player");
        player.setScale(this.esc(0.2));
        hitCooldown = true;
        this.time.delayedCall(500, () => {
          hitCooldown = false;
        });

        this.time.delayedCall(COOLDOWN_parry, () => {
          puedeParry = true;
          mostrandoPuedeParry = true;
          player.setTexture("puede-parry");
          this.time.delayedCall(100, () => {
            mostrandoPuedeParry = false;
            player.setTexture("player");
            player.setScale(this.esc(0.2));
          });
        });
      });
    });

    this.input.keyboard.on("keydown-R", () => {
      this.scene.start("GameScene");
    });

    //DOOR-------------------------------------------------------------------------------------------------
    const posDoor = this.pos(1200, 300);
    this.door = this.physics.add.staticImage(posDoor.x, posDoor.y, "puerta");
    this.door.setScale(this.esc(0.15));

    this.door.body.setSize(
      this.door.displayWidth / this.door.scaleX,
      this.door.displayHeight / this.door.scaleY
    );
    this.door.body.setOffset(0, 0);
    this.door.refreshBody();
    this.physics.add.overlap(
      player,
      this.door,
      this.cambiarHabitacion,
      null,
      this
    );

    //GUN-----------------------------------------------------------------------------------------------------
    gun = this.add.image(player.x, player.y, "gun");
    gun.setScale(this.esc(0.03));
    gun.setOrigin(0.1, 0.5);
    gun.setDepth(player.depth + 1);

    //ENEMY-------------------------------------------------------------------------------------------------
    const posEnemy = this.pos(1050, 190);
    enemy = new Enemy(this, posEnemy.x, posEnemy.y);
    enemy.setScale(this.esc(0.35));

    this.physics.add.collider(player, enemy, () => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    //ENEMY 2-------------------------------------------------------------------------------------------------------
    const posEnemy2 = this.pos(1050, 400);
    enemy2 = new Enemy2(this, posEnemy2.x, posEnemy2.y);
    enemy2.setScale(this.esc(0.04));

    this.physics.add.collider(player, enemy2, () => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    this.time.addEvent({
      delay: 500,
      callback: this.moverenemigoAleatorio,
      callbackScope: this,
      loop: true,
    });
    //ENEMY 3-------------------------------------------------------------------------------------------------------
    const posEnemy3 = this.pos(1050, 600);
    enemy3 = new Enemy3(this, posEnemy3.x, posEnemy3.y);
    enemy3.setScale(this.esc(0.1));

    this.physics.add.collider(player, enemy3, () => {
      if (hitCooldown) return;
      time -= 10;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    //ENEMY 4----------------------------------------------------------------------------------------------------
    enemies4 = this.physics.add.group();
    const posEnemy4 = this.pos(1050, 400);
    enemy4 = new Enemy4(this, posEnemy4.x, posEnemy4.y);
    enemy4.setScale(this.esc(0.5));

    this.physics.add.collider(player, enemy4, (player, clone) => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    this.time.addEvent({
      delay: 500,
      callback: this.moverenemigo4Aleatorio,
      callbackScope: this,
      loop: true,
    });
    //ENEMY 5-------------------------------------------------------------------------------------------------------
    enemies5 = this.physics.add.group();
    const posEnemy5 = this.pos(1050, 600);
    enemy5 = new Enemy5(this, posEnemy5.x, posEnemy5.y);
    enemy5.setScale(this.esc(0.02));

    this.physics.add.collider(player, enemy5, () => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies5, (player, clone) => {
      if (hitCooldown) return;
      time -= 10;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.programarDashEnemy5();

    //ENEMY 6------------------------------------------------------------------------------------------------------
    enemies6 = this.physics.add.group();
    const posEnemy6 = this.pos(1060, 400);
    enemy6 = new Enemy6(this, posEnemy6.x, posEnemy6.y);
    enemy6.setScale(this.esc(0.25));

    this.physics.add.collider(player, enemy6, () => {
      if (hitCooldown) return;
      time -= 5;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies6, (player, clone) => {
      if (hitCooldown) return;
      time -= 5;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    //enemy7
    enemies7 = this.physics.add.group();
    const posEnemy7 = this.pos(1070, 400);
    enemy7 = new Enemy7(this, posEnemy7.x, posEnemy7.y);
    enemy7.setScale(this.esc(0.25));

    this.physics.add.collider(player, enemy7, () => {
      if (hitCooldown) return;
      time -= 5;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies7, (player, clone) => {
      if (hitCooldown) return;
      time -= 5;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.time.addEvent({
      delay: 500,
      callback: this.moverenemigo7Aleatorio,
      callbackScope: this,
      loop: true,
    });

    // LASER DE ENEMY7 -----------------------------------------------------------------------------------------
    this.time.addEvent({
      delay: DELAY_LASER_ENEMY7,
      callback: this.intentarDispararLaserEnemy7,
      callbackScope: this,
      loop: true,
    });

    //enemy8
    enemies8 = this.physics.add.group();
    const posEnemy8 = this.pos(1050, 190);
    enemy8 = new Enemy8(this, posEnemy8.x, posEnemy8.y);
    enemy8.setScale(this.esc(0.1));

    this.physics.add.collider(player, enemy8, () => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    //JEFE-------------------------------------------------------------------------------------------------------
    const posJefe = this.pos(1050, 300);
    jefe = new Jefe(this, posJefe.x, posJefe.y);
    jefe.setScale(this.esc(0.5));

    this.physics.add.collider(player, jefe, () => {
      if (hitCooldown) return;
      time -= 12;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.time.addEvent({
      delay: DELAY_PATRON_JEFE,
      callback: this.ejecutarPatronJefe,
      callbackScope: this,
      loop: true,
    });

    // GRUPO ENEMY ------------------------------------------------------------------------------------------------------
    enemies = this.physics.add.group();
    this.physics.add.collider(player, enemies, (player, clone) => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    // GRUPO ENEMY 2------------------------------------------------------------------------------------------------------
    enemies2 = this.physics.add.group();
    this.physics.add.collider(player, enemies2, (player, clone) => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    this.time.addEvent({
      delay: 500,
      callback: this.moverenemigoAleatorio,
      callbackScope: this,
      loop: true,
    });

    // GRUPO ENEMY 3------------------------------------------------------------------------------------------------------
    enemies3 = this.physics.add.group();
    this.physics.add.collider(player, enemies3, (player, clone) => {
      if (hitCooldown) return;
      time -= 10;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    //TIMES-------------------------------------------------------------------------------------------------
    const posTimer = this.pos(580, 10);
    timerText = this.add.text(posTimer.x, posTimer.y, "Time: " + time, {
      fontSize: Math.round(32 * this.escala) + "px",
      fill: "#8a1ee3",
      fontStyle: "bold italic",
    });
    this.time.addEvent({
      delay: 1000,
      callback: actualizarTiempo,
      callbackScope: this,
      loop: true,
    });
    function actualizarTiempo() {
      if (time > 0) {
        time -= 1;
      }
      if (time <= 0) {
        time = 0;
        timerText.setText("Time: 0");
        this.physics.pause();
        this.scene.start("GameOver");
      } else {
        timerText.setText("Time: " + time);
      }
    }

    //BALAS-------------------------------------------------------------------------------------------------
    this.balas = this.physics.add.group({
      defaultKey: "balas",
      maxSize: -1,
    });

    this.physics.add.overlap(
      this.balas,
      enemy,
      this.golpearEnemigo,
      null,
      this
    );

    this.physics.add.overlap(
      this.balas,
      enemy3,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemy4,
      this.golpearEnemigo,
      null,
      this
    );

    this.physics.add.overlap(
      this.balas,
      enemy2,
      this.golpearEnemigo,
      null,
      this
    );

    this.physics.add.overlap(
      this.balas,
      enemy5,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemy6,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemy7,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemy8,
      this.golpearEnemigo,
      null,
      this
    );

    this.physics.add.overlap(this.balas, jefe, this.golpearEnemigo, null, this);

    this.physics.add.overlap(
      this.balas,
      enemies2,
      this.golpearEnemigo,
      null,
      this
    );

    this.physics.add.overlap(
      this.balas,
      enemies3,
      this.golpearEnemigo,
      null,
      this
    );

    this.physics.add.overlap(
      this.balas,
      enemies,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemies4,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemies5,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemies6,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemies7,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemies8,
      this.golpearEnemigo,
      null,
      this
    );
    this.input.on("pointerdown", (pointer) => {
      this.disparar(pointer);
    });

    //BALAS ENEMIGO----------------------------------------------------------------------------------------------------
    this.balasEnemy = this.physics.add.group({
      defaultKey: "bala-enemigo",
    });

    this.time.addEvent({
      delay: DELAY_BALA_ENEMIGO,
      callback: () => {
        this.dispararenemy();
      },
      callbackScope: this,
      loop: true,
    });
    this.physics.add.overlap(
      this.balasEnemy,
      player,
      this.recibirDisparo,
      null,
      this
    );
    this.balasJefe = this.physics.add.group({
      defaultKey: "bala-jefe",
      maxSize: -1,
    });

    this.physics.add.overlap(
      this.balasJefe,
      player,
      this.recibirDisparo,
      null,
      this
    );
    // COLISIONES del amor y falicidad------------------------------------------------------------------------------------------
    this.physics.add.collider(enemy, enemy);
    this.physics.add.collider(enemy, enemy2);
    this.physics.add.collider(enemy, enemy3);
    this.physics.add.collider(enemy, enemy4);
    this.physics.add.collider(enemy, enemy5);
    this.physics.add.collider(enemy, enemy6);
    this.physics.add.collider(enemy, enemy7);

    this.physics.add.collider(enemy2, enemy2);
    this.physics.add.collider(enemy2, enemy3);
    this.physics.add.collider(enemy2, enemy4);
    this.physics.add.collider(enemy2, enemy5);
    this.physics.add.collider(enemy2, enemy6);
    this.physics.add.collider(enemy2, enemy7);

    this.physics.add.collider(enemy3, enemy3);
    this.physics.add.collider(enemy3, enemy4);
    this.physics.add.collider(enemy3, enemy5);
    this.physics.add.collider(enemy4, enemy5);
    this.physics.add.collider(enemy, enemies2);
    this.physics.add.collider(enemy, enemies3);
    this.physics.add.collider(enemy, enemies4);
    this.physics.add.collider(enemy, enemies5);
    this.physics.add.collider(enemy2, enemies);
    this.physics.add.collider(enemy2, enemies2);
    this.physics.add.collider(enemy2, enemies3);
    this.physics.add.collider(enemy2, enemies4);
    this.physics.add.collider(enemy2, enemies5);
    this.physics.add.collider(enemy3, enemies);
    this.physics.add.collider(enemy3, enemies2);
    this.physics.add.collider(enemy3, enemies3);
    this.physics.add.collider(enemy3, enemies4);
    this.physics.add.collider(enemy3, enemies5);
    this.physics.add.collider(enemy4, enemies);
    this.physics.add.collider(enemy4, enemies2);
    this.physics.add.collider(enemy4, enemies3);
    this.physics.add.collider(enemy4, enemies4);
    this.physics.add.collider(enemy4, enemies5);
    this.physics.add.collider(enemy5, enemies);
    this.physics.add.collider(enemy5, enemies2);
    this.physics.add.collider(enemy5, enemies3);
    this.physics.add.collider(enemy5, enemies4);
    this.physics.add.collider(enemy5, enemies5);
    this.physics.add.collider(enemy6, enemies);
    this.physics.add.collider(enemy6, enemies2);
    this.physics.add.collider(enemy6, enemies3);
    this.physics.add.collider(enemy6, enemies4);
    this.physics.add.collider(enemy6, enemies5);
    this.physics.add.collider(enemy6, enemies6);
    this.physics.add.collider(enemies, enemies);
    this.physics.add.collider(enemies, enemies2);
    this.physics.add.collider(enemies, enemies3);
    this.physics.add.collider(enemies, enemies4);
    this.physics.add.collider(enemies, enemies5);
    this.physics.add.collider(enemies2, enemies2);
    this.physics.add.collider(enemies2, enemies3);
    this.physics.add.collider(enemies2, enemies4);
    this.physics.add.collider(enemies2, enemies5);
    this.physics.add.collider(enemies3, enemies3);
    this.physics.add.collider(enemies3, enemies4);
    this.physics.add.collider(enemies3, enemies5);
    this.physics.add.collider(enemies4, enemies4);
    this.physics.add.collider(enemies4, enemies5);
    this.physics.add.collider(enemies5, enemies5);
    this.physics.add.collider(enemies, enemies);
    this.physics.add.collider(enemies2, enemies2);
    this.physics.add.collider(enemies3, enemies3);
    this.physics.add.collider(enemies4, enemies4);
    this.physics.add.collider(enemies5, enemies5);
    this.physics.add.collider(enemy6, enemy6);
    this.physics.add.collider(enemy7, enemy7);
  }

  //FIN CREATE-------------------------------------------------------------------------------------------------

  flashPlayer() {
    this.tweens.killTweensOf(player);
    player.setAlpha(1);
    this.tweens.add({
      targets: player,
      alpha: 0,
      duration: 100,
      ease: "Linear",
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        player.setAlpha(1);
      },
    });
  }

  obtenerSpawnAleatorio() {
    let x;
    let y;
    const minX = this.px(700);
    const maxX = this.px(1050);
    const minY = this.py(100);
    const maxY = this.py(500);
    const distMinPlayer = this.v(250);
    const distMinPuerta = this.v(150);
    do {
      x = Phaser.Math.Between(minX, maxX);
      y = Phaser.Math.Between(minY, maxY);
    } while (
      Phaser.Math.Distance.Between(x, y, player.x, player.y) < distMinPlayer ||
      Phaser.Math.Distance.Between(x, y, this.door.x, this.door.y) <
        distMinPuerta
    );
    return { x, y };
  }

  //CAMBIAR HABITACION-------------------------------------------------------------------------------------------------
  cambiarHabitacion() {
    const enemigosVivos =
      enemies2.countActive() +
      enemies.countActive() +
      enemies3.countActive() +
      enemies4.countActive() +
      enemies5.countActive() +
      enemies6.countActive() +
      enemies7.countActive() +
      (jefe.active ? 1 : 0) +
      (enemy.active ? 1 : 0) +
      (enemy2.active ? 1 : 0) +
      (enemy3.active ? 1 : 0) +
      (enemy5.active ? 1 : 0) +
      (enemy4.active ? 1 : 0) +
      (enemy6.active ? 1 : 0) +
      (enemy7.active ? 1 : 0) +
      (enemy8.active ? 1 : 0);
    if (enemigosVivos > 0) {
      return;
    }
    currentRoom++;

    this.cargarHabitacion();
  }
  //CARGAR HABITACION-------------------------------------------------------------------------------------------------
  cargarHabitacion() {
    enemy.disableBody(true, true);
    enemy2.disableBody(true, true);
    enemy3.disableBody(true, true);
    enemy4.disableBody(true, true);
    enemy5.disableBody(true, true);
    enemy6.disableBody(true, true);
    enemy7.disableBody(true, true);
    enemy8.disableBody(true, true);
    jefe.disableBody(true, true);
    enemies.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies2.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies3.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies4.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies5.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies6.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies7.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemies8.children.each((clone) => {
      clone.disableBody(true, true);
    });

    const posInicio = this.pos(100, 300);

    if (currentRoom === 0) {
      enemy.disableBody(true, true);
      enemy2.disableBody(true, true);
      enemy3.disableBody(true, true);
      enemy4.disableBody(true, true);
      enemy5.disableBody(true, true);
      enemy6.disableBody(true, true);
      enemy7.disableBody(true, true);
      enemy8.disableBody(true, true);
      jefe.disableBody(true, true);
      player.setPosition(posInicio.x, posInicio.y);
    }
    if (currentRoom === 1) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion.play();
      let spawn = this.obtenerSpawnAleatorio();

      enemy8.enableBody(true, spawn.x, spawn.y, true, true);
      enemy8.reiniciarVida();

      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn.x, spawn.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.1));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
    } else if (currentRoom === 2) {
      player.setPosition(posInicio.x, posInicio.y);

      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.04));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }

      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.5));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 5;
      }
    } else if (currentRoom === 3) {
      player.setPosition(posInicio.x, posInicio.y);

      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.04));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(0, 2); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.02));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 5;
      }
    } else if (currentRoom === 4) {
      player.setPosition(posInicio.x, posInicio.y);

      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.1));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.5));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
    } else if (currentRoom === 5) {
      player.setPosition(posInicio.x, posInicio.y);
      let spawn = this.obtenerSpawnAleatorio();
      let spawn2 = this.obtenerSpawnAleatorio();
      let spawn3 = this.obtenerSpawnAleatorio();
      let spawn4 = this.obtenerSpawnAleatorio();
      let spawn5 = this.obtenerSpawnAleatorio();
      enemy.enableBody(true, spawn.x, spawn.y, true, true);
      enemy.reiniciarVida();
      enemy2.enableBody(true, spawn2.x, spawn2.y, true, true);
      enemy2.reiniciarVida();
      enemy3.enableBody(true, spawn3.x, spawn3.y, true, true);
      enemy3.reiniciarVida();
      enemy4.enableBody(true, spawn4.x, spawn4.y, true, true);
      enemy4.reiniciarVida();
      enemy5.enableBody(true, spawn5.x, spawn5.y, true, true);
      enemy5.reiniciarVida();
    } else if (currentRoom === 6) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion.stop();
      const posJefeSala = this.pos(900, 100);
      this.cancionJ.play();
      jefe.enableBody(true, posJefeSala.x, posJefeSala.y, true, true);
    } else if (currentRoom === 7) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancionJ.stop();
      this.cancion2.play();
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn.x, spawn.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
    } else if (currentRoom === 8) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.04));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(0, 2); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.5));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.35));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 3;
      }
    } else if (currentRoom === 9) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn.x, spawn.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.35));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 3;
      }
    } else if (currentRoom === 10) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.04));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.1));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(0, 1); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn.x, spawn.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.35));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 3;
      }
    } else if (currentRoom === 10) {
      player.setPosition(posInicio.x, posInicio.y);

      this.cancion2.stop();
      this.cancionJ2.play();

      let spawn = this.obtenerSpawnAleatorio();
      enemy.enableBody(true, spawn.x, spawn.y, true, true);
      enemy.reiniciarVida();
    }
  }

  dispararRadialDesde(
    x,
    y,
    cantidad = CANTIDAD_BALAS_RADIAL_JEFE,
    velocidad = VELOCIDAD_BALA_RADIAL_JEFE,
    grupoBalas = this.balasEnemy
  ) {
    for (let i = 0; i < cantidad; i++) {
      const bala = grupoBalas.get(x, y);

      if (!bala) return;

      bala.enableBody(true, x, y, true, true);
      bala.setScale(this.esc(0.12));

      const angle = (Math.PI * 2 * i) / cantidad;

      bala.setRotation(angle);

      this.physics.velocityFromRotation(
        angle,
        this.v(velocidad),
        bala.body.velocity
      );
    }

    this.bala_enemigo.play();
  }

  //MOVIMIENTO RANDOM ------------------------------------------------------------------------------------------------
  moverenemigoAleatorio() {
    const velocidad = this.v(200);
    const direcciones = [
      { x: velocidad, y: 0 },
      { x: -velocidad, y: 0 },
      { x: 0, y: velocidad },
      { x: 0, y: -velocidad },
    ];
    enemy2.moverAleatorio();
    enemies2.children.each((clone) => {
      let dirClone = Phaser.Math.RND.pick(direcciones);
      clone.setVelocity(dirClone.x, dirClone.y);
    });
  }
  moverenemigo4Aleatorio() {
    const velocidad = this.v(100);
    const direcciones = [
      { x: velocidad, y: 0 },
      { x: -velocidad, y: 0 },
      { x: 0, y: velocidad },
      { x: 0, y: -velocidad },
    ];
    if (enemy4.active) {
      const dir = Phaser.Math.RND.pick(direcciones);
      enemy4.setVelocity(dir.x, dir.y);
    }
    enemies4.children.each((clone) => {
      if (!clone.active) return;
      const dirClone = Phaser.Math.RND.pick(direcciones);
      clone.setVelocity(dirClone.x, dirClone.y);
    });
  }

  moverenemigo7Aleatorio() {
    const velocidad = this.v(100);
    const direcciones = [
      { x: velocidad, y: 0 },
      { x: -velocidad, y: 0 },
      { x: 0, y: velocidad },
      { x: 0, y: -velocidad },
    ];
    if (enemy7.active) {
      const dir = Phaser.Math.RND.pick(direcciones);
      enemy7.setVelocity(dir.x, dir.y);
    }
    enemies7.children.each((clone) => {
      if (!clone.active) return;
      const dirClone = Phaser.Math.RND.pick(direcciones);
      clone.setVelocity(dirClone.x, dirClone.y);
    });
  }

  //ENEMY5 ------------------------------------------------------------------------------------------------
  programarDashEnemy5() {
    const delay = Phaser.Math.Between(DASH_MIN_ENEMY5, DASH_MAX_ENEMY5);

    this.time.delayedCall(delay, () => {
      if (enemy5.active) {
        this.dashEnemy5(enemy5);
      }

      enemies5.children.each((clone) => {
        if (!clone.active) return;

        this.dashEnemy5(clone);
      });

      this.programarDashEnemy5();
    });
  }

  dashEnemy5(enemy5Actual) {
    if (!enemy5Actual.active) return;

    const angle = Phaser.Math.Angle.Between(
      enemy5Actual.x,
      enemy5Actual.y,
      player.x,
      player.y
    );

    enemy5Actual.dasheando = true;

    this.physics.velocityFromRotation(
      angle,
      this.v(VELOCIDAD_DASH_ENEMY5),
      enemy5Actual.body.velocity
    );

    this.time.delayedCall(DURACION_DASH_ENEMY5, () => {
      if (enemy5Actual.active) {
        enemy5Actual.setVelocity(0, 0);
        enemy5Actual.dasheando = false;
      }
    });
  }

  //LASER ENEMY7 ------------------------------------------------------------------------------------------------
  intentarDispararLaserEnemy7() {
    if (enemy7.active) {
      this.dispararLaserEnemy7(enemy7);
    }
    enemies7.children.each((clone) => {
      if (clone.active) {
        this.dispararLaserEnemy7(clone);
      }
    });
  }

  dispararLaserEnemy7(origen) {
    if (!origen.active) return;

    const angulo = Phaser.Math.Angle.Between(
      origen.x,
      origen.y,
      player.x,
      player.y
    );

    const largoTotal =
      Math.sqrt(this.gameWidth ** 2 + this.gameHeight ** 2) * 2;
    const finX = origen.x + Math.cos(angulo) * largoTotal;
    const finY = origen.y + Math.sin(angulo) * largoTotal;

    const aviso = this.add.graphics();
    aviso.lineStyle(this.v(2), 0xff0000, 0.5);
    aviso.beginPath();
    aviso.moveTo(origen.x, origen.y);
    aviso.lineTo(finX, finY);
    aviso.strokePath();
    aviso.setDepth(99999);

    this.time.delayedCall(DELAY_TELEGRAPH_LASER_ENEMY7, () => {
      aviso.destroy();
      if (!origen.active) return;

      const anchoLaser = this.v(ANCHO_LASER_ENEMY7);

      const rayo = this.add.graphics();
      rayo.lineStyle(anchoLaser, 0xff2222, 0.9);
      rayo.beginPath();
      rayo.moveTo(origen.x, origen.y);
      rayo.lineTo(finX, finY);
      rayo.strokePath();
      rayo.setDepth(99999);

      this.golpearJugadorConLaser(origen.x, origen.y, finX, finY, anchoLaser);

      this.time.delayedCall(DURACION_LASER_ENEMY7, () => {
        rayo.destroy();
      });
    });
  }

  distanciaPuntoALinea(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? (A * C + B * D) / lenSq : -1;
    param = Phaser.Math.Clamp(param, 0, 1);
    const xx = x1 + param * C;
    const yy = y1 + param * D;
    return Phaser.Math.Distance.Between(px, py, xx, yy);
  }

  golpearJugadorConLaser(x1, y1, x2, y2, ancho) {
    if (hitCooldown) return;

    const distancia = this.distanciaPuntoALinea(
      player.x,
      player.y,
      x1,
      y1,
      x2,
      y2
    );

    if (distancia > ancho / 2 + this.v(15)) return;

    if (parryActivo) {
      time += 5;
      if (time > 300) time = 300;
      this.parry.play();
    } else {
      time -= DAÑO_LASER_ENEMY7;
      if (time < 0) time = 0;
      this.flashPlayer();
    }

    timerText.setText("Time: " + time);
    hitCooldown = true;
    this.time.delayedCall(500, () => {
      hitCooldown = false;
    });
  }

  //PATRONES DEL JEFE ------------------------------------------------------------------------------------------------
  ejecutarPatronJefe() {
    if (!jefe.active) return;

    if (jefePatron === 1) {
      this.dispararRadialJefe();
      jefePatron = 2;
    } else {
      this.dispararEscopetaJefe();
      jefePatron = 1;
    }
  }

  dispararRadialJefe() {
    if (!jefe.active) return;

    for (let i = 0; i < CANTIDAD_BALAS_RADIAL_JEFE; i++) {
      const balaenemy = this.balasJefe.get(jefe.x, jefe.y);
      if (!balaenemy) return;

      balaenemy.enableBody(true, jefe.x, jefe.y, true, true);
      balaenemy.setScale(this.esc(0.12));

      const angle = (Math.PI * 2 * i) / CANTIDAD_BALAS_RADIAL_JEFE;
      balaenemy.setRotation(angle);
      this.physics.velocityFromRotation(
        angle,
        this.v(VELOCIDAD_BALA_RADIAL_JEFE),
        balaenemy.body.velocity
      );
    }
    this.bala_enemigo.play();
  }

  dispararEscopetaJefe() {
    if (!jefe.active) return;

    this.dispararConEscopeta(
      jefe,
      CANTIDAD_BALAS_ESCOPETA_JEFE,
      SEPARACION_ESCOPETA_JEFE,
      VELOCIDAD_BALA_ESCOPETA_JEFE,
      this.balasJefe
    );
  }

  //DISPARAR-------------------------------------------------------------------------------------------------
  disparar(pointer) {
    if (!puedeDisparar) {
      return;
    }
    let bala = this.balas.get(gun.x, gun.y);

    if (bala) {
      puedeDisparar = false;
      bala.enableBody(true, gun.x, gun.y, true, true);
      bala.setScale(this.esc(0.1));
      let angle = Phaser.Math.Angle.Between(gun.x, gun.y, pointer.x, pointer.y);
      bala.setRotation(angle);
      this.physics.velocityFromRotation(angle, this.v(700), bala.body.velocity);
      this.bala.play();
      this.time.delayedCall(DELAY_BALA, () => {
        puedeDisparar = true;
      });
    }
  }

  golpearEnemigo(obj1, obj2) {
    const bala = this.balas.contains(obj1) ? obj1 : obj2;
    const enemigo = bala === obj1 ? obj2 : obj1;

    bala.disableBody(true, true);
    if (!enemigo.active) {
      return;
    }

    if (typeof enemigo.recibirDaño === "function") {
      enemigo.recibirDaño();
    } else {
      enemigo.vida -= 1;
      if (enemigo.vida <= 0) {
        if (enemigo.texture.key === "enemy6") {
          this.dispararRadialDesde(enemigo.x, enemigo.y);
        }
        enemigo.disableBody(true, true);
      }
    }
    if (enemigo === jefe && !jefe.active) {
      this.jefeDerrotado();
    }
  }

  jefeDerrotado() {
    if (this.jefeDerrotadoFlag) return;
    this.jefeDerrotadoFlag = true;
    const usuario = getLoggedInUser() || "Invitado";
    addScore(time, usuario).then(() => {
      this.bg.setAlpha(1);
      //  this.time.delayedCall(300, () => {
      //  this.scene.start("Leaderboard", {
      //  victory: true,
      //lastTime: time
      // });
      // });
    });
  }

  // BALAS ENEMIGO--------------------------------------------------------------------------------------------------
  dispararenemy() {
    if (enemy2.active) {
      let balaenemy = this.balasEnemy.get(enemy2.x, enemy2.y);
      if (balaenemy) {
        balaenemy.enableBody(true, enemy2.x, enemy2.y, true, true);
        balaenemy.setScale(this.esc(0.12));
        const angle = Phaser.Math.Angle.Between(
          enemy2.x,
          enemy2.y,
          player.x,
          player.y
        );
        balaenemy.setRotation(angle);
        this.physics.velocityFromRotation(
          angle,
          this.v(500),
          balaenemy.body.velocity
        );
        this.bala_enemigo.play();
      }
    }
    if (puedeDispararEnemy4) {
      puedeDispararEnemy4 = false;

      // ENEMY4-------------------------------------------------------------------------------------------------------------------------------------------
      if (enemy4.active) {
        this.dispararConEscopeta(enemy4);
      }

      enemies4.children.each((enemy4Clone) => {
        if (!enemy4Clone.active) return;

        this.dispararConEscopeta(enemy4Clone);
      });

      this.time.delayedCall(DELAY_BALA_ENEMY4, () => {
        puedeDispararEnemy4 = true;
      });
    }

    enemies2.children.each((enemy2Clone) => {
      if (!enemy2Clone.active) return;

      let balaenemy = this.balasEnemy.get(enemy2Clone.x, enemy2Clone.y);

      if (balaenemy) {
        balaenemy.enableBody(true, enemy2Clone.x, enemy2Clone.y, true, true);
        balaenemy.setScale(this.esc(0.12));

        const angle = Phaser.Math.Angle.Between(
          enemy2Clone.x,
          enemy2Clone.y,
          player.x,
          player.y
        );

        balaenemy.setRotation(angle);
        this.physics.velocityFromRotation(
          angle,
          this.v(500),
          balaenemy.body.velocity
        );
        this.bala_enemigo.play();
      }
    });
  }

  //PARRY--------------------------------------------------------------------------------------------
  recibirDisparo(jugador, bala) {
    bala.disableBody(true, true);

    if (hitCooldown) return;

    if (parryActivo) {
      time += 5;
      if (time > 300) {
        time = 300;
      }
      timerText.setText("Time: " + time);
      this.parry.play();
      hitCooldown = true;

      this.physics.pause();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
        this.physics.resume();
      });

      return;
    }
    time -= 5;
    if (time < 0) {
      time = 0;
    }

    timerText.setText("Time: " + time);
    hitCooldown = true;

    this.flashPlayer();

    this.time.delayedCall(500, () => {
      hitCooldown = false;
    });
  }
  dispararConEscopeta(
    enemyActual,
    cantidadBalas = 4,
    separacion = 0.2,
    velocidad = 250,
    grupoBalas = this.balasEnemy
  ) {
    const baseAngle = Phaser.Math.Angle.Between(
      enemyActual.x,
      enemyActual.y,
      player.x,
      player.y
    );

    for (let i = 0; i < cantidadBalas; i++) {
      const bala = grupoBalas.get(enemyActual.x, enemyActual.y);

      if (!bala) {
        return;
      }

      bala.enableBody(true, enemyActual.x, enemyActual.y, true, true);
      bala.setScale(this.esc(0.12));
      const angle = baseAngle + (i - (cantidadBalas - 1) / 2) * separacion;
      bala.setRotation(angle);
      this.physics.velocityFromRotation(
        angle,
        this.v(velocidad),
        bala.body.velocity
      );
    }
    this.bala_enemigo.play();
  }

  update() {
    //GUN------------------------------------------------------------------------------------------------------
    const angle = Phaser.Math.Angle.Between(
      player.x,
      player.y,
      this.input.activePointer.x,
      this.input.activePointer.y
    );

    const distancia = this.v(35);
    gun.x = player.x + Math.cos(angle) * distancia;
    gun.y = player.y + Math.sin(angle) * distancia;
    gun.rotation = angle;
    this.cursor.x = this.input.activePointer.x;
    this.cursor.y = this.input.activePointer.y;

    //ENEMY MOVEMENT-------------------------------------------------------------------------------------------------
    enemy.actualizar(player, this.v(233));
    enemy3.actualizar(player, this.v(100));
    enemies.children.each((enemy) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, player, this.v(233));
      }
    });
    enemies3.children.each((enemy3) => {
      if (enemy3.active) {
        this.physics.moveToObject(enemy3, player, this.v(100));
      }
    });
    enemies6.children.each((enemy6) => {
      if (enemy6.active) {
        this.physics.moveToObject(enemy6, player, this.v(300));
      }
    });
    if (enemy5.active && !enemy5.dasheando) {
      this.physics.moveToObject(enemy5, player, VELOCIDAD_ENEMY5);
    }

    enemies5.children.each((enemy5Clone) => {
      if (!enemy5Clone.active) return;
      if (!enemy5Clone.dasheando) {
        this.physics.moveToObject(
          enemy5Clone,
          player,
          this.v(VELOCIDAD_ENEMY5)
        );
      }
    });
    if (enemy6.active) {
      this.physics.moveToObject(enemy6, player, this.v(300));
    }

    if (jefe.active) {
      this.physics.moveToObject(
        jefe,
        player,
        this.v(VELOCIDAD_MOVIMIENTO_JEFE)
      );
    }
    // MOVIMIENTO DEL JUGADOR
    let velocidadX = 0;
    let velocidadY = 0;
    const velJugador = this.v(VELOCIDAD_JUGADOR);

    // HORIZONTAL--------------------------------------------------------------------------------------------------------------------------------------
    if (teclas.left.isDown) {
      velocidadX = -velJugador;
    } else if (teclas.right.isDown) {
      velocidadX = velJugador;
    }

    // VERTICAL--------------------------------------------------------------------------------------------------------------------------------------
    if (teclas.up.isDown) {
      velocidadY = -velJugador;
    } else if (teclas.down.isDown) {
      velocidadY = velJugador;
    }

    player.body.setVelocityX(velocidadX);
    player.body.setVelocityY(velocidadY);

    if (parryActivo) {
      player.setTexture("parry");
    } else if (mostrandoPuedeParry) {
      player.setTexture("puede-parry");
    } else if (velocidadY < 0 && velocidadX < 0) {
      player.setTexture("player-back-left");
    } else if (velocidadY < 0 && velocidadX > 0) {
      player.setTexture("player-back-right");
    } else if (velocidadX < 0) {
      player.setTexture("player-left");
    } else if (velocidadX > 0) {
      player.setTexture("player-right");
    } else if (velocidadY < 0) {
      player.setTexture("player-back");
    } else {
      player.setTexture("player");
    }
  }
}
