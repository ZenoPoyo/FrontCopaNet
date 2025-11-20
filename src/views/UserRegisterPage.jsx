import Sidebar from "../components/Sidebar";
import "../UserRegister.css";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function UserRegisterPage() {

  const [identificacion, setIdentificacion] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // VALIDACIÓN 1: campos vacíos
  if (!identificacion || !nombre || !email || !rol || !password || !password2) {
    setError("Por favor complete todos los campos.");
    return;
  }

  // VALIDACIÓN 2: identificación
  if (!/^\d{9}$/.test(identificacion)) {
    setError("La identificación debe tener 9 dígitos numéricos.");
    return;
  }

  // VALIDACIÓN 3: correo
  if (!/^[\w.-]+@(gmail\.com|hotmail\.com|yahoo\.com)$/.test(email.toLowerCase())) {
    setError("El correo debe ser Gmail o Hotmail");
    return;
  }

  // VALIDACIÓN 4: contraseñas iguales
  if (password !== password2) {
    setError("Las contraseñas no coinciden.");
    return;
  }

  // VALIDACIÓN 5: contraseña segura
  if (!/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z0-9]{8,}$/.test(password)) {
    setError("La contraseña debe tener mínimo 8 caracteres alfanuméricos (letras y números).");
    return;
  }

  try {
    // FETCH AL BACKEND
    const res = await fetch("http://localhost:8080/api/usuarios/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        email,
        identificacion,
        rol,
        password,
        nombre
      }),
    });

    const msg = await res.text();

    if (!res.ok) {
      setError(msg);
      return;
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      navigate("/users");
    }, 2500);

  } catch (err) {
    setError("Error de conexión con el servidor.");
    console.error(err);
  }
};


  return (
    <div className="register-container">
      <Sidebar />

      <main className="register-main">

        <button className="btn-back" onClick={() => navigate("/users")}>
          <ArrowBackIcon /> Volver
        </button>

        <h1 className="register-title">Registro de usuarios</h1>
        <p className="register-subtext">
          Ingrese información personal y espere la aprobación de administración.
        </p>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form className="register-box" onSubmit={handleSubmit}>

          <div className="form-row">
            <input 
              type="text" 
              placeholder="Número de identificación" 
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Nombre completo" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-row">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <select 
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
                >
                <option value="">Seleccione un rol</option>
                <option value="Administrador">Administrador</option>
                <option value="DTE">Director Técnico de Equipo (DTE)</option>
            </select>

          </div>

          <div className="form-row">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Confirmar contraseña" 
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>

          <div className="btn-right">
            <button className="btn-submit" type="submit">
              Enviar solicitud
            </button>
          </div>

        </form>

        {showSuccess && (
          <div className="register-success-popup">
            <span>Solicitud de usuario enviada correctamente</span>
            <CheckIcon className="register-success-icon" />
          </div>
        )}

      </main>
    </div>
  );
}

