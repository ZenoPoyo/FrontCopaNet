import Sidebar from "../components/Sidebar";
import "../Audit.css";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useRef } from "react";

import { getBitacora } from "../services/bitacoraService";  // <--- IMPORTANTE

export default function AuditPage() {
  const [bitacora, setBitacora] = useState([]);
  const [filtros, setFiltros] = useState({
    texto: "",
    usuario: "",
    accion: "",
    entidad: "",
    fechaDesde: "",
    fechaHasta: ""
  });

  const [showFilters, setShowFilters] = useState(false);
  const [bitacoraFiltrada, setBitacoraFiltrada] = useState([]);
  const filtroRef = useRef(null);


 useEffect(() => {
    getBitacora()
      .then(data => {
        
        const normalizado = data.map(b => ({
          ...b,
          fecha: b.fecha.substring(0, 19)   
        }));

        setBitacora(normalizado);
        setBitacoraFiltrada(normalizado);
      })
      .catch(err => console.error("Error cargando bitácora:", err));
  }, []); 

  useEffect(() => {
    function handleClickOutside(e) {
      if (filtroRef.current && !filtroRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    }

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilters]);


 

  const aplicarFiltros = () => {
    console.log("APLICANDO FILTROS...");
      let filtrada = [...bitacora];

      // === Texto libre
      if (filtros.texto.trim() !== "") {
        const t = filtros.texto.toLowerCase();
        filtrada = filtrada.filter(b =>
          b.usuario.toLowerCase().includes(t) ||
          b.accion.toLowerCase().includes(t) ||
          b.entidad.toLowerCase().includes(t) ||
          b.detalle.toLowerCase().includes(t)
        );
      }

      // === Usuario
      if (filtros.usuario !== "") {
        filtrada = filtrada.filter(b => b.usuario.toLowerCase().includes(filtros.usuario.toLowerCase()));
      }

      // === Acción
      if (filtros.accion !== "") {
        filtrada = filtrada.filter(b => b.accion === filtros.accion);
      }

      // === Entidad
      if (filtros.entidad !== "") {
        filtrada = filtrada.filter(b => b.entidad.toLowerCase().includes(filtros.entidad.toLowerCase()));
      }

      const parseFecha = (str) => {
        if (!str) return null;
        return new Date(str.replace(" ", "T").substring(0, 19));
      };

      // FILTRO FECHA DESDE
      if (filtros.fechaDesde) {
        const desde = new Date(filtros.fechaDesde + "T00:00:00");
        filtrada = filtrada.filter(b => parseFecha(b.fecha) >= desde);
      }

      // FILTRO FECHA HASTA
      if (filtros.fechaHasta) {
        const hasta = new Date(filtros.fechaHasta + "T23:59:59");
        filtrada = filtrada.filter(b => parseFecha(b.fecha) <= hasta);
      }


      setBitacoraFiltrada(filtrada);
    };

   


  return (
    <div className="audit-container">
      <Sidebar />

      <main className="audit-main">

        {/* === Barra de búsqueda === */}
        <div className="audit-search-row">
          <div className="audit-search-bar">
            <input
              type="text"
              placeholder="Buscar"
              value={filtros.texto}
              onChange={(e) => setFiltros({ ...filtros, texto: e.target.value })}
            />

            <SearchIcon className="search-icon" />
          </div>

          <div className="audit-search-actions">
            <button className="btn-orange" onClick={aplicarFiltros}>
              Buscar
            </button>

            <button className="btn-purple" onClick={() => setShowFilters(!showFilters)}>
              Filtros
            </button>


            {showFilters && (
              <div className="filters-dropdown" ref={filtroRef}>
              

                <label>Usuario:</label>
                <input
                  type="text"
                  placeholder="Ej: Keisy Jiménez"
                  value={filtros.usuario}
                  onChange={(e) => setFiltros({ ...filtros, usuario: e.target.value })}
                />

                <label>Acción:</label>
                <select
                  value={filtros.accion}
                  onChange={(e) => setFiltros({ ...filtros, accion: e.target.value })}
                >
                  <option value="">Todas</option>
                  <option value="Crear">Crear</option>
                  <option value="Modificar">Modificar</option>
                  <option value="Eliminar">Eliminar</option>
                  <option value="Acceso">Acceso</option>
                  <option value="Error">Error</option>
                </select>

                <label>Entidad:</label>
                <input
                  type="text"
                  placeholder="Usuario, Equipos, Pagos…"
                  value={filtros.entidad}
                  onChange={(e) => setFiltros({ ...filtros, entidad: e.target.value })}
                />

                {/* === Filtro Fecha desde === */}
                <label>Fecha desde:</label>
                <input
                  type="date"
                  value={filtros.fechaDesde}
                  onChange={(e) =>
                    setFiltros({ ...filtros, fechaDesde: e.target.value })
                  }
                />

                <label>Fecha hasta:</label>
                <input
                  type="date"
                  value={filtros.fechaHasta}
                  onChange={(e) =>
                    setFiltros({ ...filtros, fechaHasta: e.target.value })
                  }
                />


              </div>
            )}


          </div>
        </div>

        {/* === Tabla === */}
        <div className="audit-table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Entidad</th>
                <th>Administrador</th>
                <th>Detalle</th>
              </tr>
            </thead>

            <tbody>
              {bitacoraFiltrada.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                    No hay datos de auditoría
                  </td>
                </tr>
              ) : (
                bitacoraFiltrada.map((b, idx) => (
                  <tr key={idx}>
                    <td>{b.fecha}</td>
                    <td>{b.usuario}</td>
                    <td>{b.accion}</td>
                    <td>{b.entidad}</td>
                    <td>{b.usuario}</td>
                    <td>{b.detalle}</td>
                  </tr>
                ))
              )}

            </tbody>


          </table>
        </div>

        <div className="audit-export-row">
          <button className="btn-export">Exportar</button>
        </div>

      </main>
    </div>
  );
}

