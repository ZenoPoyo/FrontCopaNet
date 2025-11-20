import { useState } from "react";
import { useNavigate } from "react-router-dom";
import fondo from "../assets/fondo.jpg";

import RecoveryEnterEmail from "./Recovery/RecoveryEnterEmail";
import RecoveryEnterCode from "./Recovery/RecoveryEnterCode";
import RecoveryNewPassword from "./Recovery/RecoveryNewPassword";

import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

    // ===== ESTADOS FALTANTES =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [tablas, setTablas] = useState([]);

  const [screen, setScreen] = useState(null);

  // 🔥 estados para recuperación
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");

  const openRecovery = () => {
    console.log("openRecovery called");
    setScreen("email"); 
  };

  // ====== LLAMADA AL BACKEND PARA LOGIN ======
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1) LOGIN
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error al iniciar sesión");
      }

      const data = await res.json(); // { usuarioId, email, nombre, roles }
      setUsuario(data);

      localStorage.setItem("token", data.token);

      // 2) CARGAR TABLAS SOLO SI LOGIN OK
      const resTablas = await fetch("http://localhost:8080/api/meta/tablas");
      const dataTablas = await resTablas.json();
      setTablas(dataTablas);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // =========================================================
  //  VISTA DESPUÉS DEL LOGIN: mostrar usuario + tablas
  // =========================================================
  if (usuario) {
    navigate("/dashboard");
    return null;  // 👈 evita que renderice pantalla negra
  }

  // =========================================================
  //  VISTA DE LOGIN (ANTES DE AUTENTICAR)
  // =========================================================
  return (
    <>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          position: "relative",

          backgroundImage: `url(${fondo})`,  
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >


        <Box
          sx={{
            flex: 1,
            color: "white",
            pl: 6,
            mt: 35,
            zIndex: 2,
            maxWidth: "40%",
            display: { xs: "none", md: "flex" },
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ lineHeight: 1.2, maxWidth: 900 }}
          >
            Gestiona torneos y equipos desde un solo lugar
          </Typography>
        </Box>


        <Paper
          sx={{
            width: 420,
            minHeight: 570,
            borderRadius: "30px",
            background: "#f5e9df",
            p: 6,
            pt: 1,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 8px 40px rgba(0,0,0,0.28)",
            opacity: 0.97,
            mr: { xs: 0, md: 10 },
            mt: 6,
          }}
          elevation={0}
          component="form"
          onSubmit={handleLogin}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, mt: 3 }}>
            ¡De vuelta al control!
          </Typography>

          <Typography variant="body2" fontWeight="bold" sx={{ mb: 5, mt: 4 }}>
            Inicia sesión para administrar torneos.
          </Typography>


          <Typography sx={{ color: "#000", mb: 1, mt: 2 }} fontWeight="bold">
            Correo electrónico
          </Typography>
          <TextField
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "30px",
                bgcolor: "#d0cece",
                px: 2,
                height: 50,
              },
            }}
            sx={{ mb: 3 }}
          />


          <Typography sx={{ color: "#000", mb: 1, mt: 3 }} fontWeight="bold">
            Contraseña
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: "30px",
                bgcolor: "#d0cece",
                px: 2,
                height: 50,
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography
              variant="body2"
              sx={{ color: "red", mt: 1, fontWeight: "bold" }}
            >
              {error}
            </Typography>
          )}

          <Typography
            variant="caption"
            color="primary"
            sx={{
              display: "block",
              textAlign: "right",
              mt: 1,
              cursor: "pointer",
            }}
            onClick={openRecovery}
          >
            ¿Olvidaste tu contraseña?
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              py: 1.3,
              borderRadius: "50px",
              background: "#000",
              fontSize: "16px",
              "&:hover": { background: "#222" },
            }}
          >
            Iniciar sesión
          </Button>
        </Paper>
      </Box>



      {screen === "email" && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RecoveryEnterEmail
            onNext={(correo) => {
              setRecoveryEmail(correo);
              setScreen("code");
            }}
            onBack={() => setScreen(null)}
          />
        </Box>
      )}

      {screen === "code" && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RecoveryEnterCode
            email={recoveryEmail}
            onNext={(codigo) => {
              setRecoveryCode(codigo);
              setScreen("newpass");
            }}
            onBack={() => setScreen(null)}
          />
        </Box>
      )}

      {screen === "newpass" && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(3px)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RecoveryNewPassword
              email={recoveryEmail}
            code={recoveryCode}
            onFinish={() => setScreen(null)}
            onBack={() => setScreen(null)}
          />
        </Box>
      )}
    </>
  );
}
