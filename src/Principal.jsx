import React from "react";
import { useNavigate } from "react-router-dom";
import "./Principal.css";

function Principal() {
  const navigate = useNavigate();

  const juegos = [
    {
      id: 1,
      nombre: "Pac-Man",
      imagen:
        "https://upload.wikimedia.org/wikipedia/en/5/59/Pac-man.png",
      ruta: "/packman",
    },
    {
      id: 2,
      nombre: "Viborita",
      imagen:
        "https://play-lh.googleusercontent.com/izLRsTSIBTQiM7cNsNNbgbJtnFKTCCa8SFBU_AJ5V921eFzZpmxVl9aYARyhdxXF7kg=w540-h302-rw",
      ruta: "/vibora",
    },
    {
          id: 3,
      nombre: "Cara o Cruz",
      imagen:
        "https://cdn-icons-png.flaticon.com/512/992/992700.png",
      ruta: "/caraocruz",
    },
    
  ];

  return (
    <main className="principal-container">
      <h1 className="titulo">Jueguitos:</h1>
      <div className="grid-juegos">
        {juegos.map((juego) => (
          <div
            key={juego.id}
            className="card-juego"
            onClick={() => navigate(juego.ruta)}
          >
            <img
              src={juego.imagen}
              alt={juego.nombre}
              className="imagen-juego"
            />
            <p className="nombre-juego">{juego.nombre}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Principal;
