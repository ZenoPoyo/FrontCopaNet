import Sidebar from "../components/Sidebar";
import "../UserEdit.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserEditPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = () => {
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
                        <input className="input-field" placeholder="604550212" disabled />
                        <input className="input-field" placeholder="Roberto Fernández" />
                    </div>

                    <div className="form-row">
                        <input className="input-field" placeholder="robfer@gmail.com" />
                        <input className="input-field" placeholder="Usuario DTE" disabled />
                    </div>

                    <div className="form-row">
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-password"
                                placeholder="********"
                            />
                            <button
                                className="toggle-pass"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </button>
                        </div>

                        <input className="input-field" placeholder="robfer123" />
                    </div>

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
