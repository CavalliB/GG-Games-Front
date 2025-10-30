import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vibora.css";
import Reseña from "../Reseña";


export default function Vibora() {
  const navigate = useNavigate();
  const [resetKey, setResetKey] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [mejorPuntaje, setMejorPuntaje] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // 🔹 Cargar usuario activo
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (user) {
      setUsuarioActivo(user);
      setMejorPuntaje(user.puntajes?.vibora || 0);
    }
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    const box = 20;
    let snake = [{ x: 9 * box, y: 10 * box }];
    let direction = null;
    let food = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
    };

    document.addEventListener("keydown", directionHandler);

    function directionHandler(event) {
      if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
      else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
      else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
      else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    }

    function collision(head, array) {
      return array.some((segment) => head.x === segment.x && head.y === segment.y);
    }

    function drawGame() {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
      }

      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, box, box);

      let snakeX = snake[0].x;
      let snakeY = snake[0].y;

      if (direction === "LEFT") snakeX -= box;
      if (direction === "UP") snakeY -= box;
      if (direction === "RIGHT") snakeX += box;
      if (direction === "DOWN") snakeY += box;

      // 🟢 Comer comida
      if (snakeX === food.x && snakeY === food.y) {
        setPuntaje((prev) => prev + 10); // +10 puntos
        food = {
          x: Math.floor(Math.random() * 19 + 1) * box,
          y: Math.floor(Math.random() * 19 + 1) * box,
        };
      } else {
        snake.pop();
      }

      const newHead = { x: snakeX, y: snakeY };

      // 💀 Perder si choca
      if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
      ) {
        clearInterval(intervalRef.current);
        alert("💀 ¡Perdiste!");
        actualizarMejorPuntaje();
        return;
      }

      snake.unshift(newHead);
    }

    intervalRef.current = setInterval(drawGame, 100);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("keydown", directionHandler);
    };
  }, [resetKey]);

  // 🔹 Actualizar mejor puntaje del usuario en localStorage
  const actualizarMejorPuntaje = () => {
    if (!usuarioActivo) return;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = usuarios.findIndex(u => u.nombre === usuarioActivo.nombre);
    if (idx !== -1) {
      const nuevoPuntaje = Math.max(puntaje, usuarios[idx].puntajes?.vibora || 0);
      usuarios[idx].puntajes.vibora = nuevoPuntaje;
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[idx]));
      setUsuarioActivo(usuarios[idx]);
      setMejorPuntaje(nuevoPuntaje);
    }
  };

  return (
    <div className="vibora-container">
      <h1>🐍 Juego de la Vibora</h1>
      {usuarioActivo ? (
        <p>Jugador: 👤 {usuarioActivo.nombre}</p>
      ) : (
        <p style={{ color: "red" }}>⚠️ Iniciá sesión para guardar tu puntaje</p>
      )}
      <p>Puntaje actual: {puntaje}</p>
      <p>🏆 Mejor puntaje: {mejorPuntaje}</p>

      <canvas id="gameCanvas" width="400" height="400"></canvas>
      <div className="button-container">
        <button
          className="reiniciar-btn"
          onClick={() => {
            actualizarMejorPuntaje();
            setResetKey(prev => prev + 1);
            setPuntaje(0);
          }}
        >
          🔁 Reiniciar
        </button>
        <button className="volver-btn" onClick={() => navigate("/")}>
          ⬅️ Volver al inicio
        </button>
      </div>
       <Reseña juego="vibora" />
    </div>
  );
}
