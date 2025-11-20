import Sidebar from "../components/Sidebar";
import "../UserRequests.css";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function UsuarioSolicitudesPage() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(null); 
  const [selectedRow, setSelectedRow] = useState(null);

  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const solicitudesFiltradas = solicitudes.filter(s =>
    s.usuarioId.toString().includes(busqueda.toLowerCase()) ||
    s.identificacion.toLowerCase().includes(busqueda.toLowerCase()) ||
    s.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );


  const cargarSolicitudes = async () => {
    const res = await fetch("http://localhost:8080/api/usuarios/listar", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    setSolicitudes(data.filter(u => u.estado === "PENDIENTE"));
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);



  const procesarSolicitud = async (usuarioId, nuevoEstado) => {

  const res = await fetch(
      `http://localhost:8080/api/usuarios/solicitud/${usuarioId}?estado=${nuevoEstado}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    const msg = await res.text();

    if (res.ok) {
      setShowPopup(nuevoEstado === "ACTIVO" ? "ok" : "no");

      cargarSolicitudes();

      setTimeout(() => setShowPopup(null), 2500);

    } else {
      alert("Error: " + msg);
    }
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
            <input
              type="text"
              placeholder="Buscar por nombre o identificación"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <SearchIcon className="search-icon" />
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
              {solicitudesFiltradas.map((s, i) => (

                <tr
                  key={i}
                  className={selectedRow === i ? "selected-row" : ""}
                  onClick={() => setSelectedRow(i)}
                >
                  <td>{s.usuarioId}</td>        
                  <td>{s.identificacion}</td>
                  <td>{s.nombre}</td>


                  <td>
                    <button
                      className="btn-accept"
                      onClick={(e) => {
                        e.stopPropagation();
                        procesarSolicitud(s.usuarioId, "ACTIVO");
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
                        procesarSolicitud(s.usuarioId, "RECHAZADO");
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
