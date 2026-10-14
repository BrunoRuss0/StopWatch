import { loginUser, continueAsGuest } from "../utils/auth.js";

export class Login extends Phaser.Scene {
  constructor() {
    super({ key: "Login" });
  }

  preload() {
  }

  create() {
    const gameWidth = this.scale.width;
    const gameHeight = this.scale.height;

    this.cameras.main.setBackgroundColor("#1b1b1b");
    this.input.setDefaultCursor("default");

    this.add
      .text(gameWidth / 2, 70, "INICIAR SESIÓN", {
        fontSize: "40px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0);

    const formHtml = `
      <div style="display:flex; flex-direction:column; gap:12px; width:280px; font-family:sans-serif;">
        <input id="loginUser" type="text" placeholder="Usuario" autocomplete="username"
          style="padding:10px; font-size:18px; border-radius:4px; border:none;" />
        <input id="loginPass" type="password" placeholder="Contraseña" autocomplete="current-password"
          style="padding:10px; font-size:18px; border-radius:4px; border:none;" />
        <div id="loginError" style="color:#ff6b6b; font-size:14px; min-height:18px; text-align:center;"></div>
      </div>
    `;

    this.formElement = this.add
      .dom(gameWidth / 2, 200)
      .createFromHTML(formHtml);

    this.formElement.addListener("keydown");
    this.formElement.on("keydown", (event) => {
      if (event.key === "Enter") {
        this.intentarLogin();
      }
    });

    // BOTON INICIAR SESION----------------------------------------------------
    const loginBoton = this.add
      .text(gameWidth / 2 - 150, 340, "INICIAR SESIÓN", {
        fontSize: "22px",
        color: "#000000",
        backgroundColor: "#ff3636",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5, 0);
    loginBoton.setInteractive({ useHandCursor: true });
    loginBoton.on("pointerdown", () => this.intentarLogin());
    loginBoton.on("pointerover", () =>
      loginBoton.setStyle({ backgroundColor: "#f7ebeb" })
    );
    loginBoton.on("pointerout", () =>
      loginBoton.setStyle({ backgroundColor: "#ff3636" })
    );

    // BOTON SEGUIR SIN CUENTA--------------------------------------------------
    const invitadoBoton = this.add
      .text(gameWidth / 2 + 150, 340, "SEGUIR SIN CUENTA", {
        fontSize: "22px",
        color: "#000000",
        backgroundColor: "#ff3636",
        padding: { left: 20, right: 20, top: 10, bottom: 10 },
      })
      .setOrigin(0.5, 0);
    invitadoBoton.setInteractive({ useHandCursor: true });
    invitadoBoton.on("pointerdown", () => {
      continueAsGuest();
      this.scene.start("MainMenu");
    });
    invitadoBoton.on("pointerover", () =>
      invitadoBoton.setStyle({ backgroundColor: "#f7ebeb" })
    );
    invitadoBoton.on("pointerout", () =>
      invitadoBoton.setStyle({ backgroundColor: "#ff3636" })
    );
  }

  intentarLogin() {
    const userInput = document.getElementById("loginUser");
    const passInput = document.getElementById("loginPass");
    const errorDiv = document.getElementById("loginError");

    const usuario = userInput ? userInput.value.trim() : "";
    const password = passInput ? passInput.value : "";

    if (!usuario || !password) {
      if (errorDiv) errorDiv.textContent = "Completá usuario y contraseña.";
      return;
    }

    if (errorDiv) errorDiv.textContent = "Conectando...";

    loginUser(usuario, password)
      .then(() => {
        this.scene.start("MainMenu");
      })
      .catch((err) => {
        if (errorDiv) {
          errorDiv.textContent = err.message || "No se pudo iniciar sesión.";
        }
      });
  }

  update() {}
}