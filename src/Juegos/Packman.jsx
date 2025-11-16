import React, { useState, useEffect, useRef } from "react";
import "./Packman.css";
import Reseña from "../Reseña";

const TAM = 15;

const MAPA_BASE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,1,1,2,1,1,2,1,2,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function Packman() {
  const [mapa, setMapa] = useState(MAPA_BASE.map(f => [...f]));
  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [fantasma, setFantasma] = useState({ x: 13, y: 11 });
  const [dir, setDir] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [mejorPuntaje, setMejorPuntaje] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  const dirRef = useRef(dir);
  useEffect(() => { dirRef.current = dir; }, [dir]);

  // 🟢 Nueva verificación de sesión (usa cookies, no localStorage)
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/perfil", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUsuarioActivo(data.usuario);

          // Si en tu BD guardás mejores puntajes por juego:
          if (data.usuario?.puntajes?.pacman) {
            setMejorPuntaje(data.usuario.puntajes.pacman);
          }
        } else {
          setUsuarioActivo(null);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      }
    };

    verificarSesion();
  }, []);

  // 🔵 Guardar puntaje en BD
  const guardarPuntajeBD = async (puntaje) => {
    try {
      const respuesta = await fetch("http://localhost:5000/api/partida/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          juegoId: 2,  // Pacman
          puntuacion: puntaje
        })
      });

      const data = await respuesta.json();
      console.log("Guardado:", data);
    } catch (error) {
      console.log("Error guardando puntaje", error);
    }
  };

  // 🔥 Centralización de final de partida
  const finalizarPartida = (mensaje) => {
    alert(`${mensaje} Puntaje final: ${puntaje}`);
    guardarPuntajeBD(puntaje);
    reiniciar();
  };

  // Movimiento Pacman
  useEffect(() => {
    const i = setInterval(() => mover(), 200);
    return () => clearInterval(i);
  });

  // Movimiento fantasma
  useEffect(() => {
    const i = setInterval(() => moverFantasma(), 300);
    return () => clearInterval(i);
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowUp") setDir("ARRIBA");
      if (e.key === "ArrowDown") setDir("ABAJO");
      if (e.key === "ArrowLeft") setDir("IZQUIERDA");
      if (e.key === "ArrowRight") setDir("DERECHA");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const mover = () => {
    if (!dirRef.current) return;
    let nuevaX = pos.x;
    let nuevaY = pos.y;

    if (dirRef.current === "ARRIBA") nuevaY--;
    if (dirRef.current === "ABAJO") nuevaY++;
    if (dirRef.current === "IZQUIERDA") nuevaX--;
    if (dirRef.current === "DERECHA") nuevaX++;

    if (mapa[nuevaY][nuevaX] === 1) return;

    // Comer punto
    if (mapa[nuevaY][nuevaX] === 2) {
      const nuevoMapa = mapa.map(fila => [...fila]);
      nuevoMapa[nuevaY][nuevaX] = 0;
      setMapa(nuevoMapa);

      setPuntaje(p => p + 10);

      const quedan = nuevoMapa.some(f => f.includes(2));
      if (!quedan) {
        finalizarPartida("🎉 ¡Ganaste!");
        return;
      }
    }

    // Fantasma
    if (nuevaX === fantasma.x && nuevaY === fantasma.y) {
      finalizarPartida("💀 ¡Perdiste!");
      return;
    }

    setPos({ x: nuevaX, y: nuevaY });
  };

  const moverFantasma = () => {
    const dirs = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];
    const { dx, dy } = dirs[(Math.random() * 4) | 0];

    const nx = fantasma.x + dx;
    const ny = fantasma.y + dy;

    if (mapa[ny] && mapa[ny][nx] !== 1) {
      setFantasma({ x: nx, y: ny });
    }
  };

  const reiniciar = () => {
    setMapa(MAPA_BASE.map(f => [...f]));
    setPos({ x: 1, y: 1 });
    setFantasma({ x: 13, y: 11 });
    setDir("DERECHA");
    setPuntaje(0);
  };

  return (
    <div className="packman-container">
      <h1>🟡 Pac-Man</h1>

      {usuarioActivo ? (
        <p>Jugador: 👤 {usuarioActivo.NombreUsuario}</p>
      ) : (
        <p style={{ color: "red" }}>⚠️ Iniciá sesión para guardar tu puntaje</p>
      )}

      <p>Puntaje actual: {puntaje}</p>
      <p>🏆 Mejor puntaje: {mejorPuntaje}</p>

      <div className="tablero-packman">
        {mapa.map((fila, y) => (
          <div key={y} className="fila">
            {fila.map((celda, x) => {
              const esPacman = pos.x === x && pos.y === y;
              const esFantasma = fantasma.x === x && fantasma.y === y;
              return (
                <div
                  key={x}
                  className={`celda-packman ${
                    celda === 1 ? "muro" : celda === 2 ? "punto" : ""
                  } ${esPacman ? "pacman" : ""} ${esFantasma ? "fantasma" : ""}`}
                ></div>
              );
            })}
          </div>
        ))}
      </div>

      <button className="reiniciar-btn" onClick={reiniciar}>
        🔁 Reiniciar juego
      </button>

      <Reseña juego="pacman" />
    </div>
  );
}

export default Packman;
