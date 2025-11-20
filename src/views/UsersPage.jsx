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
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [deleteError, setDeleteError] = useState("");



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
                          setSelectedUser({ id: u.usuarioId, nombre: u.nombre });
                          setPassword1("");
                          setPassword2("");
                          setDeleteError("");
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
                ¿Está seguro de eliminar al usuario {selectedUser?.nombre}?
              </h2>

              <p className="delete-subtext">
                Escriba su contraseña de administrador para confirmar
              </p>

              <input
                type="password"
                className="delete-input"
                placeholder="Contraseña"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
              />

              <input
                type="password"
                className="delete-input"
                placeholder="Confirmar contraseña"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />

              {deleteError && (
                <p className="delete-error">{deleteError}</p>
              )}



              <div className="delete-buttons">
                <button
                  className="btn-confirm-delete"
                  onClick={async () => {
                    setDeleteError("");

                    // 1. Validar contraseñas vacías o diferentes
                    if (!password1 || !password2) {
                      setDeleteError("Debe ingresar y confirmar la contraseña.");
                      return;
                    }

                    if (password1 !== password2) {
                      setDeleteError("Las contraseñas no coinciden.");
                      return;
                    }

                    try {
                      // 2. VALIDAR CONTRASEÑA DEL ADMIN
                      const validar = await fetch(
                        "http://localhost:8080/api/usuarios/validar-password",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                          body: JSON.stringify({ password: password1 }),
                        }
                      );

                      const msgValidar = await validar.text();

                      if (!validar.ok) {
                        setDeleteError(msgValidar);
                        return;
                      }

                      // 3. CONTRASEÑA CORRECTA → ELIMINAR USUARIO
                      const eliminar = await fetch(
                        `http://localhost:8080/api/usuarios/eliminar/${selectedUser.id}`,
                        {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        }
                      );

                      const msgEliminar = await eliminar.text();

                      if (!eliminar.ok) {

                        // 4. USUARIO ES DTE Y TIENE EQUIPOS
                        if (msgEliminar.includes("FK__Equipo__DteId")) {
                          setDeleteError(
                            "Este usuario es Director Técnico de un equipo y no puede ser eliminado. " +
                            "Reasigne primero el equipo a otro DTE."
                          );
                          return;
                        }

                        setDeleteError(msgEliminar);
                        return;
                      }

                      // 5. TODO BIEN → POPUP + REFRESCAR LISTA
                      setShowDeleteModal(false);
                      setShowDeletePopup(true);
                      setPassword1("");
                      setPassword2("");
                      setDeleteError("");

                      setUsuarios(usuarios.filter(u => u.usuarioId !== selectedUser.id));

                      setTimeout(() => {
                        setShowDeletePopup(false);
                      }, 2500);

                    } catch (err) {
                      console.error(err);
                      setDeleteError("Error al conectar con el servidor.");
                    }
                  }}
                >
                  Confirmar
                </button>


                <button
                  className="btn-cancel-delete"
                  onClick={() => {
                    setDeleteError("");
                    setPassword1("");
                    setPassword2("");
                    setShowDeleteModal(false);
                  }}

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

