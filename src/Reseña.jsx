import React, { useEffect, useState } from "react";
import './Reseña.css';

export default function Reseñas({ juegoId }) {
  const [reseñas, setReseñas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [miReseña, setMiReseña] = useState(null);
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000";

  // ⭐ Renderizado de estrellas amarillas
// ⭐ Renderizado de estrellas amarillas CORREGIDO
const renderStars = (value, clickable = false) => {
  return (
    <div className="estrellas-container">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;

        return (
          <span
            key={star}
            className={`estrella ${filled ? "filled" : ""}`}
            onClick={() => {
              if (clickable) setPuntaje(star);
            }}
            style={{
              cursor: clickable ? "pointer" : "default",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

  // Cargar reseñas del backend
  useEffect(() => {
    const cargarReseñas = async () => {
      try {
        setCargando(true);

        const response = await fetch(`${API_URL}/api/resena/${juegoId}`, {
          credentials: "include",
        });

        const text = await response.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("El backend no devolvió JSON válido: " + text);
        }

        if (!response.ok) throw new Error(data.error || "Error desconocido");

        setReseñas(data.reseñas);
        setPromedio(data.promedio);
        setMiReseña(data.miReseña);

        if (data.miReseña) {
          setPuntaje(data.miReseña.puntaje);
          setComentario(data.miReseña.comentario || "");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarReseñas();
  }, [juegoId]);

  // Guardar reseña
  const guardarReseña = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/resena/${juegoId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ puntaje, comentario }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error guardando reseña");

      // Actualiza datos en pantalla
      setMiReseña(data.reseña);

      const otras = reseñas.filter((r) => r.id !== data.reseña.id);
      const nuevas = [data.reseña, ...otras];
      setReseñas(nuevas);

      const nuevoProm = nuevas.reduce((acc, r) => acc + r.puntaje, 0) / nuevas.length;
      setPromedio(nuevoProm.toFixed(1));
    } catch (err) {
      setError(err.message);
    }
  };

  if (cargando) return <div style={{ textAlign: "center" }}>Cargando reseñas...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>Error: {error}</div>;

  return (
    <div className="reseña-container">

      <h2 className="reseña-titulo">Reseñas</h2>

      {/* ⭐ PROMEDIO – corregido, ya no tiene <div> dentro de <p> */}
      <div className="reseña-promedio">
        <span>Promedio:</span>
        {renderStars(Math.round(promedio))}
        <span>({promedio})</span>
      </div>

      {/* Formulario */}
      <h3>{miReseña ? "Editar tu reseña" : "Agregar reseña"}</h3>

      <form className="reseña-formulario" onSubmit={guardarReseña}>
        <label>Puntaje:</label>
        {renderStars(puntaje, true)}

        <label>Comentario:</label>
        <textarea
          placeholder="Contanos qué te pareció (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />

        <button type="submit">
          {miReseña ? "Actualizar" : "Guardar"}
        </button>
      </form>

      {/* Mi reseña */}
      {miReseña && (
        <div className="mi-reseña">
          <div className="reseña-usuario">Tu reseña:</div>
          <div>Puntaje: {renderStars(miReseña.puntaje)}</div>
          <div className="reseña-comentario">{miReseña.comentario}</div>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="reseña-lista">
        {reseñas.filter((r) => !miReseña || r.id !== miReseña.id).length === 0 ? (
          <div className="reseña-vacia">No hay reseñas aún</div>
        ) : (
          reseñas
            .filter((r) => !miReseña || r.id !== miReseña.id)
            .map((r) => (
              <div key={r.id} className="reseña-item">
                <div className="reseña-usuario">
                  {r.Usuario?.NombreUsuario || "Anónimo"}
                </div>
                <div>Puntaje: {renderStars(r.puntaje)}</div>
                <div className="reseña-comentario">{r.comentario}</div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
