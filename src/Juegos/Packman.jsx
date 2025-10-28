import React, { useState, useEffect, useRef } from "react";
import "./Packman.css";

const TAM = 15;

const MAPA_BASE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function Packman() {
  const [mapa, setMapa] = useState(MAPA_BASE.map(fila => [...fila]));
  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [dir, setDir] = useState("DERECHA");
  const [puntaje, setPuntaje] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const dirRef = useRef(dir);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  // Cargar usuario activo y su puntaje
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (user) {
      setUsuarioActivo(user);
      setPuntaje(user.puntajes?.pacman || 0);
    }
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => mover(), 200);
    return () => clearInterval(intervalo);
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") setDir("ARRIBA");
      if (e.key === "ArrowDown") setDir("ABAJO");
      if (e.key === "ArrowLeft") setDir("IZQUIERDA");
      if (e.key === "ArrowRight") setDir("DERECHA");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const mover = () => {
    let nuevaX = pos.x;
    let nuevaY = pos.y;

    if (dirRef.current === "ARRIBA") nuevaY--;
    if (dirRef.current === "ABAJO") nuevaY++;
    if (dirRef.current === "IZQUIERDA") nuevaX--;
    if (dirRef.current === "DERECHA") nuevaX++;

    if (nuevaX < 0 || nuevaX >= TAM || nuevaY < 0 || nuevaY >= TAM) return;
    if (mapa[nuevaY][nuevaX] === 1) return;

    if (mapa[nuevaY][nuevaX] === 2) {
      const nuevoMapa = mapa.map(fila => [...fila]);
      nuevoMapa[nuevaY][nuevaX] = 0;
      setMapa(nuevoMapa);
      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);

      // 🔹 Guardar el puntaje del usuario activo
      if (usuarioActivo) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const idx = usuarios.findIndex(u => u.nombre === usuarioActivo.nombre);
        if (idx !== -1) {
          usuarios[idx].puntajes.pacman = nuevoPuntaje;
          localStorage.setItem("usuarios", JSON.stringify(usuarios));
          localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[idx]));
          setUsuarioActivo(usuarios[idx]);
        }
      }

      const quedanPuntos = nuevoMapa.some(fila => fila.includes(2));
      if (!quedanPuntos) {
        setTimeout(() => reiniciar(), 1000);
      }
    }

    setPos({ x: nuevaX, y: nuevaY });
  };

  const reiniciar = () => {
    setMapa(MAPA_BASE.map(fila => [...fila]));
    setPos({ x: 1, y: 1 });
    setDir("DERECHA");
    setPuntaje(0);

    if (usuarioActivo) {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const idx = usuarios.findIndex(u => u.nombre === usuarioActivo.nombre);
      if (idx !== -1) {
        usuarios[idx].puntajes.pacman = 0;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[idx]));
        setUsuarioActivo(usuarios[idx]);
      }
    }
  };

  return (
    <div className="packman-container">
      <h1>🟡 Pac-Man</h1>
      {usuarioActivo ? (
        <p>Jugador: 👤 {usuarioActivo.nombre}</p>
      ) : (
        <p style={{ color: "red" }}>⚠️ Iniciá sesión para guardar tu puntaje</p>
      )}
      <p>Puntaje: {puntaje}</p>

      <div className="tablero-packman">
        {mapa.map((fila, y) => (
          <div key={y} className="fila">
            {fila.map((celda, x) => {
              const esPacman = pos.x === x && pos.y === y;
              return (
                <div
                  key={x}
                  className={`celda-packman ${
                    celda === 1 ? "muro" : celda === 2 ? "punto" : ""
                  } ${esPacman ? "pacman" : ""}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="reiniciar-btn" onClick={reiniciar}>
        🔁 Reiniciar juego
      </button>
    </div>
  );
}

export default Packman;
