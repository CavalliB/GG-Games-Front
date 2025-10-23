import React, { useState } from "react";
import "./CaraOCruz.css";

function CaraOCruz() {
  const [resultado, setResultado] = useState(null);
  const [girando, setGirando] = useState(false);

  const lanzarMoneda = () => {
    setGirando(true);
    setResultado(null);
    setTimeout(() => {
      const random = Math.random() < 0.5 ? "Cara" : "Cruz";
      setResultado(random);
      setGirando(false);
    }, 1000);
  };

  return (
    <div className="caraocruz-container">
      <h1>Cara o Cruz 🪙</h1>
      <div className={`moneda ${girando ? "girando" : ""}`}>
        {resultado && <p>{resultado}</p>}
      </div>
      <button onClick={lanzarMoneda} disabled={girando}>
        Lanzar moneda
      </button>
      {resultado && (
        <p className="mensaje">
          {resultado === "Cara" ? "¡Zafaste, crack!" : "Te toca cebar el mate 😬"}
        </p>
      )}
    </div>
  );
}

export default CaraOCruz;
