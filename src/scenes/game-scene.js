import Enemy from "../entities/Enemy.js";
import Enemy2 from "../entities/Enemy2.js";
let player;
let teclas;
let enemy;
let enemy2;
let enemy3;
let enemy4;
let enemy5;
let jefe;
let enemies;
let enemies2;
let enemies3;
let enemies4;
let enemies5;
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
const DELAY_BALA_ENEMIGO = 1200;
const DELAY_BALA_ENEMY4 = 3000;
const COOLDOWN_parry = 3000;
const DURACION_parry = 300;
const DELAY_BALA = 300;
const VELOCIDAD_JUGADOR = 300;
const VIDA_ENEMY = 2;
const VIDA_ENEMY2 = 3;
const VIDA_ENEMY3 = 6;
const VIDA_ENEMY4 = 4;
const VIDA_ENEMY5 = 4;
const VIDA_JEFE = 25;
const DELAY_PATRON_JEFE = 3000;
const VELOCIDAD_MOVIMIENTO_JEFE = 65;
const CANTIDAD_BALAS_RADIAL_JEFE = 15;
const VELOCIDAD_BALA_RADIAL_JEFE = 350;
const CANTIDAD_BALAS_ESCOPETA_JEFE = 10;
const SEPARACION_ESCOPETA_JEFE = 0.15;
const VELOCIDAD_BALA_ESCOPETA_JEFE = 300;
const VELOCIDAD_ENEMY5 = 130;
const VELOCIDAD_DASH_ENEMY5 = 1000;
const DURACION_DASH_ENEMY5 = 700;
const DASH_MIN_ENEMY5 = 2000;
const DASH_MAX_ENEMY5 = 5000;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {}

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.image("player-left", "assets/player-left.png");
    this.load.image("player-right", "assets/player-right.png");
    this.load.image("player-back", "assets/player-back.png");
    this.load.image("player-back-left", "assets/player-back-left.png");
    this.load.image("player-back-right", "assets/player-back-right.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("enemy2", "assets/agustin.jpg");
    this.load.image("puerta", "assets/puerta.JPG");
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("gun", "assets/gun.png");
    this.load.image("balas", "assets/bala.png");
    this.load.image("bala-enemigo", "assets/bala-enemigo.png");
    this.load.image("bala-jefe", "assets/bala-jefe.png");
    this.load.image("parry", "assets/parry.png");
    this.load.image("puede-parry", "assets/puedeparry.png");
    this.load.image("enemy3", "assets/enemy3.jpg");
    this.load.image("enemy4", "assets/enemy4.jpg");
    this.load.image("enemy5", "assets/enemy5.jpg");
    this.load.image("jefe", "assets/jefe.png");
    this.load.audio("parry", "assets/parry.mp3");
    this.load.audio("bala", "assets/bala.wav");
    this.load.audio("bala_enemigo", "assets/bala_enemigo.wav");
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
    this.input.setDefaultCursor("none");
    this.cursor = this.add.image(0, 0, "cursor");
    this.cursor.setScale(0.1);
    this.cursor.setDepth(100000000);
    this.parry = this.sound.add("parry");
    this.bala_enemigo = this.sound.add("bala_enemigo", {
      volume: 0.5,
    });
    this.bala = this.sound.add("bala", {
      volume: 0.5,
    });

    //BACKGROUND-------------------------------------------------------------------------------------------------
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;
    const bg = this.add.image(300, 300, "background");
    bg.setPosition(gameWidth / 2, gameHeight / 2);
    bg.setDisplaySize(gameWidth, gameHeight);

    //PLAYER-------------------------------------------------------------------------------------------------
    player = this.add.image(0, 0, "player");
    player.setPosition(265, 190).setScale(0.2);
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
        player.setScale(0.2);
        hitCooldown = true;
        this.time.delayedCall(500, () => {
          hitCooldown = false;
        });

        this.time.delayedCall(COOLDOWN_parry, () => {
          puedeParry = true;
          mostrandoPuedeParry = true;
          player.setTexture("puede-parry");
          this.time.delayedCall(500, () => {
            mostrandoPuedeParry = false;
            player.setTexture("player");
            player.setScale(0.2);
          });
        });
      });
    });

    //DOOR-------------------------------------------------------------------------------------------------
    this.door = this.physics.add.staticImage(1200, 300, "puerta");
    this.door.setScale(0.15);

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
    gun.setScale(0.03);
    gun.setOrigin(0.1, 0.5);
    gun.setDepth(player.depth + 1);

    //ENEMY-------------------------------------------------------------------------------------------------
    enemy = new Enemy(this, 1050, 190);
    this.physics.add.collider(player, enemy, () => {
      if (hitCooldown) return;
      time -= 3;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.tweens.add({
        targets: player,
        alpha: 0,
        duration: 100,
        ease: "Linear",
        yoyo: true,
        repeat: 0.1,
      });
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });

    //ENEMY 2-------------------------------------------------------------------------------------------------------
    enemy2 = new Enemy2(this, 1050, 400);
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
    enemy3 = this.physics.add.image(1050, 600, "enemy3");
    enemy3.setScale(0.1);
    enemy3.setImmovable(true);
    enemy3.body.setCollideWorldBounds(true);
    enemy3.vida = VIDA_ENEMY3;
    enemy3.disableBody(true, true);

    this.physics.add.collider(player, enemy3, () => {
      if (hitCooldown) return;
      time -= 10;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.tweens.add({
        targets: player,
        alpha: 0,
        duration: 100,
        ease: "Linear",
        yoyo: true,
        repeat: 0.1,
      });
      this.time.delayedCall(500, () => {
        hitCooldown = false;
      });
    });
    //enemy 4
    enemies4 = this.physics.add.group();
    enemy4 = this.physics.add.image(1050, 400, "enemy4");
    enemy4.setScale(0.5);
    enemy4.setImmovable(true);
    enemy4.setCollideWorldBounds(true);
    enemy4.vida = VIDA_ENEMY4;
    enemy4.disableBody(true, true);

    this.physics.add.collider(player, enemies4, (player, clone) => {
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
    //enemy5-------------------------------------------------------------------------------------------------------
    enemies5 = this.physics.add.group();
    enemy5 = this.physics.add.image(1050, 600, "enemy5");
    enemy5.setScale(0.02);
    enemy5.setImmovable(false);
    enemy5.body.setCollideWorldBounds(true);
    enemy5.vida = VIDA_ENEMY5;
    enemy5.disableBody(true, true);

    this.physics.add.collider(player, enemy5, () => {
      if (hitCooldown) return;
      time -= 10;
      if (time < 0) {
        time = 0;
      }
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.tweens.add({
        targets: player,
        alpha: 0,
        duration: 100,
        ease: "Linear",
        yoyo: true,
        repeat: 0.1,
      });
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

    //JEFE-------------------------------------------------------------------------------------------------------
    jefe = this.physics.add.image(1050, 300, "jefe");
    jefe.setScale(1);
    jefe.setImmovable(true);
    jefe.body.setCollideWorldBounds(true);
    jefe.vida = VIDA_JEFE;
    jefe.disableBody(true, true);

    this.physics.add.collider(player, jefe, () => {
      if (hitCooldown) return;
      time -= 12;
      if (time < 0) time = 0;
      timerText.setText("Time: " + time);
      hitCooldown = true;
      this.tweens.add({
        targets: player,
        alpha: 0,
        duration: 100,
        ease: "Linear",
        yoyo: true,
        repeat: 0.1,
      });
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

    // GRUPO ENEMY 3------------------------------------------------------------------------------------------------------
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
    timerText = this.add.text(580, 10, "Time: " + time, {
      fontSize: "32px",
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
      maxSize: 1000000,
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
    this.input.on("pointerdown", (pointer) => {
      this.disparar(pointer);
    });

    //BALAS ENEMIGO----------------------------------------------------------------------------------------------------
    this.balasEnemy = this.physics.add.group({
      defaultKey: "bala-enemigo",
      maxSize: 100000000000000,
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
      maxSize: 100000,
    });

    this.physics.add.overlap(
      this.balasJefe,
      player,
      this.recibirDisparo,
      null,
      this
    );
    // COLISIONES ENEMIGOS------------------------------------------------------------------------------------------
    this.physics.add.collider(enemy, enemy);
    this.physics.add.collider(enemy, enemy2);
    this.physics.add.collider(enemy, enemy3);
    this.physics.add.collider(enemy, enemy4);
    this.physics.add.collider(enemy, enemy5);
    this.physics.add.collider(enemy2, enemy2);
    this.physics.add.collider(enemy2, enemy3);
    this.physics.add.collider(enemy2, enemy4);
    this.physics.add.collider(enemy2, enemy5);
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
  }
  //FIN CREATE-------------------------------------------------------------------------------------------------

  obtenerSpawnAleatorio() {
    let x;
    let y;
    do {
      x = Phaser.Math.Between(700, 1050);
      y = Phaser.Math.Between(100, 500);
    } while (
      Phaser.Math.Distance.Between(x, y, player.x, player.y) < 250 ||
      Phaser.Math.Distance.Between(x, y, this.door.x, this.door.y) < 150
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
      (enemy2.active ? 1 : 0) +
      (jefe.active ? 1 : 0) +
      (enemy.active ? 1 : 0) +
      (enemy3.active ? 1 : 0) +
      (enemy5.active ? 1 : 0) +
      (enemy4.active ? 1 : 0);
    if (enemigosVivos > 0) {
      return;
    }

    if (currentRoom === 0) {
      currentRoom = 1;
      this.cargarHabitacion();
    } else if (currentRoom === 1) {
      currentRoom = 2;
      this.cargarHabitacion();
    } else if (currentRoom === 2) {
      currentRoom = 3;
      this.cargarHabitacion();
    } else if (currentRoom === 3) {
      currentRoom = 4;
      this.cargarHabitacion();
    } else if (currentRoom === 4) {
      currentRoom = 5;
      this.cargarHabitacion();
    } else if (currentRoom === 5) {
      currentRoom = 0;
      this.cargarHabitacion();
    }
  }
  //CARGAR HABITACION-------------------------------------------------------------------------------------------------
  cargarHabitacion() {
    enemy.disableBody(true, true);
    enemy2.disableBody(true, true);
    enemy3.disableBody(true, true);
    enemy4.disableBody(true, true);
    enemy5.disableBody(true, true);
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

    enemy4.vida = VIDA_ENEMY4;
    if (currentRoom === 0) {
      enemy.disableBody(true, true);
      enemy2.disableBody(true, true);
      enemy3.disableBody(true, true);
      enemy4.disableBody(true, true);
      enemy5.disableBody(true, true);
      jefe.disableBody(true, true);
      player.setPosition(100, 300);
    }
    if (currentRoom === 1) {
      player.setPosition(100, 300);
      let spawn3 = this.obtenerSpawnAleatorio();
      let spawn1 = this.obtenerSpawnAleatorio();
      enemy.enableBody(true, spawn1.x, spawn1.y, true, true);
      enemy.reiniciarVida();
      enemy3.enableBody(true, spawn3.x, spawn3.y, true, true);
      enemy3.vida = VIDA_ENEMY3;
      enemy5.enableBody(true, spawn3.x, spawn3.y, true, true);
      enemy5.vida = VIDA_ENEMY5;
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy5Clone = enemies5.create(spawn.x, spawn.y, "enemy5");
        enemy5Clone.setScale(0.02);
        enemy5Clone.setCollideWorldBounds(true);
        enemy5Clone.vida = VIDA_ENEMY5;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn.x, spawn.y, "enemy3");
        enemy3Clone.setScale(0.1);
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = VIDA_ENEMY3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 4); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn.x, spawn.y, "enemy");
        enemyClone.setScale(0.35);
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = VIDA_ENEMY;
      }
    } else if (currentRoom === 2) {
      player.setPosition(100, 300);
      let spawn = this.obtenerSpawnAleatorio();
      let spawn4 = this.obtenerSpawnAleatorio();
      enemy2.enableBody(true, spawn.x, spawn.y, true, true);
      enemy4.enableBody(true, spawn4.x, spawn4.y, true, true);
      enemy2.vida = VIDA_ENEMY2;
      enemy4.vida = VIDA_ENEMY4;
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn.x, spawn.y, "enemy2");
        enemy2Clone.setScale(0.04);
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = VIDA_ENEMY2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(0.5);
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = VIDA_ENEMY4;
      }
    } else if (currentRoom === 3) {
      player.setPosition(100, 300);
      let spawn1 = this.obtenerSpawnAleatorio();
      let spawn = this.obtenerSpawnAleatorio();
      enemy.enableBody(true, spawn1.x, spawn1.y, true, true);
      enemy.reiniciarVida();
      enemy2.enableBody(true, spawn.x, spawn.y, true, true);
      enemy2.vida = VIDA_ENEMY2;
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn.x, spawn.y, "enemy");
        enemyClone.setScale(0.35);
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = VIDA_ENEMY;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 1); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn.x, spawn.y, "enemy2");
        enemy2Clone.setScale(0.04);
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = VIDA_ENEMY2;
      }
    } else if (currentRoom === 4) {
      player.setPosition(100, 300);
      let spawn3 = this.obtenerSpawnAleatorio();
      let spawn4 = this.obtenerSpawnAleatorio();
      let spawn5 = this.obtenerSpawnAleatorio();
      enemy3.enableBody(true, spawn3.x, spawn3.y, true, true);
      enemy3.vida = VIDA_ENEMY3;
      enemy4.enableBody(true, spawn4.x, spawn4.y, true, true);
      enemy4.vida = VIDA_ENEMY4;
      enemy5.enableBody(true, spawn5.x, spawn5.y, true, true);
      enemy5.vida = VIDA_ENEMY5;
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn.x, spawn.y, "enemy3");
        enemy3Clone.setScale(0.1);
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = VIDA_ENEMY3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn4 = this.obtenerSpawnAleatorio();
        let enemy4Clone = enemies4.create(spawn4.x, spawn4.y, "enemy4");
        enemy4Clone.setScale(0.5);
        enemy4Clone.setCollideWorldBounds(true);
        enemy4Clone.vida = VIDA_ENEMY4;
      }
    } else if (currentRoom === 5) {
      player.setPosition(100, 300);
      jefe.enableBody(true, 900, 100, true, true);
    }
  }

  //MOVIMIENTO RANDOM ------------------------------------------------------------------------------------------------
  renemigoAleatorio() {
    enemy2.moverAleatorio();

    enemies2.children.each((clone) => {
      if (!clone.active) return;

      const velocidad = 200;

      const direcciones = [
        { x: velocidad, y: 0 },
        { x: -velocidad, y: 0 },
        { x: 0, y: velocidad },
        { x: 0, y: -velocidad },
      ];

      const dir = Phaser.Math.RND.pick(direcciones);

      clone.setVelocity(dir.x, dir.y);
    });
  }
  moverenemigo4Aleatorio() {
    const velocidad = 100;
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
      VELOCIDAD_DASH_ENEMY5,
      enemy5Actual.body.velocity
    );

    this.time.delayedCall(DURACION_DASH_ENEMY5, () => {
      if (enemy5Actual.active) {
        enemy5Actual.setVelocity(0, 0);
        enemy5Actual.dasheando = false;
      }
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
      balaenemy.setScale(0.12);

      const angle = (Math.PI * 2 * i) / CANTIDAD_BALAS_RADIAL_JEFE;
      balaenemy.setRotation(angle);
      this.physics.velocityFromRotation(
        angle,
        VELOCIDAD_BALA_RADIAL_JEFE,
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
      bala.setScale(0.1);
      let angle = Phaser.Math.Angle.Between(gun.x, gun.y, pointer.x, pointer.y);
      bala.setRotation(angle);
      this.physics.velocityFromRotation(angle, 700, bala.body.velocity);
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
        enemigo.disableBody(true, true);
      }
    }
  }

  // BALAS ENEMIGO--------------------------------------------------------------------------------------------------
  dispararenemy() {
    if (enemy2.active) {
      let balaenemy = this.balasEnemy.get(enemy2.x, enemy2.y);
      if (balaenemy) {
        balaenemy.enableBody(true, enemy2.x, enemy2.y, true, true);
        balaenemy.setScale(0.12);
        const angle = Phaser.Math.Angle.Between(
          enemy2.x,
          enemy2.y,
          player.x,
          player.y
        );
        balaenemy.setRotation(angle);
        this.physics.velocityFromRotation(angle, 500, balaenemy.body.velocity);
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
        balaenemy.setScale(0.12);

        const angle = Phaser.Math.Angle.Between(
          enemy2Clone.x,
          enemy2Clone.y,
          player.x,
          player.y
        );

        balaenemy.setRotation(angle);
        this.physics.velocityFromRotation(angle, 500, balaenemy.body.velocity);
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
      if (time > 300) time = 300;
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
    if (time < 0) time = 0;
    timerText.setText("Time: " + time);
    hitCooldown = true;

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
      bala.setScale(0.12);
      const angle = baseAngle + (i - (cantidadBalas - 1) / 2) * separacion;
      bala.setRotation(angle);
      this.physics.velocityFromRotation(angle, velocidad, bala.body.velocity);
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

    const distancia = 35;
    gun.x = player.x + Math.cos(angle) * distancia;
    gun.y = player.y + Math.sin(angle) * distancia;
    gun.rotation = angle;
    this.cursor.x = this.input.activePointer.x;
    this.cursor.y = this.input.activePointer.y;

    //ENEMY MOVEMENT-------------------------------------------------------------------------------------------------
    if (enemy.active) {
      this.physics.moveToObject(enemy, player, 233);
    }
    enemies.children.each((enemy) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, player, 233);
      }
    });

    if (enemy3.active) {
      this.physics.moveToObject(enemy3, player, 100);
    }
    enemies3.children.each((enemy3) => {
      if (enemy3.active) {
        this.physics.moveToObject(enemy3, player, 100);
      }
    });
    if (enemy5.active && !enemy5.dasheando) {
      this.physics.moveToObject(enemy5, player, VELOCIDAD_ENEMY5);
    }

    enemies5.children.each((enemy5Clone) => {
      if (!enemy5Clone.active) return;

      if (!enemy5Clone.dasheando) {
        this.physics.moveToObject(enemy5Clone, player, VELOCIDAD_ENEMY5);
      }
    });

    if (jefe.active) {
      this.physics.moveToObject(jefe, player, VELOCIDAD_MOVIMIENTO_JEFE);
    }
    // MOVIMIENTO DEL JUGADOR
    let velocidadX = 0;
    let velocidadY = 0;

    // HORIZONTAL--------------------------------------------------------------------------------------------------------------------------------------
    if (teclas.left.isDown) {
      velocidadX = -VELOCIDAD_JUGADOR;
    } else if (teclas.right.isDown) {
      velocidadX = VELOCIDAD_JUGADOR;
    }

    // VERTICAL--------------------------------------------------------------------------------------------------------------------------------------
    if (teclas.up.isDown) {
      velocidadY = -VELOCIDAD_JUGADOR;
    } else if (teclas.down.isDown) {
      velocidadY = VELOCIDAD_JUGADOR;
    }

    player.body.setVelocityX(velocidadX);
    player.body.setVelocityY(velocidadY);

    // SPRITES--------------------------------------------------------------------------------------------------------------------------------------
    // SPRITES
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
//1148 lineas de pura dinamita
