import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./Principal.jsx";
import Vibora from "./Vibora.jsx";
import Packman from "./Packman.jsx";
import CaraoCruz from "./CaraoCruz.jsx";
import Nav from "./Nav.jsx";
import UsuarioLogin from "./UsuarioLogin.jsx";
import "./App.css";

function App() {
  return (
    <Router>
        <Nav />

      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<Principal />} />
            <Route path="/vibora" element={<Vibora />} />
            <Route path="/packman" element={<Packman />} />
            <Route path="/caraocruz" element={<CaraoCruz />} />
            <Route path="/perfil" element={<UsuarioLogin />} />
            {/* Agregar mas juegos con esto */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
