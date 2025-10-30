import { useState, useEffect } from "react";
import "./Reseña.css";

export default function Reseña({ juego }) {
  const [usuario, setUsuario] = useState(null);
  const [texto, setTexto] = useState("");
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (user) {
      setUsuario(user);
      setTexto(user.reseñas?.[juego] || "");
    }
  }, [juego]);

  const guardarReseña = () => {
    if (!usuario) {
      alert("⚠️ Tenés que iniciar sesión para dejar una reseña.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const idx = usuarios.findIndex(u => u.nombre === usuario.nombre);
    if (idx !== -1) {
      usuarios[idx].reseñas = {
        ...usuarios[idx].reseñas,
        [juego]: texto
      };
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarios[idx]));
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2000);
    }
  };

  return (
    <div className="reseña-container">
      <h3>💬 Dejá tu reseña del juego</h3>
      {usuario ? (
        <>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribí qué te pareció el juego..."
          ></textarea>
          <button onClick={guardarReseña}>💾 Guardar</button>
          {guardado && <p className="guardado-msg">✅ Reseña guardada</p>}
        </>
      ) : (
        <p style={{ color: "red" }}>
          Iniciá sesión para dejar tu reseña.
        </p>
      )}
    </div>
  );
}
