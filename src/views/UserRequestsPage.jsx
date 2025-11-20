import Sidebar from "../components/Sidebar";
import "../UserRequests.css";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UsuarioSolicitudesPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(null); 
  const [selectedRow, setSelectedRow] = useState(null);

  const solicitudes = [
    { ref: "#4566675", id: "602340234", nombre: "Heriberto Gómez" },
    { ref: "#4566675", id: "602340234", nombre: "Juan Gómez" },
    { ref: "#4566875", id: "602340234", nombre: "Michael Pérez" },
    { ref: "#4564675", id: "602340234", nombre: "Carlos Monge" },
    { ref: "#4566475", id: "602340234", nombre: "Rodrigo Hernández" },
    { ref: "#4566875", id: "602340234", nombre: "Michael Pérez" },
    { ref: "#4564675", id: "602340234", nombre: "Carlos Monge" },
    { ref: "#4566475", id: "602340234", nombre: "Rodrigo Hernández" },
  ];

  const handleAction = (type) => {
    setShowPopup(type);
    setTimeout(() => setShowPopup(null), 2500);
  };

  return (
    <div className="solicitudes-container">
      <Sidebar />

      <main className="solicitudes-main">


        <button className="btn-back" onClick={() => navigate("/users")}>
          <ArrowBackIcon /> Volver
        </button>

        <div className="search-row">
          <div className="search-bar">
            <input type="text" placeholder="Buscar" />
            <SearchIcon className="search-icon" />
          </div>

          <div className="search-actions">
            <button className="btn-orange">Buscar</button>
            <button className="btn-purple">
              Filtros
            </button>
          </div>
        </div>


        <h1 className="solicitudes-title">Solicitudes de registro</h1>


        <div className="solicitudes-table-container">
          <table className="solicitudes-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Identificación</th>
                <th>Nombre</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {solicitudes.map((s, i) => (
                <tr
                  key={i}
                  className={selectedRow === i ? "selected-row" : ""}
                  onClick={() => setSelectedRow(i)}
                >
                  <td>{s.ref}</td>
                  <td>{s.id}</td>
                  <td>{s.nombre}</td>

                  <td>
                    <button
                      className="btn-accept"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction("ok");
                      }}
                    >
                      Aceptar
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn-reject"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction("no");
                      }}
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {showPopup === "ok" && (
          <div className="popup success">
            Solicitud aprobada <CheckIcon className="icon" />
          </div>
        )}

        {showPopup === "no" && (
          <div className="popup reject">
            Solicitud rechazada <CloseIcon className="icon" />
          </div>
        )}

      </main>
    </div>
  );
}
