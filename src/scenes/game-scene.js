let player;
let teclas;
let enemy;
let enemy2;
let enemy3;
let enemies;
let enemies2;
let enemies3;
let currentRoom = 1;
let time = 100;
let timerText;
let gun;
let hitCooldown = false;
let puedeDisparar = true;
let parryActivo = false;
let puedeParry = true;
let mostrandoPuedeParry = false;
const DELAY_BALA_ENEMIGO = 1200;
const COOLDOWN_parry = 3000;
const DURACION_parry = 300;
const DELAY_BALA = 300;
const VELOCIDAD_JUGADOR = 300;
const VIDA_ENEMY = 2;
const VIDA_ENEMY2 = 3;
const VIDA_ENEMY3 = 5;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  init() {}

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/enemy.png");
    this.load.image("enemy2", "assets/agustin.jpg");
    this.load.image("bruno", "assets/bruno.JPG");
    this.load.image("balas", "assets/bala.png");
    this.load.image("player-back", "assets/player-back.png");
    this.load.image("cursor", "assets/cursor.png");
    this.load.image("gun", "assets/gun.png");
    this.load.image("bala-enemigo", "assets/bala-enemigo.png");
    this.load.image("parry", "assets/parry.JPG");
    this.load.image("puede-parry", "assets/puedeparry.jpg");
    this.load.image("enemy3", "assets/enemy3.jpg");
    this.load.audio("parry", "assets/parry.mp3");
    this.load.audio("bala", "assets/bala.wav");
    this.load.audio("bala_enemigo", "assets/bala_enemigo.wav");
  }
  create() {
    currentRoom = 1;
    puedeDisparar = true;
    puedeParry = true;
    time = 100;
    hitCooldown = false;
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
      player.setScale(0.04);
      this.time.delayedCall(DURACION_parry, () => {
        parryActivo = false;
        player.setTexture("player");
        player.setScale(0.2);
        this.time.delayedCall(COOLDOWN_parry, () => {
          puedeParry = true;
          mostrandoPuedeParry = true;
          player.setTexture("puede-parry");
          player.setScale(0.1);
          this.time.delayedCall(100, () => {
            mostrandoPuedeParry = false;
            player.setTexture("player");
            player.setScale(0.2);
          });
        });
      });
    });

    //DOOR-------------------------------------------------------------------------------------------------
    this.door = this.physics.add.staticImage(1200, 300, "bruno");
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
    enemy = this.physics.add.image(1050, 190, "enemy");
    enemy.setScale(0.35);
    enemy.setImmovable(true);
    enemy.body.setCollideWorldBounds(true);
    enemy.vida = VIDA_ENEMY;
    enemy.disableBody(true, true);

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
    enemy2 = this.physics.add.image(1050, 400, "enemy2");
    enemy2.setScale(0.04);
    enemy2.setCollideWorldBounds(true);
    enemy2.vida = VIDA_ENEMY2;
    enemy2.disableBody(true, true);

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
      enemy2,
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

    this.input.on("pointerdown", (pointer) => {
      this.disparar(pointer);
    });

    //BALAS ENEMIGO----------------------------------------------------------------------------------------------------
    this.balasEnemy = this.physics.add.group({
      defaultKey: "bala-enemigo",
      maxSize: 100,
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
      (enemy.active ? 1 : 0) +
      enemies.countActive() +
      enemies3.countActive() +
      enemies3.countActive();
    if (enemigosVivos > 0) {
      return;
    }

    if (currentRoom === 1) {
      currentRoom = 2;
      this.cargarHabitacion();
    } else if (currentRoom === 2) {
      currentRoom = 1;
      this.cargarHabitacion();
    }
  }
  //CARGAR HABITACION-------------------------------------------------------------------------------------------------
  cargarHabitacion() {
    enemy3.disableBody(true, true);
    enemies3.children.each((clone) => {
      clone.disableBody(true, true);
    });
    enemy.disableBody(true, true);
    enemies.children.each((clone) => {
      clone.disableBody(true, true);
    });

    if (currentRoom === 1) {
      player.setPosition(100, 300);
      let spawn3 = this.obtenerSpawnAleatorio();
      let spawn1 = this.obtenerSpawnAleatorio();

      enemy.enableBody(true, spawn1.x, spawn1.y, true, true);
      enemy.vida = VIDA_ENEMY;
      enemy3.enableBody(true, spawn3.x, spawn3.y, true, true);
      enemy3.vida = VIDA_ENEMY3;

      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn.x, spawn.y, "enemy2");
        enemy2Clone.setScale(0.04);
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = VIDA_ENEMY2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn.x, spawn.y, "enemy3");
        enemy3Clone.setScale(0.1);
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = VIDA_ENEMY3;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn.x, spawn.y, "enemy");
        enemyClone.setScale(0.35);
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = VIDA_ENEMY;
      }
    } else if (currentRoom === 2) {
      player.setPosition(100, 300);
      let spawn3 = this.obtenerSpawnAleatorio();
      let spawn1 = this.obtenerSpawnAleatorio();

      enemy.enableBody(true, spawn1.x, spawn1.y, true, true);
      enemy3.enableBody(true, spawn3.x, spawn3.y, true, true);
      enemy3.vida = VIDA_ENEMY3;
      enemy.vida = VIDA_ENEMY;
      for (let i = 0; i < Phaser.Math.Between(1, 5); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemyClone = enemies.create(spawn.x, spawn.y, "enemy");
        enemyClone.setScale(0.35);
        enemyClone.setCollideWorldBounds(true);
        enemyClone.vida = VIDA_ENEMY;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy2Clone = enemies2.create(spawn.x, spawn.y, "enemy2");
        enemy2Clone.setScale(0.04);
        enemy2Clone.setCollideWorldBounds(true);
        enemy2Clone.vida = VIDA_ENEMY2;
      }
      for (let i = 0; i < Phaser.Math.Between(1, 2); i++) {
        let spawn = this.obtenerSpawnAleatorio();
        let enemy3Clone = enemies3.create(spawn.x, spawn.y, "enemy3");
        enemy3Clone.setScale(0.1);
        enemy3Clone.setCollideWorldBounds(true);
        enemy3Clone.vida = VIDA_ENEMY3;
      }
    }
  }

  //MOVIMIENTO RANDOM ------------------------------------------------------------------------------------------------
  moverenemigoAleatorio() {
    const velocidad = 200;
    const direcciones = [
      { x: velocidad, y: 0 },
      { x: -velocidad, y: 0 },
      { x: 0, y: velocidad },
      { x: 0, y: -velocidad },
    ];

    let dir = Phaser.Math.RND.pick(direcciones);
    enemy2.setVelocity(dir.x, dir.y);
    enemies2.children.each((clone) => {
      let dirClone = Phaser.Math.RND.pick(direcciones);
      clone.setVelocity(dirClone.x, dirClone.y);
    });
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
    // -------------------------------------------------------

    bala.disableBody(true, true);
    if (!enemigo.active) {
      return;
    }

    enemigo.vida -= 1;
    if (enemigo.vida <= 0) {
      enemigo.disableBody(true, true);
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

    enemies2.children.each((enemy2Clone) => {
      if (!enemy2Clone.active) {
        return;
      }

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

    if (hitCooldown) {
      return;
    }

    if (parryActivo) {
      time += 5;
      this.parry.play();
      this.physics.pause();

      if (time > 100) {
        time = 100;
      }

      timerText.setText("Time: " + time);
      hitCooldown = true;

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
    this.physics.moveToObject(enemy, player, 233);
    enemies.children.each((enemy) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, player, 233);
      }
    });
    this.physics.moveToObject(enemy3, player, 100);
    enemies3.children.each((enemy) => {
      if (enemy.active) {
        this.physics.moveToObject(enemy, player, 100);
      }
    });
    //MOVIMIENTO IZQ, DER----------------------------------------------------------------------------------------
    if (teclas.left.isDown) {
      player.body.setVelocityX(-VELOCIDAD_JUGADOR);
    } else if (teclas.right.isDown) {
      player.body.setVelocityX(VELOCIDAD_JUGADOR);
    } else {
      player.body.setVelocityX(0);
      player.setTexture("player");
    }

    //MOVIMIENTO ARR, ABA----------------------------------------------------------------------------------------------
    if (teclas.up.isDown) {
      player.body.setVelocityY(-VELOCIDAD_JUGADOR);
      player.setTexture("player-back");
    } else if (teclas.down.isDown) {
      player.body.setVelocityY(VELOCIDAD_JUGADOR);
    } else {
      player.body.setVelocityY(0);
      player.setTexture("player");
    }

    //PARRY------------------------------------------------------------------------------------------------
    if (parryActivo) {
      player.setTexture("parry");
      player.setScale(0.04);
    } else if (mostrandoPuedeParry) {
      player.setTexture("puede-parry");
      player.setScale(0.1);
    } else {
      player.setTexture("player");
      player.setScale(0.2);
    }
  }
}
//6XX LINEAS DE PURA DINAMITA
