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
  const [pos, setPos] = useState({ x: 1, y: 1 }); // Pac-Man
  const [fantasma, setFantasma] = useState({ x: 13, y: 11 }); // 👾 enemigo
  const [dir, setDir] = useState("DERECHA");
  const [puntaje, setPuntaje] = useState(0);
  const [mejorPuntaje, setMejorPuntaje] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const dirRef = useRef(dir);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  // 🔹 Cargar usuario activo y su mejor puntaje
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (user) {
      setUsuarioActivo(user);
      setMejorPuntaje(user.puntajes?.pacman || 0);
    }
  }, []);

  // 🔹 Movimiento del jugador
  useEffect(() => {
    const intervalo = setInterval(() => mover(), 200);
    return () => clearInterval(intervalo);
  });

  // 🔹 Movimiento del fantasma (aleatorio)
  useEffect(() => {
    const intervaloFantasma = setInterval(() => moverFantasma(), 300);
    return () => clearInterval(intervaloFantasma);
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

  // 🟡 Movimiento de Pac-Man
  const mover = () => {
    let nuevaX = pos.x;
    let nuevaY = pos.y;

    if (dirRef.current === "ARRIBA") nuevaY--;
    if (dirRef.current === "ABAJO") nuevaY++;
    if (dirRef.current === "IZQUIERDA") nuevaX--;
    if (dirRef.current === "DERECHA") nuevaX++;

    if (nuevaX < 0 || nuevaX >= TAM || nuevaY < 0 || nuevaY >= TAM) return;
    if (mapa[nuevaY][nuevaX] === 1) return; // muro 

    // Comer punto
    if (mapa[nuevaY][nuevaX] === 2) {
      const nuevoMapa = mapa.map(fila => [...fila]);
      nuevoMapa[nuevaY][nuevaX] = 0;
      setMapa(nuevoMapa);

      const nuevoPuntaje = puntaje + 10;
      setPuntaje(nuevoPuntaje);

      // 🏆 Guardar mejor puntaje si supera el anterior
      if (usuarioActivo) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const idx = usuarios.findIndex(u => u.nombre === usuarioActivo.nombre);
        if (idx !== -1) {
          if (nuevoPuntaje > (usuarios[idx].puntajes?.pacman || 0)) {
            usuarios[idx].puntajes.pacman = nuevoPuntaje;
            setMejorPuntaje(nuevoPuntaje);
          }
          localStorage.setItem("usuarios", JSON.stringify(usuarios));
          localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[idx]));
          setUsuarioActivo(usuarios[idx]);
        }
      }

      // Si no quedan puntos, reiniciar
      const quedanPuntos = nuevoMapa.some(fila => fila.includes(2));
      if (!quedanPuntos) {
        alert("🎉 ¡Ganaste!");
        reiniciar();
      }
    }

    // 💀 Si choca con el fantasma → pierde
    if (nuevaX === fantasma.x && nuevaY === fantasma.y) {
      alert("💀 ¡Perdiste! El fantasma te atrapó");
      reiniciar();
      return;
    }

    setPos({ x: nuevaX, y: nuevaY });
  };

  // 👾 Movimiento aleatorio del fantasma
  const moverFantasma = () => {
    const direcciones = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
    ];
    const { dx, dy } = direcciones[Math.floor(Math.random() * direcciones.length)];

    const nuevaX = fantasma.x + dx;
    const nuevaY = fantasma.y + dy;

    if (
      nuevaX >= 0 &&
      nuevaX < TAM &&
      nuevaY >= 0 &&
      nuevaY < TAM &&
      mapa[nuevaY][nuevaX] !== 1
    ) {
      setFantasma({ x: nuevaX, y: nuevaY });

      // Si toca a Pac-Man → pierde
      if (nuevaX === pos.x && nuevaY === pos.y) {
        alert("💀 ¡Perdiste! El fantasma te atrapó");
        reiniciar();
      }
    }
  };

  const reiniciar = () => {
    setMapa(MAPA_BASE.map(fila => [...fila]));
    setPos({ x: 1, y: 1 });
    setFantasma({ x: 13, y: 11 });
    setDir("DERECHA");
    setPuntaje(0);
  };

  return (
    <div className="packman-container">
      <h1>🟡 Pac-Man</h1>
      {usuarioActivo ? (
        <p>Jugador: 👤 {usuarioActivo.nombre}</p>
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
