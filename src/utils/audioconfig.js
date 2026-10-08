const ajustes = { master: 1, musica: 1, efectos: 1 };

export function getVolumen(tipo) {
  return ajustes[tipo];
}

export function setVolumen(tipo, valor) {
  ajustes[tipo] = Math.min(1, Math.max(0, valor));
}

export const volMusica = (base = 1) => base * ajustes.musica;
export const volEfecto = (base = 1) => base * ajustes.efectos;

export function aplicarMaster(scene) {
  scene.sound.setVolume(ajustes.master);
}