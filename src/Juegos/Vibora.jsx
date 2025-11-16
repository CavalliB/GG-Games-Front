import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vibora.css";
import Reseña from "../Reseña";

export default function Vibora() {
  const navigate = useNavigate();
  const [resetKey, setResetKey] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const puntajeRef = useRef(0);
  const [mejorPuntaje, setMejorPuntaje] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const intervalRef = useRef(null);

  // 🔹 Obtener usuario desde cookie (JWT)
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/perfil", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUsuarioActivo(data.usuario);
          setMejorPuntaje(data.usuario.mejorPuntajes?.vibora || 0);
        } else {
          setUsuarioActivo(null);
        }
      } catch (err) {
        console.error("Error obteniendo usuario", err);
        setUsuarioActivo(null);
      }
    };

    cargarUsuario();
  }, []);

  // Guardar puntaje en la BD
  const guardarPuntajeBD = async (puntaje) => {
    if (!usuarioActivo) return; // No guardamos si no hay sesión

    try {
      const respuesta = await fetch("http://localhost:5000/api/partida/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          juegoId: 1,
          puntuacion: puntaje,
        }),
      });

      const data = await respuesta.json();
      console.log("Guardado:", data);
    } catch (error) {
      console.log("Error guardando puntaje", error);
    }
  };

  // ======================= JUEGO ==========================
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
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
      }

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
        puntajeRef.current += 10;
        setPuntaje(puntajeRef.current);

        food = {
          x: Math.floor(Math.random() * 19 + 1) * box,
          y: Math.floor(Math.random() * 19 + 1) * box,
        };
      } else {
        snake.pop();
      }

      const newHead = { x: snakeX, y: snakeY };

      // 💀 Perder
      if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
      ) {
        clearInterval(intervalRef.current);

        alert(`¡Perdiste! Puntaje final: ${puntajeRef.current}`);

        guardarPuntajeBD(puntajeRef.current);

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

  // =========================================================

  return (
    <div className="vibora-container">
      <h1>🐍 Juego de la Vibora</h1>

      {usuarioActivo ? (
        <p>Jugador: 👤 {usuarioActivo.NombreUsuario}</p>
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
            guardarPuntajeBD(puntajeRef.current);
            setResetKey((prev) => prev + 1);
            setPuntaje(0);
            puntajeRef.current = 0;
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
