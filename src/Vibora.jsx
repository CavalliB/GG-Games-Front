import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Vibora.css";

export default function Vibora() {
  const navigate = useNavigate();

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

      if (snakeX === food.x && snakeY === food.y) {
        food = {
          x: Math.floor(Math.random() * 19 + 1) * box,
          y: Math.floor(Math.random() * 19 + 1) * box,
        };
      } else {
        snake.pop();
      }

      const newHead = { x: snakeX, y: snakeY };

      if (
        snakeX < 0 ||
        snakeY < 0 ||
        snakeX >= canvas.width ||
        snakeY >= canvas.height ||
        collision(newHead, snake)
      ) {
        clearInterval(game);
        alert("¡Perdiste!");
      }

      snake.unshift(newHead);
    }

    const game = setInterval(drawGame, 100);

    return () => {
      clearInterval(game);
      document.removeEventListener("keydown", directionHandler);
    };
  }, []);

  return (
    <div className="vibora-container">
      <h1>🐍 Juego de la Vibora</h1>
      <canvas id="gameCanvas" width="400" height="400"></canvas>
      <button className="volver-btn" onClick={() => navigate("/")}>
        ⬅️ Volver al inicio
      </button>
    </div>
  );
}
