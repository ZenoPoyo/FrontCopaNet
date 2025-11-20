import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoIcon from "@mui/icons-material/Info";
import PaymentsIcon from "@mui/icons-material/Payments";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LogoutIcon from "@mui/icons-material/Logout";
import "../Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6a00",
      cancelButtonColor: "#555",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/");
      }
    });
  };

  return (
    <aside className="sidebar">
      <div>
        <h2 className="logo">CopaNet</h2>

        <nav className="sidebar-menu">
          <Link to="/dashboard" className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""}`}>
            <HomeIcon />
            Inicio
          </Link>

          <Link to="/users" className={`sidebar-item ${location.pathname === "/users" ? "active" : ""}`}>
            <PeopleIcon />
            Usuarios
          </Link>

          <Link className="sidebar-item">
            <EmojiEventsIcon />
            Torneos
          </Link>

          <Link to="/teams" className={`sidebar-item ${location.pathname === "/teams" ? "active" : ""}`}>
            <GroupsIcon />
            Equipos
          </Link>

          <Link className="sidebar-item">
            <InfoIcon />
            Sanciones
          </Link>

          <Link className="sidebar-item">
            <PaymentsIcon />
            Pagos
          </Link>

          <Link to="/audit" className={`sidebar-item ${location.pathname === "/audit" ? "active" : ""}`}>
            <MenuBookIcon />
            Auditoría
          </Link>
        </nav>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        <LogoutIcon />
        Cerrar sesión
      </button>
    </aside>
  );
}
