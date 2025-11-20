import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../RequestsDetails.css";
import "../TeamRequests.css";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import {
  getSolicitudesPlantilla,
  aprobarSolicitud,
  rechazarSolicitud,
} from "../services/solicitudService";

export default function TeamRequestsPage() {
  const navigate = useNavigate();
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showMessage, setShowMessage] = useState(null);

  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleBack = () => navigate("/teams");

  // 👉 Ahora handleAction llama al backend y actualiza la lista
  const handleAction = async (type) => {
    if (!selectedSolicitud || !selectedSolicitud.id) {
      console.error("No hay solicitud seleccionada o falta id");
      return;
    }

    const id = selectedSolicitud.id;

    try {
      if (type === "ok") {
        await aprobarSolicitud(id);
      } else if (type === "no") {
        await rechazarSolicitud(id);
      }

      // quitar de las listas
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      setFilteredSolicitudes((prev) => prev.filter((s) => s.id !== id));

      // mostrar popup
      setShowMessage(type);
    } catch (err) {
      console.error("Error al procesar la solicitud:", err);
      // aquí podrías mostrar un popup de error si quieres
    } finally {
      // cerrar modal
      setSelectedSolicitud(null);

      // ocultar popup después de 2s
      setTimeout(() => {
        setShowMessage(null);
      }, 2000);
    }
  };

  useEffect(() => {
    getSolicitudesPlantilla()
      .then((data) => {
        setSolicitudes(data);
        setFilteredSolicitudes(data);
      })
      .catch((err) => console.error("Error cargando solicitudes:", err))
      .finally(() => setLoading(false));
  }, []);

  // --- Helpers ---

  const parseReferencia = (ref) => {
    if (!ref) return 0;
    return parseInt(ref.replace("#", ""), 10) || 0;
  };

  const resetFilters = () => {
    setFilteredSolicitudes(solicitudes);
    setSearchTerm("");
  };

  // --- Buscar ---

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setFilteredSolicitudes(solicitudes);
      return;
    }

    const filtradas = solicitudes.filter((s) => {
      const ref = s.referencia?.toLowerCase() || "";
      const dte = s.dte?.toLowerCase() || "";
      const accion = s.accion?.toLowerCase() || "";
      const jugador = s.jugador?.toLowerCase() || "";

      return (
        ref.includes(term) ||
        dte.includes(term) ||
        accion.includes(term) ||
        jugador.includes(term)
      );
    });

    setFilteredSolicitudes(filtradas);
  };

  // --- Filtros ---

  const sortFiltered = (compareFn) => {
    setFilteredSolicitudes((prev) => {
      const copia = [...prev];
      copia.sort(compareFn);
      return copia;
    });
  };

  const handleRefAsc = () => {
    sortFiltered(
      (a, b) => parseReferencia(a.referencia) - parseReferencia(b.referencia)
    );
  };

  const handleRefDesc = () => {
    sortFiltered(
      (a, b) => parseReferencia(b.referencia) - parseReferencia(a.referencia)
    );
  };

  const handleDteAsc = () => {
    sortFiltered((a, b) => (a.dte || "").localeCompare(b.dte || ""));
  };

  const handleDteDesc = () => {
    sortFiltered((a, b) => (b.dte || "").localeCompare(a.dte || ""));
  };

  const handleJugadorAsc = () => {
    sortFiltered((a, b) => (a.jugador || "").localeCompare(b.jugador || ""));
  };

  const handleJugadorDesc = () => {
    sortFiltered((a, b) => (b.jugador || "").localeCompare(a.jugador || ""));
  };

  const handleFilterAccion = (accionClave) => {
    const filtradas = solicitudes.filter((s) => s.accion === accionClave);
    setFilteredSolicitudes(filtradas);
  };

  return (
    <div className="equipos-container">
      <Sidebar />

      <main className="equipos-main">
        <button className="btn-back" onClick={handleBack}>
          <ArrowBackIcon /> Volver
        </button>

        <div className="search-row">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon className="search-icon" />
          </div>

          <div className="search-actions">
            <button className="btn-orange" onClick={handleSearch}>
              Buscar
            </button>

            <div style={{ position: "relative" }}>
              <button
                className="btn-purple"
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                Filtros <FilterListIcon />
              </button>

              {showFilters && (
                <div
                  className="filters-dropdown"
                  style={{
                    position: "absolute",
                    right: 0,
                    marginTop: "8px",
                    backgroundColor: "#2f2f2f",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    minWidth: "220px",
                    zIndex: 10,
                  }}
                >
                  <button
                    className="filter-item"
                    type="button"
                    onClick={resetFilters}
                    style={{ width: "100%", marginBottom: "8px" }}
                  >
                    Quitar filtros
                  </button>

                  <div className="filter-group">
                    <p className="filter-title">Referencia</p>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={handleRefAsc}
                    >
                      Ascendente
                    </button>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={handleRefDesc}
                    >
                      Descendente
                    </button>
                  </div>

                  <div className="filter-group">
                    <p className="filter-title">DTE</p>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={handleDteAsc}
                    >
                      A - Z
                    </button>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={handleDteDesc}
                    >
                      Z - A
                    </button>
                  </div>

                  <div className="filter-group">
                    <p className="filter-title">Jugador</p>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={handleJugadorAsc}
                    >
                      A - Z
                    </button>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={handleJugadorDesc}
                    >
                      Z - A
                    </button>
                  </div>

                  <div className="filter-group">
                    <p className="filter-title">Acción</p>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={() => handleFilterAccion("ELIMINAR")}
                    >
                      Eliminar
                    </button>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={() => handleFilterAccion("AGREGAR")}
                    >
                      Agregar
                    </button>
                    <button
                      className="filter-item"
                      type="button"
                      onClick={() => handleFilterAccion("SUSTITUIR")}
                    >
                      Sustituir
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="equipos-title">Solicitudes Modificación de Plantilla</h1>

        <div className="table-container">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Referencia</th>
                  <th>DTE</th>
                  <th>Acción</th>
                  <th>Jugador involucrado</th>
                  <th>Detalle</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                      Cargando solicitudes...
                    </td>
                  </tr>
                ) : filteredSolicitudes.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                      No hay solicitudes registradas
                    </td>
                  </tr>
                ) : (
                  filteredSolicitudes.map((s) => (
                    <tr
                      key={s.id ?? s.referencia}
                      onClick={() => setSelectedSolicitud(s)}
                    >
                      <td>{s.referencia}</td>
                      <td>{s.dte}</td>
                      <td>{s.accion}</td>
                      <td>{s.jugador}</td>
                      <td className="detail-btn">
                        {s.detalle && s.detalle.trim() !== ""
                          ? s.detalle.length > 40
                            ? s.detalle.slice(0, 40) + "..."
                            : s.detalle
                          : "Sin detalle"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedSolicitud && (
          <div className="delete-modal-overlay">
            <div className="detalle-modal-card">
              <h2>Detalles de solicitud</h2>

              <p>
                <strong>Referencia:</strong> {selectedSolicitud.referencia}
              </p>
              <p>
                <strong>Fecha solicitud:</strong> {selectedSolicitud.fecha}
              </p>
              <p>
                <strong>DTE solicitante:</strong> {selectedSolicitud.dte}
              </p>
              <p>
                <strong>Jugador involucrado:</strong>{" "}
                {selectedSolicitud.jugador}
              </p>
              <p>
                <strong>Acción:</strong> {selectedSolicitud.accion}
              </p>

              <label>
                <strong>Detalle:</strong>
              </label>
              <textarea
                defaultValue={selectedSolicitud.detalle}
                className="detalle-area"
                readOnly
              />

              <div className="acciones">
                <button
                  className="btn-approve"
                  onClick={() => handleAction("ok")}
                >
                  Aprobar
                </button>

                <button
                  className="btn-reject"
                  onClick={() => handleAction("no")}
                >
                  Rechazar
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => setSelectedSolicitud(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {showMessage === "ok" && (
          <div className="popup success">
            <span>Solicitud de modificación aprobada</span>
            <CheckIcon className="icon" />
          </div>
        )}

        {showMessage === "no" && (
          <div className="popup reject">
            <span>Solicitud de modificación rechazada</span>
            <CloseIcon className="icon" />
          </div>
        )}
      </main>
    </div>
  );
}
