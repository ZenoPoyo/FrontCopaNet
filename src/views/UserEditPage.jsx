import Sidebar from "../components/Sidebar";
import "../UserEdit.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEditPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");
  const [identificacion, setIdentificacion] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [usuarioId, setUsuarioId] = useState(null);
  

  // Obtener identificación desde ruta
  const { identificacion: identificacionParam } = useParams();

  // Cargar datos del usuario
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/usuarios/detalle/${identificacionParam}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Error al cargar usuario");
          return;
        }

        const data = await res.json();

        setIdentificacion(data.identificacion);
        setNombre(data.nombre);
        setEmail(data.email);
        setRol(data.rol);
        setUsuarioId(data.usuarioId);

      } catch (err) {
        console.error("Error de conexión:", err);
      }
    };

    cargarUsuario();
  }, [identificacionParam]);

  const handleSubmit = async () => {
    
    // Limpiar error previo
    setError("");

    // Validación: si solo una contraseña está escrita
    if (password && !password2) {
    setError("Debe confirmar la contraseña.");
    return;
    }

    // Validación: contraseñas no coinciden
    if (password !== password2) {
    setError("Las contraseñas no coinciden.");
    return;
    }

    // Validación: si el usuario quiere cambiar contraseña
    if (password.length > 0) {

    // Validación: contraseña segura
    if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z0-9]{8,}$/.test(password)) {
        setError("La contraseña debe tener mínimo 8 caracteres alfanuméricos (letras y números).");
        return;
    }
    }


  const body = {
        usuarioId: usuarioId,   
        nombre,
        email,
        password 
    };

    const res = await fetch("http://localhost:8080/api/usuarios/modificar", {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(body)
    });

    const msg = await res.text();

    if (!res.ok) {
        alert(msg);
        return;
    }

    setShowPopup(true);

    setTimeout(() => {
        setShowPopup(false);
        navigate("/users");
    }, 2500);
    };


  return (
    <div className="edit-container">
      <Sidebar />

      <main className="edit-main">

        <button className="btn-back" onClick={() => navigate("/users")}>
          <ArrowBackIcon /> Volver
        </button>

        <h1 className="edit-title">Modificar usuario</h1>
        <p className="edit-subtitle">
          Es posible modificar únicamente los espacios habilitados.
        </p>

        <div className="edit-form">

          <div className="form-row">
            <input 
              className="input-field" 
              value={identificacion}
              disabled 
            />

            <input 
                className="input-field"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre completo"
            />

          </div>

          <div className="form-row">
            <input 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            />

            <input 
              className="input-field"
              value={rol}
              disabled
            />
          </div>

          <div className="form-row">

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña"
              />
              <button
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
            </div>

            <div className="password-wrapper">
                <input
                    type={showPassword2 ? "text" : "password"}
                    className="input-password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirmar contraseña"
                />

                <button
                    className="toggle-pass"
                    onClick={() => setShowPassword2(!showPassword2)}
                >
                    {showPassword2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
             </div>

          </div>

            {error && (
            <div className="edit-error">
                {error}
            </div>
            )}

          <button className="btn-edit" onClick={handleSubmit}>
            Modificar
          </button>

        </div>
      </main>

      {showPopup && (
        <div className="popup-edit success">
          Usuario modificado correctamente <CheckIcon className="icon" />
        </div>
      )}
    </div>
  );
}

