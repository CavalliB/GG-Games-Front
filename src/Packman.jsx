import React, { useState, useEffect, useRef } from "react";
import "./Packman.css";

const TAM = 15; // tamaño del tablero

// 0 = vacío, 1 = muro, 2 = punto
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
  const dirRef = useRef(dir);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  // Movimiento automático
  useEffect(() => {
    const intervalo = setInterval(() => mover(), 200);
    return () => clearInterval(intervalo);
  });

  // Controles
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

    // bordes o muros
const mover = (dx, dy) => {
  const nx = pacman.x + dx;
  const ny = pacman.y + dy;

  // Si hay pared, no se mueve
  if (mapa[ny][nx] === "#") return;

  // Si hay comida, la come
  if (mapa[ny][nx] === ".") {
    mapa[ny][nx] = " ";
    setPuntos(puntos + 10);
  }

  // Actualiza la posición aunque no haya comida
  setPacman({ x: nx, y: ny });
};
    if (nuevaX < 0 || nuevaX >= TAM || nuevaY < 0 || nuevaY >= TAM) return;
    if (mapa[nuevaY][nuevaX] === 1) return; // muro 

    // Comer punto
    if (mapa[nuevaY][nuevaX] === 2) {
      const nuevoMapa = mapa.map(fila => [...fila]);
      nuevoMapa[nuevaY][nuevaX] = 0;
      setMapa(nuevoMapa);
      setPuntaje((p) => p + 10);

      // Si no quedan puntos, reiniciar
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
  };

  return (
    <div className="packman-container">
      <h1>🟡 Pac-Man</h1>
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
    </div>
  );
}

export default Packman;
