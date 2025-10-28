import React, { useState, useEffect } from "react";
import "./ModalUsuario.css";

const ModalUsuario = ({ isOpen, onClose, onLoginSuccess }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState("login"); // "login" o "registro"
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const respuesta = await fetch("/usuarios.json");
        const data = await respuesta.json();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar usuarios.json:", error);
      }
    };
    cargarUsuarios();
  }, []);

  const guardarUsuarios = async (nuevosUsuarios) => {
    // En frontend puro no se puede escribir en archivos locales directamente
    // Esto es solo temporal, simula el guardado local
    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
    setUsuarios(nuevosUsuarios);
  };

  const manejarRegistro = async () => {
  if (!nombre || !password) {
    setMensaje("Completá todos los campos.");
    return;
  }
  if (usuarios.find((u) => u.nombre === nombre)) {
    setMensaje("Ese usuario ya existe.");
    return;
  }

  const nuevoUsuario = {
    nombre,
    password,
    puntajes: {
      pacman: 0,
Vibora:0,
    },
  };

  const nuevosUsuarios = [...usuarios, nuevoUsuario];
  await guardarUsuarios(nuevosUsuarios);
  setMensaje("Usuario registrado correctamente ✅");

  // 🔹 Loguear automáticamente
  localStorage.setItem("usuarioActivo", JSON.stringify(nuevoUsuario));
  onLoginSuccess(nuevoUsuario);
  onClose();
};


  const manejarLogin = () => {
  const usuario = usuarios.find(
    (u) => u.nombre === nombre && u.password === password
  );

  if (usuario) {
    setMensaje("Inicio de sesión exitoso ✅");
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario)); // 🔹 Guarda el usuario logueado
    onLoginSuccess(usuario);
    onClose();
  } else {
    setMensaje("Usuario o contraseña incorrectos ❌");
  }
};

  if (!isOpen) return null;

  return (
    <div className="modalUsuario-overlay">
      <div className="modalUsuario">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2>{modo === "login" ? "Iniciar Sesión" : "Registrarse"}</h2>

        <input
          type="text"
          placeholder="Nombre de usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="modalUsuario-btn"
          onClick={modo === "login" ? manejarLogin : manejarRegistro}
        >
          {modo === "login" ? "Entrar" : "Registrar"}
        </button>

        <p className="mensaje">{mensaje}</p>

        <p className="alternar">
          {modo === "login" ? (
            <>
              ¿No tenés cuenta?{" "}
              <span onClick={() => setModo("registro")}>Registrate</span>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{" "}
              <span onClick={() => setModo("login")}>Iniciá sesión</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ModalUsuario;
