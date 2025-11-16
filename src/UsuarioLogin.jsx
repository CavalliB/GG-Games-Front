import React, { useState, useEffect } from "react";
import ModalUsuario from "./ModalUsuario";

const UsuarioLogin = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const manejarLoginSuccess = (user) => {
    setUsuario(user);
    window.location.reload();
  };

  // Verificar sesión activa al cargar la página
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/perfil", {
          credentials: "include", // envía cookies
        });

        if (res.ok) {
          const data = await res.json();
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      } finally {
        setCargando(false);
      }
    };
    verificarSesion();
  }, []);

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUsuario(null);
      }
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <nav className="nav">
      <h1 className="logo">GG Games</h1>

      <div className="nav-right">
        {usuario ? (
          <>
            <span className="usuario-logueado">👤 {usuario.NombreUsuario}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
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
