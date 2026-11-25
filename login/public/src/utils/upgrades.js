export const TIEMPO_MAX = 350;

export function crearStats() {
  return {
    perdidaReducida: 0,
    tiempoPorKill: 0,
    daño: 1,
    bonusParry: 0,
    adrenalina: 0,
    ultimoAliento: 0,
    parryDash: false,
    niveles: {},
  };
}

export function urgencia(time) {
  return Math.min(1, Math.max(0, 1 - time / TIEMPO_MAX));
}

export function calcularPerdida(base, stats, time) {
  const mult =
    (1 - stats.perdidaReducida) * (1 - stats.ultimoAliento * urgencia(time));
  return Math.max(1, Math.round(base * mult));
}

export function multVelocidad(stats, time) {
  return 1 + stats.adrenalina * urgencia(time);
}

export function golpesPorBala(stats) {
  const base = Math.floor(stats.daño);
  return base + (Math.random() < stats.daño - base ? 1 : 0);
}

const RECOMPENSA = {
  enemy: 1,
  enemy2: 2,
  enemy3: 4,
  enemy4: 2,
  enemy5: 2,
  enemy6: 2,
  enemy7: 3,
  enemy8: 1,
  enemy9: 2,
  enemy10: 3,
  jefe2: 1,
};
export function recompensaKill(clave, stats) {
  return (RECOMPENSA[clave] ?? 1) * stats.tiempoPorKill;
}

export const UPGRADES = [
  {
    id: "ladron",
    nombre: "Ladron",
    max: 2,
    desc: "Cada kill da tiempo",
    aplicar: (s) => (s.tiempoPorKill += 1),
  },

  {
    id: "reloj",
    nombre: "reloj",
    max: 99,
    desc: "+40 segundos extras.",
    aplicar: (s, scene) => scene.ganarTiempo(40),
  },

  {
    id: "adrenalina",
    nombre: "Adrenalina",
    max: 2,
    desc: "Cuanto menos tiempo te queda, mas rapido disparas y te moves.",
    aplicar: (s) => (s.adrenalina += 0.25),
  },
  {
    id: "ultimoAliento",
    nombre: "Reloj de arena",
    max: 2,
    desc: "Cuanto menos tiempo te queda, menos tiempo perdes.",
    aplicar: (s) => (s.ultimoAliento += 0.2),
  },
  {
    id: "dash",
    nombre: "Parry Dash",
    max: 1,
    desc: "El parry ahora se transforma en un dash.",
    aplicar: (s) => (s.parryDash = true),
  },
];

function elegirOpciones(stats, n) {
  const disponibles = UPGRADES.filter(
    (u) => (stats.niveles[u.id] ?? 0) < u.max
  );
  return disponibles.sort(() => Math.random() - 0.5).slice(0, n);
}

export function mostrarMenuMejoras(scene, stats, alTerminar) {
  const opciones = elegirOpciones(stats, 2);
  if (opciones.length === 0) return alTerminar?.();

  scene.menuAbierto = true;
  scene.time.paused = true;
  scene.physics.pause();
  scene.tweens.pauseAll();

  const w = scene.gameWidth,
    h = scene.gameHeight,
    e = scene.escala;
  const D = 99999990;
  const objs = [];
  const abiertoEn = performance.now();

  objs.push(
    scene.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.75).setDepth(D)
  );
  objs.push(
    scene.add
      .text(w / 2, h * 0.15, "Selecciona mejora", {
        fontSize: Math.round(40 * e) + "px",
        fill: "#8a1ee3",
        fontStyle: "bold italic",
      })
      .setOrigin(0.5)
      .setDepth(D + 1)
  );

  opciones.forEach((op, i) => {
    const x = w / 2 + (i === 0 ? -1 : 1) * w * 0.2;
    const nivel = stats.niveles[op.id] ?? 0;
    const carta = scene.add
      .rectangle(x, h / 2, w * 0.3, h * 0.4, 0x000000)
      .setStrokeStyle(3, 0x8a1ee3)
      .setDepth(D + 1)
      .setInteractive();
    const titulo = scene.add
      .text(
        x,
        h / 2 - h * 0.1,
        op.nombre +
          (op.max > 1 && op.max < 99 ? ` (${nivel + 1}/${op.max})` : ""),
        {
          fontSize: Math.round(28 * e) + "px",
          fill: "#ffffff",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5)
      .setDepth(D + 2);
    const desc = scene.add
      .text(x, h / 2 + h * 0.03, op.desc, {
        fontSize: Math.round(20 * e) + "px",
        fill: "#cccccc",
        align: "center",
        wordWrap: { width: w * 0.26 },
      })
      .setOrigin(0.5)
      .setDepth(D + 2);

    carta.on("pointerover", () => carta.setFillStyle(0x3a1f66));
    carta.on("pointerout", () => carta.setFillStyle(0x000000));
    carta.on("pointerup", () => {
      if (performance.now() - abiertoEn < 400) return;
      op.aplicar(stats, scene);
      stats.niveles[op.id] = nivel + 1;
      objs.forEach((o) => o.destroy());
      scene.time.paused = false;
      scene.physics.resume();
      scene.tweens.resumeAll();
      scene.menuAbierto = false;
      alTerminar?.();
    });
    objs.push(carta, titulo, desc);
  });
}
