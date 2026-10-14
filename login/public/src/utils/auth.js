const SESSION_KEY = "bossFightLoggedInUser";

export async function loginUser(usuario, password) {
  if (!usuario || !password) {
    throw new Error("Usuario o contraseña inválidos.");
  }

  let res;
  try {
    res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });
  } catch (e) {
    throw new Error("No se pudo conectar con el servidor.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "No se pudo iniciar sesión.");
  }

  guardarSesion(data.usuario);
  return data;
}

function guardarSesion(usuario) {
  try {
    sessionStorage.setItem(SESSION_KEY, usuario);
  } catch (e) {
    console.error("Error guardando la sesión:", e);
  }
}

export function continueAsGuest() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error("Error limpiando la sesión:", e);
  }
}

export function logout() {
  continueAsGuest();
}

export function getLoggedInUser() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch (e) {
    return null;
  }
}
