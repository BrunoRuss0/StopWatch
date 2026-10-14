import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "users.json");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function cargarUsuarios() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function guardarUsuarios(usuarios) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(usuarios, null, 2));
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

const fallos = new Map();
const VENTANA_MS = 60_000;
const MAX_FALLOS = 8;

function estaBloqueado(clave) {
  const ahora = Date.now();
  const lista = (fallos.get(clave) || []).filter((t) => ahora - t < VENTANA_MS);
  fallos.set(clave, lista);
  return lista.length >= MAX_FALLOS;
}

function registrarFallo(clave) {
  const lista = fallos.get(clave) || [];
  lista.push(Date.now());
  fallos.set(clave, lista);
}

app.post("/api/login", (req, res) => {
  const usuario = String(req.body.usuario || "").trim();
  const password = String(req.body.password || "");

  if (!/^[\w.@+-]{3,40}$/.test(usuario)) {
    return res.status(400).json({
      error:
        "Usuario inválido (3 a 40 caracteres: letras, números y . _ @ + -).",
    });
  }
  if (password.length < 4 || password.length > 100) {
    return res
      .status(400)
      .json({ error: "La contraseña debe tener entre 4 y 100 caracteres." });
  }

  const clave = usuario.toLowerCase();
  const claveIntentos = `${req.ip}|${clave}`;

  if (estaBloqueado(claveIntentos)) {
    return res
      .status(429)
      .json({ error: "Demasiados intentos. Esperá un minuto." });
  }

  const usuarios = cargarUsuarios();
  const existente = usuarios[clave];

  if (!existente) {
    const { salt, hash } = hashPassword(password);
    usuarios[clave] = { nombre: usuario, salt, hash, creado: Date.now() };
    guardarUsuarios(usuarios);
    return res.json({ usuario, nuevo: true });
  }

  const { hash } = hashPassword(password, existente.salt);
  const ok = crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(existente.hash, "hex")
  );

  if (!ok) {
    registrarFallo(claveIntentos);
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }

  res.json({ usuario: existente.nombre, nuevo: false });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Servidor en http://localhost:${PORT}`)
);
