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
        "https://image.api.playstation.com/vulcan/ap/rnd/202208/0217/bQjnOXn5Qpyr8uOwiayuLBCm.png",
      ruta: "/packman",
    },
    {
      id: 2,
      nombre: "Viborita",
      imagen:
        "https://www.jugandoando.com.ar/wp-content/uploads/como-jugar-a-la-viborita-en-google-1.webp",
      ruta: "/vibora",
    },
    {
          id: 3,
      nombre: "Cara o Cruz",
      imagen:
        "https://tse1.mm.bing.net/th/id/OIP.sy6fra5QIXNf5m5tkMDlpwHaHq?rs=1&pid=ImgDetMain&o=7&rm=3",
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
