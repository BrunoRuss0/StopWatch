
const SESSION_KEY = "bossFightLoggedInUser";

export function loginUser(usuario, password) {
  return new Promise((resolve, reject) => {
    if (!usuario || !password) {
      reject(new Error("Usuario o contraseña inválidos."));
      return;
    }

    guardarSesion(usuario);
    resolve(usuario);
  });
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