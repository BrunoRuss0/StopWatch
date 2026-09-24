const STORAGE_KEY = "bossFightLeaderboard";
const MAX_ENTRIES = 10;



const BIN_ID = "6ab53885ffd5d160532ac709";
const API_KEY = "$2a$10$o.pbPsaqAPff9gaVMi.SEejlqnjtO.dUZLOMgFVs7TYO3PJSBjTo6";

const API_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;



export async function getScores() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "X-Master-Key": API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.record || !Array.isArray(data.record.scores)) {
      return [];
    }

    return data.record.scores;

  } catch (e) {
    console.error("Error leyendo el leaderboard online:", e);

    return [];
  }
}

export async function addScore(time, usuario = "Invitado") {

  try {

    const scores = await getScores();

    const entry = {
      time: time,
      usuario: usuario,
      date: new Date().toLocaleDateString()
    };

    scores.push(entry);

    scores.sort((a, b) => b.time - a.time);

    const trimmed = scores.slice(0, MAX_ENTRIES);

    const response = await fetch(API_URL, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },

      body: JSON.stringify({
        scores: trimmed
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log("Leaderboard actualizado:", trimmed);

    return trimmed;

  } catch (e) {

    console.error("Error guardando el leaderboard:", e);

    return [];
  }
}


export async function clearScores() {

  try {

    const response = await fetch(API_URL, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },

      body: JSON.stringify({
        scores: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log("Leaderboard borrado.");

  } catch (e) {

    console.error("Error borrando el leaderboard:", e);
  }
}
