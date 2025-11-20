import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../Users.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckIcon from "@mui/icons-material/Check";




export default function UsersPage() {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/usuarios/listar", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const msg = await res.text();
          setError(msg);
          return;
        }

        const data = await res.json();
        setUsuarios(data);

      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
      }
    };

    cargarUsuarios();
  }, []);

  return (
    <div className="users-container">
      <Sidebar />

      <main className="users-main">


        <div className="search-row">
          <div className="search-bar">
            <input type="text" placeholder="Buscar" />
            <SearchIcon className="search-icon" />
          </div>

          <div className="search-actions">
            <button className="btn-orange">Buscar</button>
            <button className="btn-purple">Filtros</button>
          </div>
        </div>


        <div className="actions-row">
          <button
            className="btn-register"
            onClick={() => navigate("/user/register")}  
          >
            <PersonAddAltIcon style={{ marginRight: "10px" }} />
            Registrar
          </button>

          <button
            className="btn-solicitudes"
            onClick={() => navigate("/user/requests")}
          >
            <HelpOutlineIcon style={{ marginRight: "10px" }} />
            Solicitudes
          </button>
        </div>


        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Identificación</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                usuarios.map((u, idx) => (
                  <tr key={idx}>
                    <td>{u.identificacion}</td>
                    <td>{u.nombre}</td>
                    <td>{u.rol}</td>
                    <td>{u.estado}</td>

                    <td className="td-actions">
                      <button
                        className="btn-delete"
                        onClick={() => {
                          setSelectedUser(u.nombre);
                          setShowDeleteModal(true);
                        }}
                      >
                        Eliminar
                      </button>

                      <button
                        className="btn-modify"
                        onClick={() => navigate("/users/edit/" + u.identificacion)}
                      >
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>


          </table>
        </div>

        {showDeleteModal && (
          <div className="delete-overlay">
            <div className="delete-modal-box">

              <h2 className="delete-title">
                ¿Está seguro de eliminar al usuario {selectedUser}?
              </h2>

              <p className="delete-subtext">
                Escriba su contraseña de administrador para confirmar
              </p>

              <input
                type="password"
                className="delete-input"
                placeholder="Contraseña"
              />

              <input
                type="password"
                className="delete-input"
                placeholder="Confirmar contraseña"
              />

              <div className="delete-buttons">
                <button
                  className="btn-confirm-delete"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setShowDeletePopup(true);

                    setTimeout(() => {
                      setShowDeletePopup(false);
                    }, 2500);
                  }}
                >
                  Confirmar
                </button>

                <button
                  className="btn-cancel-delete"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}

        {showDeletePopup && (
          <div className="popup-delete-success">
            <span>Usuario eliminado correctamente</span>
            <CheckIcon className="popup-check" />
          </div>
        )}


      </main>
    </div>
  );
}

