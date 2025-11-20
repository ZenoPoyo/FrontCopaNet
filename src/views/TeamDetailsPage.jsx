import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../TeamDetails.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getPlantillaActiva } from "../services/teamService";

export default function TeamDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [jugadores, setJugadores] = useState([]);
  const [loadingJugadores, setLoadingJugadores] = useState(true);

  const handleBack = () => navigate("/teams");

  if (!state) {
    return <p style={{ color: "white" }}>⚠ No hay datos del equipo</p>;
  }

  // 🚀 Cargar plantilla activa desde el backend usando el id del equipo
  useEffect(() => {
    if (!state.id) {
      setJugadores([]);
      setLoadingJugadores(false);
      return;
    }

    setLoadingJugadores(true);

    getPlantillaActiva(state.id)
      .then((data) => {
        console.log("Plantilla activa recibida:", data);
        setJugadores(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error cargando plantilla activa del equipo:", err);
        setJugadores([]);
      })
      .finally(() => setLoadingJugadores(false));
  }, [state.id]);

  const torneos = state.torneos || [];

  return (
    <div className="team-details-container">
      <Sidebar />

      <main className="team-details-main">
        <button className="btn-back" onClick={handleBack}>
          <ArrowBackIcon /> Volver
        </button>

        <h1 className="details-title">Detalles del Equipo</h1>

        <div className="info-grid">
          <p>
            <strong>Identificador:</strong> {state.id}
          </p>
          <p>
            <strong>Nombre del equipo:</strong> {state.nombre}
          </p>
          <p>
            <strong>DTE responsable:</strong> {state.dte}
          </p>
          <p>
            <strong>Estado:</strong> {state.estado}
          </p>
        </div>

        {/* ------------------ PLANTILLA ACTIVA ------------------ */}
        <h2 className="section-title">Plantilla activa</h2>
        <div className="details-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Identificación</th>
                <th>Jugador</th>
                <th>Camiseta</th>
                <th>Posición</th>
              </tr>
            </thead>
            <tbody>
              {loadingJugadores ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 16 }}>
                    Cargando jugadores...
                  </td>
                </tr>
              ) : jugadores.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 16 }}>
                    No hay jugadores en la plantilla activa
                  </td>
                </tr>
              ) : (
                jugadores.map((jugador, i) => (
                  <tr key={jugador.id ?? i}>
                    <td>{i + 1}</td>
                    <td>{jugador.identificacion ?? "N/A"}</td>
                    <td>{jugador.nombre ?? "N/A"}</td>
                    {/* no tenemos campo camiseta en BD -> N/A */}
                    <td>{"N/A"}</td>
                    <td>{jugador.posicion ?? "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ------------------ TORNEOS ASOCIADOS ------------------ */}
        <h2 className="section-title">Torneos Asociados</h2>
        <div className="details-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Torneo</th>
                <th>Estado</th>
                <th>Fecha inicio</th>
                <th>Fecha Fin</th>
              </tr>
            </thead>
            <tbody>
              {torneos.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 16 }}>
                  </td>
                </tr>
              ) : (
                torneos.map((t, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{t.nombre}</td>
                    <td>{t.estado}</td>
                    <td>{t.fechaInicio}</td>
                    <td>{t.fechaFin}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
