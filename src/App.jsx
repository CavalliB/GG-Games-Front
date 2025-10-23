import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from "./Principal.jsx";
import Vibora from "./Vibora.jsx";
import Nav from "./Nav.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Principal />} />
            <Route path="/vibora" element={<Vibora />} />
            {/* Agregar mas juegos con esto */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
