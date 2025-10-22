import React from "react";
import "./Principal.css";

function Principal({ setSeccion }) {
  const juegos = [
    {
      id: 1,
      nombre: "Ping pong retro",
      imagen:
        "https://tse1.mm.bing.net/th/id/OIP.l0VmreyovdydZ_dPHqty9gAAAA?cb=12ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      seccion: "pingpong",
    },
    {
      id: 2,
      nombre: "Viborita",
      imagen:
        "https://play-lh.googleusercontent.com/izLRsTSIBTQiM7cNsNNbgbJtnFKTCCa8SFBU_AJ5V921eFzZpmxVl9aYARyhdxXF7kg=w540-h302-rw",
      seccion: "vibora",
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
            onClick={() => setSeccion(juego.seccion)}
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
