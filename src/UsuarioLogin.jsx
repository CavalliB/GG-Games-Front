import React, { useState } from "react";
import ModalUsuario from "./ModalUsuario";

const UsuarioLogin = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const manejarLoginSuccess = (user) => {
    setUsuario(user);
  };

  return (
    <nav className="nav">
      <h1 className="logo">GG Games</h1>
      <div className="nav-right">
        {usuario ? (
          <span className="usuario-logueado">👤 {usuario.nombre}</span>
        ) : (
          <button className="btn-usuario" onClick={() => setModalAbierto(true)}>
            Iniciar sesión
          </button>
        )}
      </div>

      <ModalUsuario
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onLoginSuccess={manejarLoginSuccess}
      />
    </nav>
  );
};

export default UsuarioLogin;
