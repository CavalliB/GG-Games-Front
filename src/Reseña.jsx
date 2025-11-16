import React, { useEffect, useState } from "react";

export default function Reseñas({ juegoId }) {
  const [reseñas, setReseñas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [miReseña, setMiReseña] = useState(null);
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000"; // Cambiar si tu backend corre en otra URL

  // Función para renderizar estrellas
  const renderStars = (num) => {
    const estrellas = "⭐".repeat(num);
    return estrellas + "☆".repeat(5 - num);
  };

  useEffect(() => {
    const cargarReseñas = async () => {
      try {
        setCargando(true);
        const response = await fetch(`${API_URL}/api/resena/${juegoId}`, {
          credentials: "include", // envía cookies con JWT
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("El backend no devolvió JSON: " + text);
        }

        if (response.ok) {
          setReseñas(data.reseñas);
          setPromedio(data.promedio);
          setMiReseña(data.miReseña);
          if (data.miReseña) {
            setPuntaje(data.miReseña.puntaje);
            setComentario(data.miReseña.comentario || "");
          }
        } else {
          throw new Error(data.error || "Error desconocido");
        }
      } catch (err) {
        console.error("Error cargando reseñas:", err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarReseñas();
  }, [juegoId]);

  const guardarReseña = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/resena/${juegoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // envía cookies con JWT
        body: JSON.stringify({ puntaje, comentario }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error guardando reseña");

      // Actualizar lista y mi reseña
      setMiReseña(data.reseña);
      const otras = reseñas.filter((r) => r.id !== data.reseña.id);
      setReseñas([data.reseña, ...otras]);

      // Recalcular promedio
      const todos = [data.reseña, ...otras];
      const nuevoPromedio = todos.reduce((acc, r) => acc + r.puntaje, 0) / todos.length;
      setPromedio(nuevoPromedio.toFixed(1));
    } catch (err) {
      console.error("Error guardando reseña:", err);
      setError(err.message);
    }
  };

  if (cargando) return <p>Cargando reseñas...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h2>Reseñas del juego</h2>
      <p>Promedio: {renderStars(Math.round(promedio))} ({promedio})</p>

      {/* Formulario para agregar o actualizar reseña */}
      <form onSubmit={guardarReseña} style={{ marginBottom: "20px" }}>
        <h3>{miReseña ? "Editar tu reseña" : "Agregar reseña"}</h3>
        <label>
          Puntaje (1-5):
          <input
            type="number"
            min="1"
            max="5"
            value={puntaje}
            onChange={(e) => setPuntaje(Math.min(5, Math.max(1, Number(e.target.value))))}
          />
        </label>
        <br />
        <label>
          Comentario:
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">{miReseña ? "Actualizar" : "Guardar"}</button>
      </form>

      {/* Mi reseña */}
      {miReseña && (
        <div style={{ border: "1px solid green", padding: "10px", marginBottom: "10px" }}>
          <strong>Tu reseña:</strong>
          <p>Puntaje: {renderStars(miReseña.puntaje)}</p>
          <p>Comentario: {miReseña.comentario}</p>
        </div>
      )}

      {/* Reseñas de otros usuarios */}
      {reseñas.length === 0 ? (
        <p>No hay reseñas aún</p>
      ) : (
        reseñas
          .filter((r) => !miReseña || r.id !== miReseña.id)
          .map((r) => (
            <div key={r.id} style={{ border: "1px solid gray", padding: "10px", marginBottom: "5px" }}>
              <strong>{r.Usuario?.NombreUsuario || "Anónimo"}</strong>
              <p>Puntaje: {renderStars(r.puntaje)}</p>
              <p>Comentario: {r.comentario}</p>
            </div>
          ))
      )}
    </div>
  );
}
