import Sidebar from "../components/Sidebar";
import "../Teams.css";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getEquipos } from "../services/teamService";

export default function TeamsPage() {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [equipos, setEquipos] = useState([]);

  // --- FILTROS ---
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("none");

  // --- BUSCAR ---
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getEquipos()
      .then((data) => setEquipos(data))
      .catch((err) => console.error("Error cargando equipos:", err));
  }, []);

  const openDeleteModal = (teamName) => {
    setSelectedTeam(teamName);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTeam(null);
  };

const FILTER_OPTIONS = [
  { value: "none", label: "Sin filtro" },            // <-- NUEVO
  { value: "id-asc", label: "Identificador (ascendente)" },
  { value: "id-desc", label: "Identificador (descendente)" },
  { value: "nombre-asc", label: "Equipo (A-Z)" },
  { value: "nombre-desc", label: "Equipo (Z-A)" },
  { value: "dte-asc", label: "DTE (A-Z)" },
  { value: "dte-desc", label: "DTE (Z-A)" },
  { value: "estado-activo", label: "Solo ACTIVO" },
  { value: "estado-inactivo", label: "Solo INACTIVO" },
];


  // --- APLICAR BUSQUEDA + FILTROS ---
  const equiposFiltrados = useMemo(() => {
    let data = [...equipos];

    // 1) Buscar por nombre de equipo o DTE
    if (searchQuery && searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      data = data.filter((eq) => {
        const nombre = (eq.nombre || "").toLowerCase();
        const dte = (eq.dte || "").toLowerCase();
        return nombre.includes(term) || dte.includes(term);
      });
    }

    // 2) Aplicar filtro seleccionado (orden / estado)
    switch (selectedFilter) {
      case "id-asc":
        data.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case "id-desc":
        data.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case "nombre-asc":
        data.sort((a, b) =>
          (a.nombre || "").localeCompare(b.nombre || "", "es", {
            sensitivity: "base",
          })
        );
        break;
      case "nombre-desc":
        data.sort((a, b) =>
          (b.nombre || "").localeCompare(a.nombre || "", "es", {
            sensitivity: "base",
          })
        );
        break;
      case "dte-asc":
        data.sort((a, b) =>
          (a.dte || "").localeCompare(b.dte || "", "es", {
            sensitivity: "base",
          })
        );
        break;
      case "dte-desc":
        data.sort((a, b) =>
          (b.dte || "").localeCompare(a.dte || "", "es", {
            sensitivity: "base",
          })
        );
        break;
      case "estado-activo":
        data = data.filter((eq) => eq.estado === "ACTIVO");
        break;
      case "estado-inactivo":
        data = data.filter((eq) => eq.estado === "INACTIVO");
        break;
      case "none":
      default:
        break;
    }

    return data;
  }, [equipos, selectedFilter, searchQuery]);

  // handler de Buscar
  const handleSearch = () => {
    setSearchQuery(searchInput.trim());
  };

  // Para que Enter también busque
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="teams-container">
      <Sidebar />

      <main className="teams-main">
        <div className="search-row">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por equipo o DTE"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <SearchIcon className="search-icon" />
          </div>

          <div className="search-actions">
            <button className="btn-orange" onClick={handleSearch}>
              Buscar
            </button>

            {/* BOTÓN FILTROS + DROPDOWN */}
            <div className="filters-wrapper" style={{ position: "relative" }}>
              <button
                className="btn-purple"
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                Filtros
              </button>

              {isFilterOpen && (
                <div className="filters-dropdown">
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={
                        "filter-option" +
                        (selectedFilter === opt.value ? " active" : "")
                      }
                      type="button"
                      onClick={() => {
                        setSelectedFilter(opt.value);
                        setIsFilterOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}

                  {selectedFilter !== "none" && (
                    <button
                      type="button"
                      className="filter-clear"
                      onClick={() => {
                        setSelectedFilter("none");
                        setIsFilterOpen(false);
                      }}
                    >
                      Quitar filtro
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="teams-actions-row">
          <button
            className="btn-solicitudes-teams"
            onClick={() => navigate("/teams/requests")}
          >
            <HelpOutlineIcon style={{ marginRight: "10px" }} />
            Solicitudes
          </button>
        </div>

        <div className="teams-table-container">
          <table className="teams-table">
            <thead>
              <tr>
                <th>Identificador</th>
                <th>Equipo</th>
                <th>DTE</th>
                <th>
                  Plantilla
                  <br />
                  (jugadores)
                </th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {equiposFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No hay equipos que coincidan con la búsqueda/filtro
                  </td>
                </tr>
              ) : (
                equiposFiltrados.map((eq, i) => (
                  <tr
                    key={i}
                    onClick={() => navigate("/teams/details", { state: eq })}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{eq.id}</td>
                    <td>{eq.nombre}</td>
                    <td>{eq.dte}</td>
                    <td>{eq.plantilla}</td>
                    <td>{eq.estado}</td>

                    <td className="td-actions">
                      <button
                        className="btn-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(eq.nombre);
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showDeleteModal && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <h2>¿Está seguro de eliminar al equipo {selectedTeam}?</h2>
              <p className="modal-subtext">
                Escriba su contraseña para confirmar
              </p>

              <input
                type="password"
                placeholder="Contraseña"
                className="modal-input"
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                className="modal-input"
              />

              <div className="modal-buttons">
                <button
                  className="btn-confirm"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 2500);
                  }}
                >
                  Confirmar
                </button>

                <button className="btn-cancel" onClick={closeDeleteModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessMessage && (
          <div className="success-popup">
            <span>Equipo eliminado correctamente</span>
            <span className="success-check">✔</span>
          </div>
        )}
      </main>
    </div>
  );
}
