import Enemy, { actualizarSpriteEnemy } from "../entities/Enemy.js";
import Enemy2 from "../entities/Enemy2.js";
import Enemy3 from "../entities/Enemy3.js";
import Enemy4 from "../entities/Enemy4.js";
import Enemy5 from "../entities/Enemy5.js";
import Enemy6 from "../entities/Enemy6.js";
import Enemy7 from "../entities/Enemy7.js";
import Enemy8 from "../entities/Enemy8.js";
import Enemy9 from "../entities/Enemy9.js";
import Enemy10 from "../entities/Enemy10.js";
import Jefe from "../entities/Jefe.js";
import Jefe2 from "../entities/Jefe2.js";
import Jefe3 from "../entities/Jefe3.js";
import { addScore } from "../utils/leaderboard.js";
import { getLoggedInUser } from "../utils/auth.js";
import {
  crearStats,
  calcularPerdida,
  multVelocidad,
  golpesPorBala,
  recompensaKill,
  mostrarMenuMejoras,
  TIEMPO_MAX,
} from "../utils/upgrades.js";
import { mostrarMenuMejoras2 } from "../utils/upgrades2.js";

import { volMusica, volEfecto, aplicarMaster } from "../utils/audioconfig.js";

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
let enemy9;
let enemy10;
let jefe;
let jefe2;
let jefe2Clones;
let jefe3;
let enemies;
let enemies2;
let enemies3;
let enemies4;
let enemies5;
let enemies6;
let enemies7;
let enemies8;
let enemies9;
let enemies10;
let currentRoom = 0;
let time = 500;
let gun;
let hitCooldown = false;
let puedeDisparar = true;
let parryActivo = false;
let puedeParry = true;
let mostrandoPuedeParry = false;
let puedeDispararEnemy4 = true;
let enemy10Visible = true;
let jefePatron = 1;
//constantes (las cuales odio)
//tamaño pantalla
const REF_WIDTH = 1280;
const REF_HEIGHT = 720;
//delays,cooldowns y velocidades
const DELAY_BALA_ENEMIGO = 1200;
const DELAY_BALA_ENEMY4 = 3000;
const COOLDOWN_parry = 3000;
const DURACION_parry = 300;
const DELAY_BALA = 500;
const VELOCIDAD_JUGADOR = 300;
const DELAY_PATRON_JEFE = 3500;
const VELOCIDAD_MOVIMIENTO_JEFE = 60;
const CANTIDAD_BALAS_RADIAL_JEFE = 12;
const VELOCIDAD_BALA_RADIAL_JEFE = 350;
const CANTIDAD_BALAS_ESCOPETA_JEFE = 10;
const SEPARACION_ESCOPETA_JEFE = 0.15;
const VELOCIDAD_BALA_ESCOPETA_JEFE = 300;
// dash jefe1
const DASH_MIN_JEFE = 4000;
const DASH_MAX_JEFE = 6000;
const AVISO_DASH_JEFE = 500;
const DURACION_DASH_JEFE = 9000;
const VELOCIDAD_DASH_JEFE = 1800;
//mas velocidades y propiedades (gero benavides) de enemigos
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
const TP_MIN_ENEMY9 = 2000;
const TP_MAX_ENEMY9 = 4000;
const DURACION_FLASH = 60;
const ESCALA_TIMER = 3;
const COLOR_TIMER = 0x8a1ee3;
//jefe 2 (sigo sin entender porque burno uso tantas cconstantes)
const TAMAÑO_JEFE2 = 180;
const VELOCIDAD_JEFE2 = 80;
const TP_MIN_JEFE2 = 3000;
const TP_MAX_JEFE2 = 5000;
const VIDA_CLON_JEFE2 = 4;
const MAX_CLONES_JEFE2 = 6;
const DELAY_BALA_JEFE2 = 1500;
const VELOCIDAD_BALA_JEFE2 = 450;
const DASH_MIN_JEFE2 = 4000;
const DASH_MAX_JEFE2 = 6000;
const AVISO_DASH_JEFE2 = 500;
const DURACION_DASH_JEFE2 = 450;
const VELOCIDAD_DASH_JEFE2 = 900;
const CANTIDAD_BALAS_RADIAL_JEFE2 = 20;
const VELOCIDAD_BALA_RADIAL_JEFE2 = 300;
const VELOCIDAD_CLON_JEFE2 = 60;
const CANTIDAD_BALAS_RADIAL_CLON_JEFE2 = 12;
const VELOCIDAD_JEFE3 = 100;
const DELAY_PATRON_JEFE3 = 2000;
const DELAY_ESBIROS_JEFE3 = 4000;
const ESBIROS_MIN_JEFE3 = 1;
const ESBIROS_MAX_JEFE3 = 3;
const MAX_ESBIROS_JEFE3 = 8000;
const DELAY_TELEGRAPH_LASER_JEFE3 = 600;
const DURACION_LASER_JEFE3 = 200;
const ANCHO_LASER_JEFE3 = 12;
const DAÑO_LASER_JEFE3 = 10;
const SEPARACION_ABANICO_LASER_JEFE3 = 0.35;
const CANTIDAD_BALAS_RADIAL_JEFE3 = 16;
const VELOCIDAD_BALA_RADIAL_JEFE3 = 300;
const CANTIDAD_BALAS_ESCOPETA_JEFE3 = 10;
const SEPARACION_ESCOPETA_JEFE3 = 0.15;
const VELOCIDAD_BALA_ESCOPETA_JEFE3 = 320;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {}

  //preload assets
  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("background2", "assets/background2.JPG");
    this.load.image("background3", "assets/background3.JPG");
    this.load.image("player", "assets/player.png");
    this.load.image("player-left", "assets/player-left.png");
    this.load.image("player-right", "assets/player-right.png");
    this.load.image("player-back", "assets/player-back.png");
    this.load.image("player-back-right", "assets/player-back-right.png");
    this.load.image("player-back-left", "assets/player-back-left.png");
    this.load.image("puerta", "assets/puerta.jPG");
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("gun", "assets/gun.png");
    this.load.image("gun2", "assets/GUN2.png");
    this.load.image("balas", "assets/bala.png");
    this.load.image("bala-enemigo", "assets/bala-enemigo.png");
    this.load.image("GameOver", "assets/game-over.png");
    this.load.image("bala-jefe", "assets/bala-jefe.png");
    this.load.image("parry", "assets/parry.png");
    this.load.image("puede-parry", "assets/puedeparry.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("enemy-2frame", "assets/enemy-2frame.png");
    this.load.image("enemy-back", "assets/enemy-back.png");
    this.load.image("enemy-back-2frame", "assets/enemy-back-2frame.png");
    this.load.image("enemy2", "assets/ENEMY2.png");
    this.load.image("enemy2-2frame", "assets/ENEMY2-2frame.png");
    this.load.image("enemy2-back", "assets/ENEMY2-back.png");
    this.load.image("enemy2-back-2frame", "assets/ENEMY2-back-2frame.png");
    this.load.image("enemy2-left", "assets/ENEMY2-left.png");
    this.load.image("enemy2-left-2frame", "assets/ENEMY2-left-2frame.png");
    this.load.image("enemy2-right", "assets/ENEMY2-right.png");
    this.load.image("enemy2-right-2frame", "assets/ENEMY2-right-2frame.png");
    this.load.image("enemy4", "assets/ENEMY4.png");
    this.load.image("enemy4-2frame", "assets/ENEMY4-2frame.png");
    this.load.image("enemy4-back", "assets/ENEMY4-back.png");
    this.load.image("enemy4-back-2frame", "assets/ENEMY4-back-2frame.png");
    this.load.image("enemy4-left", "assets/ENEMY4-left.png");
    this.load.image("enemy4-left-2frame", "assets/ENEMY4-left-2frame.png");
    this.load.image("enemy4-right", "assets/ENEMY4-right.png");
    this.load.image("enemy4-right-2frame", "assets/ENEMY4-right-2frame.png");
    this.load.image("enemy3", "assets/enemy4.jpg");
    this.load.image("enemy5", "assets/enemy5.png");
    this.load.image("enemy6", "assets/enemy6.png");
    this.load.image("enemy7", "assets/ENEMY7-.png");
    this.load.image("enemy7-2frame", "assets/ENEMY7-2frame.png");
    this.load.image("enemy8", "assets/enemy8.png");
    this.load.image("enemy9", "assets/enemy9.png");
    this.load.image("enemy10", "assets/enemy10.png");
    this.load.image("jefe", "assets/jefe.png");
    this.load.image("jefe2", "assets/jefe2.png");
    this.load.image("jefe3", "assets/jefe3.png");
    this.load.image("muerte", "assets/descarga.jpg");
    this.load.audio("parry", "assets/parry.mp3");
    this.load.audio("verity", "assets/Verity.mp3");
    this.load.audio("phonk", "assets/Phonk.mp3");
    this.load.audio("mario", "assets/Mario.mp3");
    this.load.audio("quagmire", "assets/Quagmire.mp3");
    this.load.audio("flight", "assets/Flight.mp3");
    this.load.audio("flight2", "assets/Flight2.mp3");
    this.load.audio("bala", "assets/bala.wav");
    this.load.audio("bala_enemigo", "assets/bala_enemigo.wav");
    this.load.image("timer-frame", "assets/timer-frame.png");
    this.load.image("timer-fill", "assets/timer-fill.png");
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
  //create-------------------------------------------------------------------
  create() {
    currentRoom = 0;
    puedeDisparar = true;
    puedeParry = true;
    time = 500;
    hitCooldown = false;
    puedeDispararEnemy4 = true;
    parryActivo = false;
    mostrandoPuedeParry = false;
    enemy10Visible = true;
    jefePatron = 1;
    this.jefeDerrotadoFlag = false;
    this.jefe3DerrotadoFlag = false;
    this.patronJefe3 = 0;
    this.stats = crearStats();
    this.menuAbierto = false;
    this.dashActivo = false;
    this.pausado = false;
    this.personaje = this.registry.get("personaje") || 1;
    //ESCALADO-------------------------------------------------------------------------------------------------
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.escalaX = this.gameWidth / REF_WIDTH;
    this.escalaY = this.gameHeight / REF_HEIGHT;
    this.escala = Math.min(this.escalaX, this.escalaY);
    this.physics.world.setBounds(0, 0, this.gameWidth, this.gameHeight);
    this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);

    //cursor
    this.input.setDefaultCursor("none");
    this.cursor = this.add.image(0, 0, "cursor");
    this.cursor.setScale(this.esc(0.1));
    this.cursor.setDepth(100000000);

    //MENU DE pausa
    this.crearMenuPausa();
    this.input.keyboard.on("keydown-ESC", () => this.togglePausa());

    //sonidos (those who snow)
    aplicarMaster(this);
    this.parry = this.sound.add("parry", { volume: volEfecto(1) });
    this.cancion = this.sound.add("verity", { volume: volMusica(1) });
    this.cancion2 = this.sound.add("phonk", { volume: volMusica(1) });
    this.cancion3 = this.sound.add("flight", { volume: volMusica(1) });
    this.cancionJ2 = this.sound.add("quagmire", { volume: volMusica(1) });
    this.cancionJ3 = this.sound.add("flight2", { volume: volMusica(1) });
    this.cancionJ = this.sound.add("mario", { volume: volMusica(1.5) });
    this.bala_enemigo = this.sound.add("bala_enemigo", {
      volume: volEfecto(0.5),
    });
    this.bala = this.sound.add("bala", { volume: volEfecto(0.5) });
    //BACKGROUND-------------------------------------------------------------------------------------------------
    this.background = this.add.image(300, 300, "background");
    this.background.setPosition(this.gameWidth / 2, this.gameHeight / 2);
    this.background.setDisplaySize(this.gameWidth, this.gameHeight);
    //BACKGROUND2-------------------------------------------------------------------------------------------------
    this.background2 = this.add.image(300, 300, "background2");
    this.background2.setPosition(this.gameWidth / 2, this.gameHeight / 2);
    this.background2.setDisplaySize(this.gameWidth, this.gameHeight);
    this.background2.setAlpha(0);
    //BACKGROUND3-------------------------------------------------------------------------------------------------
    this.background3 = this.add.image(300, 300, "background3");
    this.background3.setPosition(this.gameWidth / 2, this.gameHeight / 2);
    this.background3.setDisplaySize(this.gameWidth, this.gameHeight);
    this.background3.setAlpha(0);
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

    // PARRY jugador
    this.input.keyboard.on("keydown-Q", () => {
      if (!puedeParry || this.menuAbierto || this.pausado) {
        return;
      }
      puedeParry = false;
      parryActivo = true;
      if (this.stats.parryDash) this.iniciarDash();
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

    //player reset
    this.teclaR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.cameras.main.setAlpha(1);

    //cosa para probar mejoras (BORRAR PARA EL FINAL DEL PROYECTO!!!!!!!!!!!!!!)
    this.input.keyboard.on("keydown-U", () => {
      if (!this.menuAbierto && !this.pausado) mostrarMenuMejoras(this, this.stats);
    });
    this.input.keyboard.on("keydown-Y", () => {
      if (!this.menuAbierto && !this.pausado) mostrarMenuMejoras2(this, this.stats);
    });
    //PUERTINI GUZINI-------------------------------------------------------------------------------------------------
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
    gun.setScale(this.esc(0.17));
    gun.setOrigin(0.2, 0.45);
    gun.setDepth(player.depth + 1);

    //ENEMY 1-------------------------------------------------------------------------------------------------
    const posEnemy = this.pos(1050, 190);
    enemy = new Enemy(this, posEnemy.x, posEnemy.y);
    enemy.setScale(this.esc(0.35));

    this.physics.add.collider(player, enemy, () => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    //ENEMY 2-------------------------------------------------------------------------------------------------------
    const posEnemy2 = this.pos(1050, 400);
    enemy2 = new Enemy2(this, posEnemy2.x, posEnemy2.y);
    enemy2.setScale(this.esc(0.1));

    this.physics.add.collider(player, enemy2, () => {
      if (hitCooldown) return;
      this.perderTiempo(3);
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
      this.perderTiempo(10);
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
    enemy4.setScale(this.esc(0.4));
    this.physics.add.collider(player, enemy4, () => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies4, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(3);
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
      this.perderTiempo(3);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies5, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(3);
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
      this.perderTiempo(5);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies6, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(5);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    //enemy7---------------------------------------------------------------------------------
    enemies7 = this.physics.add.group();
    const posEnemy7 = this.pos(1070, 400);
    enemy7 = new Enemy7(this, posEnemy7.x, posEnemy7.y);
    enemy7.setScale(this.esc(0.25));

    this.physics.add.collider(player, enemy7, () => {
      if (hitCooldown) return;
      this.perderTiempo(5);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies7, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(5);
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

    // Laser enemy7
    this.time.addEvent({
      delay: DELAY_LASER_ENEMY7,
      callback: this.intentarDispararLaserEnemy7,
      callbackScope: this,
      loop: true,
    });

    //enemy8----------------------------------------------------------------------------------------------------------
    enemies8 = this.physics.add.group();
    const posEnemy8 = this.pos(1050, 190);
    enemy8 = new Enemy8(this, posEnemy8.x, posEnemy8.y);
    enemy8.setScale(this.esc(0.1));

    this.physics.add.collider(player, enemy8, () => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies8, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    //Enemy 9---------------------------------------------------------------------------------------------------------------------------------------------
    enemies9 = this.physics.add.group();
    const posEnemy9 = this.pos(1060, 600);
    enemy9 = new Enemy9(this, posEnemy9.x, posEnemy9.y);
    enemy9.setScale(this.esc(0.5));

    this.physics.add.collider(player, enemy9, () => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies9, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    this.programarTpEnemy9();

    //Enemy10-------------------------------------------------------------------------------------------------------------
    enemies10 = this.physics.add.group();
    const posEnemy10 = this.pos(1060, 600);
    enemy10 = new Enemy10(this, posEnemy10.x, posEnemy10.y);
    enemy10.setScale(this.esc(0.5));

    this.physics.add.collider(player, enemy10, () => {
      if (hitCooldown) return;
      this.perderTiempo(5);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, enemies10, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(5);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    this.programarParpadeoEnemy10();

    //JEFE-------------------------------------------------------------------------------------------------------
    const posJefe = this.pos(1050, 300);
    jefe = new Jefe(this, posJefe.x, posJefe.y);
    jefe.setScale(this.esc(0.5));

    this.physics.add.collider(player, jefe, () => {
      if (hitCooldown) return;
      this.perderTiempo(12);
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
    this.programarDashJefe();

    //JEFE 2-------------------------------------------------------------------------------------------------------
    const posJefe2 = this.pos(900, 300);
    jefe2 = new Jefe2(this, posJefe2.x, posJefe2.y);
    jefe2.setDisplaySize(this.v(TAMAÑO_JEFE2), this.v(TAMAÑO_JEFE2));
    jefe2.disableBody(true, true);
    jefe2Clones = this.physics.add.group({ immovable: true });

    this.physics.add.collider(player, jefe2, () => {
      if (hitCooldown) return;
      this.perderTiempo(12);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.physics.add.collider(player, jefe2Clones, () => {
      if (hitCooldown) return;
      this.perderTiempo(6);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    this.time.addEvent({
      delay: DELAY_BALA_JEFE2,
      callback: this.dispararJefe2,
      callbackScope: this,
      loop: true,
    });
    this.programarTpJefe2();
    this.programarDashJefe2();

    //JEFE 3-------------------------------------------------------------------------------------------------------
    const posJefe3 = this.pos(900, 300);
    jefe3 = new Jefe3(this, posJefe3.x, posJefe3.y);
    jefe3.setScale(this.esc(0.5));
    this.barraJefe3 = this.add.graphics().setDepth(99998);

    this.physics.add.collider(player, jefe3, () => {
      if (hitCooldown) return;
      this.perderTiempo(12);
      hitCooldown = true;
      this.flashPlayer();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    // ataques jefe3
    this.time.addEvent({
      delay: DELAY_PATRON_JEFE3,
      callback: this.ejecutarPatronJefe3,
      callbackScope: this,
      loop: true,
    });
    this.time.addEvent({
      delay: DELAY_ESBIROS_JEFE3,
      callback: this.spawnearEsbirrosJefe3,
      callbackScope: this,
      loop: true,
    });

    // GRUPO ENEMY ------------------------------------------------------------------------------------------------------
    enemies = this.physics.add.group();
    this.physics.add.collider(player, enemies, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(3);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    // GRUPO ENEMY 2------------------------------------------------------------------------------------------------------
    enemies2 = this.physics.add.group();
    this.physics.add.collider(player, enemies2, (player, clone) => {
      if (hitCooldown) return;
      this.perderTiempo(3);
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
      this.perderTiempo(10);
      hitCooldown = true;
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    //TIMERs-------------------------------------------------------------------------------------------------
    const posTimer = this.pos(635, 8);
    this.textures
      .get("timer-fill")
      .setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures
      .get("timer-frame")
      .setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.timerRelleno = this.add
      .image(posTimer.x, posTimer.y, "timer-fill")
      .setOrigin(0.5, 0)
      .setScale(this.esc(ESCALA_TIMER))
      .setDepth(99997);
    this.timerMarco = this.add
      .image(posTimer.x, posTimer.y, "timer-frame")
      .setOrigin(0.5, 0)
      .setScale(this.esc(ESCALA_TIMER))
      .setDepth(99998);

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
        this.physics.pause();
        this.scene.start("GameOver");
      }
    }
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
        this.physics.pause();
        this.scene.start("GameOver");
      } else {
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
    this.physics.add.overlap(
      this.balas,
      enemy9,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemy10,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(this.balas, jefe, this.golpearEnemigo, null, this);
    this.physics.add.overlap(
      this.balas,
      jefe2,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      jefe3,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      jefe2Clones,
      this.golpearEnemigo,
      null,
      this
    );
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
    this.physics.add.overlap(
      this.balas,
      enemies9,
      this.golpearEnemigo,
      null,
      this
    );
    this.physics.add.overlap(
      this.balas,
      enemies10,
      this.golpearEnemigo,
      null,
      this
    );
    this.input.on("pointerdown", (pointer) => {
      if (this.pausado) return;
      this.disparar(pointer);
      if (hitCooldown) return;
      hitCooldown = true;
      this.time.delayedCall(DELAY_BALA, () => (hitCooldown = false));

      return;
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
    this.physics.add.collider(enemies9, enemies9);
    this.physics.add.collider(enemy6, enemy6);
    this.physics.add.collider(enemy7, enemy7);
    this.physics.add.collider(enemy9, enemy9);
    this.physics.add.collider(enemy10, enemy10);
    this.physics.add.collider(enemy9, player);
    this.physics.add.collider(enemies9, player);
  }

  //FIN CREATE-------------------------------------------------------------------------------------------------

  //PAUSA-------------------------------------------------------------------------------------------------
  togglePausa() {
    if (this.menuAbierto) return; 
    if (this.pausado) {
      this.reanudarJuego();
    } else {
      this.pausado = true;
      this.physics.pause();
      this.time.paused = true;
      this.tweens.pauseAll();
      this.sound.pauseAll();
      this.menuPausa.setVisible(true);
    }
  }

  reanudarJuego() {
    this.pausado = false;
    this.physics.resume();
    this.time.paused = false;
    this.tweens.resumeAll();
    this.sound.resumeAll();
    this.menuPausa.setVisible(false);
  }

  crearMenuPausa() {
    const cx = this.gameWidth / 2;
    const cy = this.gameHeight / 2;

    const fondo = this.add
      .rectangle(cx, cy, this.gameWidth, this.gameHeight, 0x000000, 0.65)
      .setInteractive(); 

    const titulo = this.add
      .text(cx, cy - this.py(170), "PAUSA", {
        fontSize: `${Math.round(this.v(64))}px`,
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const crearBoton = (y, texto, accion) => {
      const btn = this.add
        .text(cx, y, texto, {
          fontSize: `${Math.round(this.v(28))}px`,
          color: "#000000",
          backgroundColor: "#ff3636",
          padding: {
            left: this.v(30),
            right: this.v(30),
            top: this.v(15),
            bottom: this.v(15),
          },
        })
        .setOrigin(0.5)
        .setInteractive();

      btn.on("pointerover", () => btn.setStyle({ backgroundColor: "#f7ebeb" }));
      btn.on("pointerout", () => btn.setStyle({ backgroundColor: "#ff3636" }));
      btn.on("pointerdown", accion);
      return btn;
    };

    const btnContinuar = crearBoton(cy - this.py(60), "CONTINUAR", () =>
      this.reanudarJuego()
    );

    const btnReiniciar = crearBoton(cy + this.py(30), "REINICIAR", () => {
      this.reanudarJuego(); 
      this.sound.stopAll();
      this.scene.start("GameScene");
    });

    const btnMenu = crearBoton(cy + this.py(120), "MENU PRINCIPAL", () => {
      this.reanudarJuego();
      this.sound.stopAll();
      this.scene.start("MainMenu");
    });

    this.menuPausa = this.add
      .container(0, 0, [fondo, titulo, btnContinuar, btnReiniciar, btnMenu])
      .setDepth(99999999) 
      .setVisible(false);
  }

  moverDiagonalHacia(obj, objetivo, velocidad) {
    const dx = objetivo.x - obj.x;
    const dy = objetivo.y - obj.y;
    const margen = this.v(5);
    const comp = velocidad / Math.SQRT2;
    const vx = Math.abs(dx) < margen ? 0 : Math.sign(dx) * comp;
    const vy = Math.abs(dy) < margen ? 0 : Math.sign(dy) * comp;
    obj.setVelocity(vx, vy);
  }

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

  // hitmarker
  flashEnemigo(obj) {
    if (!obj || !obj.active) return;
    obj.setTintFill(0xffffff);
    this.time.delayedCall(DURACION_FLASH, () => {
      if (obj.scene) obj.clearTint();
    });
  }

  //spawn aleatorio
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
      enemies8.countActive() +
      enemies9.countActive() +
      enemies10.countActive() +
      jefe2Clones.countActive() +
      (jefe.active ? 1 : 0) +
      (jefe2.active ? 1 : 0) +
      (jefe3.active ? 1 : 0) +
      (enemy.active ? 1 : 0) +
      (enemy2.active ? 1 : 0) +
      (enemy3.active ? 1 : 0) +
      (enemy5.active ? 1 : 0) +
      (enemy4.active ? 1 : 0) +
      (enemy6.active ? 1 : 0) +
      (enemy7.active ? 1 : 0) +
      (enemy8.active ? 1 : 0) +
      (enemy9.active ? 1 : 0) +
      (enemy10.active ? 1 : 0);
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
    enemy9.disableBody(true, true);
    enemy10.disableBody(true, true);
    jefe.disableBody(true, true);
    jefe2.disableBody(true, true);
    jefe3.disableBody(true, true);
    jefe2Clones.clear(true, true);
    enemies.clear(true, true);
    enemies2.clear(true, true);
    enemies3.clear(true, true);
    enemies4.clear(true, true);
    enemies5.clear(true, true);
    enemies6.clear(true, true);
    enemies7.clear(true, true);
    enemies8.clear(true, true);
    enemies9.clear(true, true);
    enemies10.clear(true, true);

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
      enemy9.disableBody(true, true);
      enemy10.disableBody(true, true);
      jefe.disableBody(true, true);
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion.stop();
      this.cancion2.stop();
      this.cancion3.stop();
      this.cancionJ.stop();
      this.cancionJ2.stop();
      this.cancionJ3.stop();
      time.stop();
    } else if (currentRoom === 1) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion.play();

      for (let i = 0; i < Phaser.Math.Between(2, 3); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
    } else if (currentRoom === 2) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(0, 1); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
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
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
    } else if (currentRoom === 4) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(0, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
    } else if (currentRoom === 5) {
      player.setPosition(posInicio.x, posInicio.y);
      mostrarMenuMejoras2(this, this.stats);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
    } else if (currentRoom === 6) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
    } else if (currentRoom === 7) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
    } else if (currentRoom === 8) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
    } else if (currentRoom === 9) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
    } else if (currentRoom === 10) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion.stop();
      const posJefeSala = this.pos(900, 100);
      this.cancionJ.play();
      jefe.ocupado = false;
      jefe.enableBody(true, posJefeSala.x, posJefeSala.y, true, true);
    } else if (currentRoom === 11) {
      player.setPosition(posInicio.x, posInicio.y);
      this.background.setAlpha(0);
      this.background2.setAlpha(1);
      this.cancionJ.stop();
      this.cancion2.play();
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(2, 3); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 12) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(2, 3); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 13) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 14) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
    } else if (currentRoom === 15) {
      player.setPosition(posInicio.x, posInicio.y);
      mostrarMenuMejoras2(this, this.stats);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 16) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 17) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 18) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(0, 1); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
    } else if (currentRoom === 19) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
    } else if (currentRoom === 20) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancionJ2.play();
      this.cancion2.stop();
      this.background2.setAlpha(0);
      this.background3.setAlpha(1);
      const posJefe2Sala = this.pos(900, 300);
      jefe2.reiniciarVida();
      jefe2.enableBody(true, posJefe2Sala.x, posJefe2Sala.y, true, true);
    } else if (currentRoom === 21) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion3.play();
      this.cancionJ2.stop();
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn9 = this.obtenerSpawnAleatorio();
        let enemy9Clone = enemies9.create(spawn9.x, spawn9.y, "enemy9");
        enemy9Clone.setScale(this.esc(0.5));
        enemy9Clone.setCollideWorldBounds(true);
        enemy9Clone.vida = 2;
      }
    } else if (currentRoom === 22) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn1 = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn1.x, spawn1.y, "enemy");
        enemyClone.setScale(this.esc(0.35));
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn10 = this.obtenerSpawnAleatorio();
        let enemy10Clone = enemies10.create(spawn10.x, spawn10.y, "enemy10");
        enemy10Clone.setScale(this.esc(0.2));
        enemy10Clone.setCollideWorldBounds(true);
        enemy10Clone.vida = 4;
      }
    } else if (currentRoom === 23) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn9 = this.obtenerSpawnAleatorio();
        let enemy9Clone = enemies9.create(spawn9.x, spawn9.y, "enemy9");
        enemy9Clone.setScale(this.esc(0.5));
        enemy9Clone.setCollideWorldBounds(true);
        enemy9Clone.vida = 2;
      }
    } else if (currentRoom === 24) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn9 = this.obtenerSpawnAleatorio();
        let enemy9Clone = enemies9.create(spawn9.x, spawn9.y, "enemy9");
        enemy9Clone.setScale(this.esc(0.5));
        enemy9Clone.setCollideWorldBounds(true);
        enemy9Clone.vida = 2;
      }
    } else if (currentRoom === 25) {
      player.setPosition(posInicio.x, posInicio.y);
      mostrarMenuMejoras2(this, this.stats);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn5 = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn5.x, spawn5.y, "enemy5");
        enemy5Clone.setScale(this.esc(0.3));
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = 3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn10 = this.obtenerSpawnAleatorio();
        let enemy10Clone = enemies10.create(spawn10.x, spawn10.y, "enemy10");
        enemy10Clone.setScale(this.esc(0.2));
        enemy10Clone.setCollideWorldBounds(true);
        enemy10Clone.vida = 4;
      }
    } else if (currentRoom === 26) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn3 = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn3.x, spawn3.y, "enemy3");
        enemy3Clone.setScale(this.esc(0.3));
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = 6;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn9 = this.obtenerSpawnAleatorio();
        let enemy9Clone = enemies9.create(spawn9.x, spawn9.y, "enemy9");
        enemy9Clone.setScale(this.esc(0.5));
        enemy9Clone.setCollideWorldBounds(true);
        enemy9Clone.vida = 2;
      }
    } else if (currentRoom === 27) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn2 = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn2.x, spawn2.y, "enemy2");
        enemy2Clone.setScale(this.esc(0.4));
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn10 = this.obtenerSpawnAleatorio();
        let enemy10Clone = enemies10.create(spawn10.x, spawn10.y, "enemy10");
        enemy10Clone.setScale(this.esc(0.2));
        enemy10Clone.setCollideWorldBounds(true);
        enemy10Clone.vida = 4;
      }
    } else if (currentRoom === 28) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(this.esc(0.4));
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn9 = this.obtenerSpawnAleatorio();
        let enemy9Clone = enemies9.create(spawn9.x, spawn9.y, "enemy9");
        enemy9Clone.setScale(this.esc(0.5));
        enemy9Clone.setCollideWorldBounds(true);
        enemy9Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn10 = this.obtenerSpawnAleatorio();
        let enemy10Clone = enemies10.create(spawn10.x, spawn10.y, "enemy10");
        enemy10Clone.setScale(this.esc(0.2));
        enemy10Clone.setCollideWorldBounds(true);
        enemy10Clone.vida = 4;
      }
    } else if (currentRoom === 29) {
      player.setPosition(posInicio.x, posInicio.y);
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn6 = this.obtenerSpawnAleatorio();
        let enemy6Clone = enemies6.create(spawn6.x, spawn6.y, "enemy6");
        enemy6Clone.setScale(this.esc(0.25));
        enemy6Clone.setCollideWorldBounds(true);
        enemy6Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn7 = this.obtenerSpawnAleatorio();
        let enemy7Clone = enemies7.create(spawn7.x, spawn7.y, "enemy7");
        enemy7Clone.setScale(this.esc(0.5));
        enemy7Clone.setCollideWorldBounds(true);
        enemy7Clone.vida = 4;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn8 = this.obtenerSpawnAleatorio();
        let enemy8Clone = enemies8.create(spawn8.x, spawn8.y, "enemy8");
        enemy8Clone.setScale(this.esc(0.1));
        enemy8Clone.setCollideWorldBounds(true);
        enemy8Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn9 = this.obtenerSpawnAleatorio();
        let enemy9Clone = enemies9.create(spawn9.x, spawn9.y, "enemy9");
        enemy9Clone.setScale(this.esc(0.5));
        enemy9Clone.setCollideWorldBounds(true);
        enemy9Clone.vida = 2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn10 = this.obtenerSpawnAleatorio();
        let enemy10Clone = enemies10.create(spawn10.x, spawn10.y, "enemy10");
        enemy10Clone.setScale(this.esc(0.2));
        enemy10Clone.setCollideWorldBounds(true);
        enemy10Clone.vida = 4;
      }
    } else if (currentRoom === 30) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancion3.stop();
      this.cancionJ3.play();
      const posJefe3Sala = this.pos(900, 300);
      jefe3.reiniciarVida();
      this.patronJefe3 = 0;
      jefe3.enableBody(true, posJefe3Sala.x, posJefe3Sala.y, true, true);
    } else if (currentRoom === 31) {
      player.setPosition(posInicio.x, posInicio.y);
      this.cancionJ3.stop();
      this.scene.start("Gamewin");
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
      { x: velocidad, y: 0, dir: "-right" },
      { x: -velocidad, y: 0, dir: "-left" },
      { x: 0, y: velocidad, dir: "" },
      { x: 0, y: -velocidad, dir: "-back" },
    ];
    enemy2.moverAleatorio();
    enemies2.children.each((clone) => {
      const d = Phaser.Math.RND.pick(direcciones);
      clone.setVelocity(d.x, d.y);
      clone.dir = d.dir;
    });
  }
  moverenemigo4Aleatorio() {
    const velocidad = this.v(100);
    const direcciones = [
      { x: velocidad, y: 0, dir: "-right" },
      { x: -velocidad, y: 0, dir: "-left" },
      { x: 0, y: velocidad, dir: "" },
      { x: 0, y: -velocidad, dir: "-back" },
    ];
    if (enemy4.active) {
      const d = Phaser.Math.RND.pick(direcciones);
      enemy4.setVelocity(d.x, d.y);
      enemy4.dir = d.dir;
    }
    enemies4.children.each((clone) => {
      if (!clone.active) return;
      const d = Phaser.Math.RND.pick(direcciones);
      clone.setVelocity(d.x, d.y);
      clone.dir = d.dir;
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

  //ENEMY5 dash ------------------------------------------------------------------------------------------------
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

  //no fakin idea de que es esto
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

  golpearJugadorConLaser(x1, y1, x2, y2, ancho, daño = DAÑO_LASER_ENEMY7) {
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
      this.ganarTiempo(2 + this.stats.bonusParry);
      this.parry.play();
    } else {
      this.perderTiempo(daño);
      this.flashPlayer();
    }

    hitCooldown = true;
    this.time.delayedCall(500, () => {
      hitCooldown = false;
    });
  }
  //tp enemy 9
  avisarYTeletransportarEnemy9(obj) {
    if (!obj.active) return;
    this.tweens.add({
      targets: obj,
      alpha: 0.2,
      duration: 150,
      yoyo: true,
      repeat: 2,
    });
    this.time.delayedCall(350, () => {
      obj.setAlpha(1);
      this.teletransportarEnemy9(obj);
    });
  }
  programarTpEnemy9() {
    const delay = Phaser.Math.Between(TP_MIN_ENEMY9, TP_MAX_ENEMY9);
    this.time.delayedCall(delay, () => {
      if (enemy9.active) {
        this.teletransportarEnemy9(enemy9);
      }
      enemies9.children.each((clone) => {
        if (clone.active) {
          this.teletransportarEnemy9(clone);
        }
      });
      this.programarTpEnemy9();
    });
  }
  teletransportarEnemy9(obj) {
    if (!obj.active) return;
    const x = Phaser.Math.Between(this.v(40), this.gameWidth - this.v(40));
    const y = Phaser.Math.Between(this.v(40), this.gameHeight - this.v(40));
    obj.body.reset(x, y);
  }
  programarParpadeoEnemy10() {
    const duracion = enemy10Visible ? 1000 : Phaser.Math.Between(3000, 4000);

    this.time.delayedCall(duracion, () => {
      enemy10Visible = !enemy10Visible;
      this.programarParpadeoEnemy10();
    });
  }

  //JEFE 2 ------------------------------------------------------------------------------------------------
  posicionAleatoriaLejosDelJugador() {
    let x;
    let y;
    const distMin = this.v(250);
    do {
      x = Phaser.Math.Between(this.v(100), this.gameWidth - this.v(100));
      y = Phaser.Math.Between(this.v(100), this.gameHeight - this.v(100));
    } while (Phaser.Math.Distance.Between(x, y, player.x, player.y) < distMin);
    return { x, y };
  }

  // tp jefe2
  programarTpJefe2() {
    const delay = Phaser.Math.Between(TP_MIN_JEFE2, TP_MAX_JEFE2);
    this.time.delayedCall(delay, () => {
      if (jefe2.active && !jefe2.ocupado) {
        this.teletransportarJefe2();
      }
      this.programarTpJefe2();
    });
  }

  teletransportarJefe2() {
    if (!jefe2.active) return;
    jefe2.ocupado = true;
    jefe2.setVelocity(0, 0);

    this.tweens.add({
      targets: jefe2,
      alpha: 0.2,
      duration: 100,
      yoyo: true,
      repeat: 1,
    });

    this.time.delayedCall(400, () => {
      if (!jefe2.active) return;
      jefe2.setAlpha(1);

      this.crearClonJefe2(jefe2.x, jefe2.y);
      const p = this.posicionAleatoriaLejosDelJugador();
      jefe2.body.reset(p.x, p.y);
      jefe2.ocupado = false;
    });
  }
  // clon jefe2
  crearClonJefe2(x, y) {
    if (jefe2Clones.countActive() >= MAX_CLONES_JEFE2) return;
    const clon = jefe2Clones.create(x, y, "jefe2");
    clon.setDisplaySize(jefe2.displayWidth, jefe2.displayHeight);
    clon.setImmovable(true);
    clon.setCollideWorldBounds(true);
    clon.setAlpha(0.85);
    clon.vida = VIDA_CLON_JEFE2;
  }

  // disparo boss2
  dispararJefe2() {
    let disparo = false;

    const tirar = (origen) => {
      if (!origen.active) return;
      const bala = this.balasEnemy.get(origen.x, origen.y);
      if (!bala) return;

      bala.enableBody(true, origen.x, origen.y, true, true);
      bala.setScale(this.esc(0.12));
      const angle = Phaser.Math.Angle.Between(
        origen.x,
        origen.y,
        player.x,
        player.y
      );
      bala.setRotation(angle);
      this.physics.velocityFromRotation(
        angle,
        this.v(VELOCIDAD_BALA_JEFE2),
        bala.body.velocity
      );
      disparo = true;
    };

    tirar(jefe2);
    jefe2Clones.children.each((clon) => tirar(clon));

    if (disparo) this.bala_enemigo.play();
  }

  // dash jefe 2-------------------------------------------------------------
  programarDashJefe2() {
    const delay = Phaser.Math.Between(DASH_MIN_JEFE2, DASH_MAX_JEFE2);
    this.time.delayedCall(delay, () => {
      if (jefe2.active && !jefe2.ocupado) {
        this.dashJefe2();
      }
      this.programarDashJefe2();
    });
  }

  dashJefe2() {
    if (!jefe2.active) return;
    jefe2.ocupado = true;
    jefe2.setVelocity(0, 0);

    this.time.delayedCall(AVISO_DASH_JEFE2, () => {
      if (!jefe2.active) return;
      jefe2.clearTint();

      const angle = Phaser.Math.Angle.Between(
        jefe2.x,
        jefe2.y,
        player.x,
        player.y
      );
      this.physics.velocityFromRotation(
        angle,
        this.v(VELOCIDAD_DASH_JEFE2),
        jefe2.body.velocity
      );

      this.time.delayedCall(DURACION_DASH_JEFE2, () => {
        if (!jefe2.active) return;
        jefe2.setVelocity(0, 0);
        jefe2.ocupado = false;
      });
    });
  }

  // DASH DEL JEFE 1 (tendrian que estar arriba pero cada uno con lo suyo)------------------------------------------------------
  programarDashJefe() {
    const delay = Phaser.Math.Between(DASH_MIN_JEFE, DASH_MAX_JEFE);
    this.time.delayedCall(delay, () => {
      if (jefe.active && !jefe.ocupado) {
        this.dashJefe();
      }
      this.programarDashJefe();
    });
  }

  dashJefe() {
    if (!jefe.active || jefe.dasheando) return;
    jefe.dasheando = false;
    jefe.setTint(0xff2222);
    this.time.delayedCall(AVISO_DASH_JEFE, () => {
      if (!jefe.active) {
        jefe.dasheando = false;
        return;
      }
      jefe.dasheando = true;
      jefe.clearTint();
      const objetivoX = player.x;
      const objetivoY = player.y;

      const angle = Phaser.Math.Angle.Between(
        jefe.x,
        jefe.y,
        objetivoX,
        objetivoY
      );
      this.physics.velocityFromRotation(
        angle,
        this.v(VELOCIDAD_DASH_JEFE),
        jefe.body.velocity
      );
      this.time.delayedCall(DURACION_DASH_JEFE, () => {
        if (!jefe.active) {
          jefe.dasheando = false;
          return;
        }
        jefe.setVelocity(0, 0);
        jefe.dasheando = false;
      });
    });
  }

  // jefe 2 muerto
  jefe2Derrotado() {
    if (this.jefeDerrotadoFlag) return;
    this.jefeDerrotadoFlag = true;

    this.dispararRadialDesde(
      jefe2.x,
      jefe2.y,
      CANTIDAD_BALAS_RADIAL_JEFE2,
      VELOCIDAD_BALA_RADIAL_JEFE2
    );

    jefe2Clones.children.each((clon) => {
      clon.disableBody(true, true);
    });

    const usuario = getLoggedInUser() || "Invitado";
    addScore(time, usuario).then(() => {
      this.background.setAlpha(1);
    });
  }

  //JEFE 3 ------------------------------------------------------------------------------------------------

  dispararLaserAngulo(origen, angulo) {
    if (!origen.active) return;
    const ox = origen.x;
    const oy = origen.y;
    const largoTotal =
      Math.sqrt(this.gameWidth ** 2 + this.gameHeight ** 2) * 2;
    const finX = ox + Math.cos(angulo) * largoTotal;
    const finY = oy + Math.sin(angulo) * largoTotal;

    const aviso = this.add.graphics();
    aviso.lineStyle(this.v(2), 0xff0000, 0.5);
    aviso.beginPath();
    aviso.moveTo(ox, oy);
    aviso.lineTo(finX, finY);
    aviso.strokePath();
    aviso.setDepth(99999);

    this.time.delayedCall(DELAY_TELEGRAPH_LASER_JEFE3, () => {
      aviso.destroy();
      if (!origen.active) return;
      const anchoLaser = this.v(ANCHO_LASER_JEFE3);
      const rayo = this.add.graphics();
      rayo.lineStyle(anchoLaser, 0xff2222, 0.9);
      rayo.beginPath();
      rayo.moveTo(ox, oy);
      rayo.lineTo(finX, finY);
      rayo.strokePath();
      rayo.setDepth(99999);
      this.golpearJugadorConLaser(
        ox,
        oy,
        finX,
        finY,
        anchoLaser,
        DAÑO_LASER_JEFE3
      );
      this.time.delayedCall(DURACION_LASER_JEFE3, () => {
        rayo.destroy();
      });
    });
  }

  dispararLaserJefe3() {
    if (!jefe3.active) return;
    const base = Phaser.Math.Angle.Between(
      jefe3.x,
      jefe3.y,
      player.x,
      player.y
    );
    [-SEPARACION_ABANICO_LASER_JEFE3, 0, SEPARACION_ABANICO_LASER_JEFE3].forEach(
      (offset) => this.dispararLaserAngulo(jefe3, base + offset)
    );
  }

  ejecutarPatronJefe3() {
    if (!jefe3.active) return;
    const patrones = ["laser", "radial", "laser", "escopeta"];
    const patron = patrones[this.patronJefe3 % patrones.length];
    this.patronJefe3++;

    if (patron === "laser") {
      this.dispararLaserJefe3();
    } else if (patron === "radial") {
      this.dispararRadialDesde(
        jefe3.x,
        jefe3.y,
        CANTIDAD_BALAS_RADIAL_JEFE3,
        VELOCIDAD_BALA_RADIAL_JEFE3,
        this.balasJefe
      );
    } else {
      this.dispararConEscopeta(
        jefe3,
        CANTIDAD_BALAS_ESCOPETA_JEFE3,
        SEPARACION_ESCOPETA_JEFE3,
        VELOCIDAD_BALA_ESCOPETA_JEFE3,
        this.balasJefe
      );
    }
  }

  spawnearEsbirrosJefe3() {
    if (!jefe3.active) return;

    const grupos = [
      enemies,
      enemies2,
      enemies3,
      enemies4,
      enemies5,
      enemies6,
      enemies7,
      enemies8,
      enemies9,
      enemies10,
    ];
    const vivos = grupos.reduce((suma, g) => suma + g.countActive(), 0);
    if (vivos >= MAX_ESBIROS_JEFE3) return;

    const tipos = [
      { grupo: enemies, tex: "enemy", esc: 0.35, vida: 3 },
      { grupo: enemies2, tex: "enemy2", esc: 0.4, vida: 4 },
      { grupo: enemies3, tex: "enemy3", esc: 0.3, vida: 6 },
      { grupo: enemies4, tex: "enemy4", esc: 0.4, vida: 4 },
      { grupo: enemies5, tex: "enemy5", esc: 0.02, vida: 3 },
      { grupo: enemies6, tex: "enemy6", esc: 0.25, vida: 2 },
      { grupo: enemies7, tex: "enemy7", esc: 0.5, vida: 4 },
      { grupo: enemies8, tex: "enemy8", esc: 0.1, vida: 2 },
      { grupo: enemies9, tex: "enemy9", esc: 0.5, vida: 2 },
      { grupo: enemies10, tex: "enemy10", esc: 0.2, vida: 4 },
    ];

    const cantidad = Phaser.Math.Between(ESBIROS_MIN_JEFE3, ESBIROS_MAX_JEFE3);
    for (let i = 0; i < cantidad; i++) {
      const tipo = Phaser.Math.RND.pick(tipos);
      const spawn = this.obtenerSpawnAleatorio();

      // aviso spawn
      const aviso = this.add.circle(
        spawn.x,
        spawn.y,
        this.v(30),
        0xff0000,
        0.5
      );
      aviso.setDepth(99990);
      this.tweens.add({
        targets: aviso,
        alpha: 0,
        duration: 500,
        onComplete: () => aviso.destroy(),
      });

      this.time.delayedCall(500, () => {
        if (!jefe3.active) return;
        const clone = tipo.grupo.create(spawn.x, spawn.y, tipo.tex);
        clone.setScale(this.esc(tipo.esc));
        clone.setCollideWorldBounds(true);
        clone.vida = tipo.vida;
      });
    }
  }

  // barra de vida
  actualizarBarraTiempo() {
    const ratio = Phaser.Math.Clamp(time / TIEMPO_MAX, 0, 1);
    this.timerRelleno.setVisible(ratio > 0);
    this.timerRelleno.setCrop(
      0,
      0,
      this.timerRelleno.width * ratio,
      this.timerRelleno.height
    );
    this.timerRelleno.setTint(ratio < 0.2 ? 0xff2222 : COLOR_TIMER);
  }
  actualizarBarraJefe3() {
    const g = this.barraJefe3;
    g.clear();
    if (!jefe3.active) return;
    const ancho = this.px(600);
    const alto = this.py(14);
    const x = (this.gameWidth - ancho) / 2;
    const y = this.py(55);
    g.fillStyle(0x000000, 0.6);
    g.fillRect(x - 2, y - 2, ancho + 4, alto + 4);
    g.fillStyle(0xe31e1e, 1);
    g.fillRect(x, y, ancho * (jefe3.vida / jefe3.vidaMax), alto);
  }

  // jefe 3 muerto
  jefe3Derrotado() {
    if (this.jefe3DerrotadoFlag) return;
    this.jefe3DerrotadoFlag = true;

    this.dispararRadialDesde(jefe3.x, jefe3.y, 30, 300, this.balasJefe);
    this.cameras.main.shake(600, 0.015);

    enemies.clear(true, true);
    enemies2.clear(true, true);
    enemies3.clear(true, true);
    enemies4.clear(true, true);
    enemies5.clear(true, true);
    enemies6.clear(true, true);
    enemies7.clear(true, true);
    enemies8.clear(true, true);
    enemies9.clear(true, true);
    enemies10.clear(true, true);

    const usuario = getLoggedInUser() || "Invitado";
    addScore(time, usuario).then(() => {
      this.background.setAlpha(1);
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
    if (!puedeDisparar || this.menuAbierto || this.pausado) {
      return;
    }
    const angle = Phaser.Math.Angle.Between(gun.x, gun.y, pointer.x, pointer.y);
    let delay = DELAY_BALA;

    //personajes
    if (this.personaje === 1) {
      this.crearBala(angle);
      this.bala.play();
    }

    if (this.personaje === 2) {
      this.crearBala(angle - 0.25);
      this.crearBala(angle);
      this.crearBala(angle + 0.25);
      this.bala.play();
      delay = DELAY_BALA * 2.5;
    }

    if (this.personaje === 3) {
      this.crearBala(angle, 1000, 0.175);
      delay = 75;
    }

    puedeDisparar = false;
    this.time.delayedCall(delay / multVelocidad(this.stats, time), () => {
      puedeDisparar = true;
    });
  }

  crearBala(angle, velocidad = 700, dano = 1) {
    const bala = this.balas.get(gun.x, gun.y);
    if (!bala) return;
    bala.enableBody(true, gun.x, gun.y, true, true);
    bala.setScale(this.esc(0.1));
    bala.setRotation(angle);
    bala.dano = dano;
    this.physics.velocityFromRotation(
      angle,
      this.v(velocidad),
      bala.body.velocity
    );
  }

  golpearEnemigo(obj1, obj2) {
    const bala = this.balas.contains(obj1) ? obj1 : obj2;
    const enemigo = bala === obj1 ? obj2 : obj1;

    bala.disableBody(true, true);
    if (!enemigo.active || enemigo.muerto) {
      return;
    }

    // the madafakin hitmarker
    this.flashEnemigo(enemigo);

    const clave = this.claveEnemigo(enemigo);
    const golpes = golpesPorBala(this.stats) * bala.dano;

    if (typeof enemigo.recibirDaño === "function") {
      enemigo.golpesPendientes = (enemigo.golpesPendientes || 0) + golpes;
      while (enemigo.golpesPendientes >= 1 && enemigo.active) {
        enemigo.recibirDaño();
        enemigo.golpesPendientes -= 1;
      }
    } else {
      enemigo.vida -= golpes;

      if (enemigo.vida <= 0) {
        enemigo.muerto = true;

        // EXPLOSION CLONES
        if (jefe2Clones.contains(enemigo)) {
          this.dispararRadialDesde(
            enemigo.x,
            enemigo.y,
            CANTIDAD_BALAS_RADIAL_CLON_JEFE2,
            VELOCIDAD_BALA_RADIAL_JEFE2
          );
        }

        if (clave === "enemy6") {
          this.dispararRadialDesde(enemigo.x, enemigo.y);
        }

        if (clave === "enemy10") {
          enemigo.setTexture("muerte");
          enemigo.setScale(this.esc(3));
          enemigo.setVelocity(0, 0);
          enemy10Visible = true;

          this.time.delayedCall(300, () => {
            if (enemigo.active) {
              enemigo.disableBody(true, true);
            }
          });
        } else {
          enemigo.disableBody(true, true);
        }
      }
    }
    const murio = !enemigo.active || enemigo.muerto;
    //ganar tiempo
    if (murio && enemigo !== jefe && enemigo !== jefe2 && enemigo !== jefe3) {
      this.ganarTiempo(recompensaKill(clave, this.stats));
    }

    if (enemigo === jefe2 && !jefe2.active) {
      this.jefe2Derrotado();
    }

    if (enemigo === jefe3 && !jefe3.active) {
      this.jefe3Derrotado();
    }

    // menu de mejoras
    if ((enemigo === jefe || enemigo === jefe2) && !enemigo.active) {
      mostrarMenuMejoras(this, this.stats);
    }
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

      // ENEMY4 escopeta?-------------------------------------------------------------------------------------------------------------------------------------------
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
      this.ganarTiempo(2 + this.stats.bonusParry);
      this.parry.play();
      hitCooldown = true;

      this.physics.pause();
      this.time.delayedCall(500, () => {
        hitCooldown = false;
        if (!this.pausado) this.physics.resume();
      });

      return;
    }
    this.perderTiempo(5);
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
  //sprites
  animarSprite(obj, base) {
    if (!obj.active) return;
    const frame2 = Math.floor(this.time.now / 250) % 2 === 1;
    const key = base + (obj.dir || "") + (frame2 ? "-2frame" : "");
    if (obj.texture.key !== key) obj.setTexture(key);
  }
  actualizarArma(
    obj,
    escalaArma = 0.17,
    factorDistancia = 0.5,
    textura = "gun"
  ) {
    if (!obj.active) {
      if (obj.arma) obj.arma.setVisible(false);
      return;
    }

    if (!obj.arma) {
      obj.arma = this.add.image(obj.x, obj.y, textura);
      obj.arma.setOrigin(0.2, 0.45);
      obj.arma.setScale(this.esc(escalaArma));
      if (textura === "gun2") obj.arma.setFlipX(true);
      obj.once("destroy", () => obj.arma.destroy());
    }

    const angulo = Phaser.Math.Angle.Between(obj.x, obj.y, player.x, player.y);
    const dist =
      Math.max(obj.displayWidth, obj.displayHeight) * factorDistancia;

    obj.arma.setVisible(true);
    obj.arma.setPosition(
      obj.x + Math.cos(angulo) * dist,
      obj.y + Math.sin(angulo) * dist
    );
    obj.arma.setRotation(angulo);
    obj.arma.setDepth(obj.depth + 1);
  }

  update() {
    //GUN------------------------------------------------------------------------------------------------------
    const held = this.teclaR.isDown ? this.teclaR.getDuration() : 0;
    this.cameras.main.setAlpha(1 - held / 2000);
    if (held >= 2000) this.scene.start("GameScene");
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
    if (this.pausado) return; 
    this.balas.children.each((b) => {
      if (
        b.active &&
        (b.x < 0 || b.x > this.gameWidth || b.y < 0 || b.y > this.gameHeight)
      ) {
        b.disableBody(true, true);
      }
    });
    //ENEMY moverse-------------------------------------------------------------------------------------------------
    enemy.actualizar(player, this.v(233));
    enemy3.actualizar(player, this.v(100));
    enemy9.actualizar(player, this.v(200));
    if (enemy10.active) {
      this.physics.moveToObject(enemy10, player, this.v(150));
      enemy10.setVisible(enemy10Visible);
    }
    enemies10.children.each((clone) => {
      if (clone.active) {
        this.physics.moveToObject(clone, player, this.v(150));
        clone.setVisible(enemy10Visible);
      }
    });

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
    enemies9.children.each((enemy9) => {
      if (enemy9.active) {
        this.physics.moveToObject(enemy9, player, this.v(200));
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

    if (jefe.active && !jefe.ocupado && !jefe.dasheando) {
      this.physics.moveToObject(
        jefe,
        player,
        this.v(VELOCIDAD_MOVIMIENTO_JEFE)
      );
    }

    jefe2.actualizar(player, this.v(VELOCIDAD_JEFE2));

    jefe2Clones.children.each((clon) => {
      if (clon.active) {
        this.physics.moveToObject(clon, player, this.v(VELOCIDAD_CLON_JEFE2));
      }
    });

    // jefe 3 (velocidad constante)

    if (jefe3.active && !jefe3.ocupado) {
      this.physics.moveToObject(jefe3, player, this.v(VELOCIDAD_JEFE3));
    }
    this.actualizarBarraJefe3();
    this.actualizarBarraTiempo();
    if (enemy8.active) {
      this.moverDiagonalHacia(enemy8, player, this.v(350));
    }
    enemies8.children.each((clone) => {
      if (clone.active) {
        this.moverDiagonalHacia(clone, player, this.v(350));
      }
    });
    enemies.children.each((enemy) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, player, this.v(233));
        actualizarSpriteEnemy(enemy, this);
      }
    });

    //sprites enemigos type shi
    this.animarSprite(enemy2, "enemy2");
    enemies2.children.each((clone) => {
      this.animarSprite(clone, "enemy2");
    });
    this.animarSprite(enemy4, "enemy4");
    enemies4.children.each((clone) => {
      this.animarSprite(clone, "enemy4");
    });
    this.animarSprite(enemy2, "enemy7");
    enemies7.children.each((clone) => {
      this.animarSprite(clone, "enemy7");
    });
    if (this.input.activePointer.isDown) {
      this.disparar(this.input.activePointer);
    }
    // MOVIMIENTO DEL JUGADOR
    let velocidadX = 0;
    let velocidadY = 0;
    const velJugador =
      this.v(VELOCIDAD_JUGADOR) * multVelocidad(this.stats, time);
    //armas enemigos
    this.actualizarArma(enemy2);
    enemies2.children.each((clone) => this.actualizarArma(clone));
    this.actualizarArma(enemy4);
    enemies4.children.each((clone) => this.actualizarArma(clone));
    this.actualizarArma(enemy7, 0.3, 0.5, "gun2");
    enemies7.children.each((clone) =>
      this.actualizarArma(clone, 0.3, 0.5, "gun2")
    );
    this.actualizarArma(jefe, 0.5, 0.5, "gun2");
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
    if (!this.dashActivo) {
      player.body.setVelocityX(velocidadX);
      player.body.setVelocityY(velocidadY);
    }
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
  //MEJORAS-------------------------------------------------------------------------------------------------
  perderTiempo(base) {
    time = Math.max(0, time - calcularPerdida(base, this.stats, time));
  }
  ganarTiempo(cantidad) {
    time = Math.min(TIEMPO_MAX, time + cantidad);
  }
  claveEnemigo(e) {
    return e.texture.key.replace(/-.*$/, "").toLowerCase();
  }
  iniciarDash() {
    let dx = (teclas.right.isDown ? 1 : 0) - (teclas.left.isDown ? 1 : 0);
    let dy = (teclas.down.isDown ? 1 : 0) - (teclas.up.isDown ? 1 : 0);
    if (dx === 0 && dy === 0) {
      const a = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        this.input.activePointer.x,
        this.input.activePointer.y
      );
      dx = Math.cos(a);
      dy = Math.sin(a);
    }
    const len = Math.hypot(dx, dy);
    this.dashActivo = true;
    player.body.setVelocity((dx / len) * this.v(900), (dy / len) * this.v(900));
    this.time.delayedCall(DURACION_parry, () => (this.dashActivo = false));
  }
}
//3328 67 lineas de pura dinamita 20 + 20 + 20 + 7