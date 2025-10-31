import React, { useState, useEffect } from "react";
import "./Reseña.css";

export default function Reseña({ juego }) {
  const [reseñas, setReseñas] = useState([]);
  const [comentario, setComentario] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    setUsuarioActivo(user);

    const todas = JSON.parse(localStorage.getItem("reseñas")) || [];
    const delJuego = todas.filter(r => r.juego === juego);
    setReseñas(delJuego);
  }, [juego]);

  const handleEnviar = () => {
    if (!usuarioActivo) {
      alert("Debes iniciar sesión para dejar una reseña.");
      return;
    }

    if (comentario.trim() === "") return;

    const nuevaReseña = {
      id: Date.now(),
      usuario: usuarioActivo.nombre,
      juego,
      comentario: comentario.trim(),
      fecha: new Date().toLocaleDateString(),
    };

    const todas = JSON.parse(localStorage.getItem("reseñas")) || [];
    const actualizadas = [...todas, nuevaReseña];
    localStorage.setItem("reseñas", JSON.stringify(actualizadas));
    setReseñas(actualizadas.filter(r => r.juego === juego));
    setComentario("");
  };

  return (
    <div className="reseña-container">
      <h3 className="reseña-titulo">Reseñas del juego</h3>

      <div className="reseña-lista">
        {reseñas.length > 0 ? (
          reseñas.map((r) => (
            <div key={r.id} className="reseña-item">
              <p className="reseña-usuario">👤 {r.usuario}</p>
              <p className="reseña-comentario">“{r.comentario}”</p>
              <p className="reseña-fecha">{r.fecha}</p>
            </div>
          ))
        ) : (
          <p className="reseña-vacia">Aún no hay reseñas para este juego.</p>
        )}
      </div>

      <div className="reseña-formulario">
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escribí tu opinión sobre este juego..."
        ></textarea>
        <button onClick={handleEnviar}>Enviar reseña</button>
      </div>
    </div>
  );
}
