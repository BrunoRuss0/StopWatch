const STORAGE_KEY = "bossFightLeaderboard";
const MAX_ENTRIES = 10;

export function getScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Error leyendo el leaderboard:", e);
    return [];
  }
}

export function addScore(time) {
  const scores = getScores();

  const entry = {
    time,
    date: new Date().toLocaleDateString(),
  };

  scores.push(entry);
  scores.sort((a, b) => b.time - a.time);
  const trimmed = scores.slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error("Error guardando el leaderboard:", e);
  }

  return trimmed;
}

export function clearScores() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error borrando el leaderboard:", e);
  }
}
