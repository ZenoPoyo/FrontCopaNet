import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";

import LoopIcon from "@mui/icons-material/Loop";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const API_BASE = "http://localhost:8080/api/auth";

export default function RecoveryNewPassword({ email, code, onFinish, onBack }) {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    setMsg("");

    if (!pass1 || !pass2) {
      setError("Completa ambos campos.");
      return;
    }
    if (pass1 !== pass2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recovery/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: pass1,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        setError(text || "No se pudo actualizar la contraseña.");
      } else {
        setMsg("Contraseña actualizada correctamente.");
        onFinish();
      }
    } catch (e) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: 380,
        bgcolor: "#000",
        borderRadius: "30px",
        p: 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ color: "#ff6600", mb: 2 }}
      >
        Cambia Contraseña
      </Typography>

      <LoopIcon sx={{ fontSize: 70, color: "#ff6600", mb: 3 }} />

      <TextField
        fullWidth
        type={showPass1 ? "text" : "password"}
        placeholder="Nueva contraseña"
        value={pass1}
        onChange={(e) => setPass1(e.target.value)}
        InputProps={{
          sx: {
            bgcolor: "#111",
            borderRadius: "12px",
            input: { color: "#fff" },
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPass1(!showPass1)}>
                {showPass1 ? (
                  <Visibility sx={{ color: "#fff" }} />
                ) : (
                  <VisibilityOff sx={{ color: "#fff" }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        type={showPass2 ? "text" : "password"}
        placeholder="Confirmar Nueva Contraseña"
        value={pass2}
        onChange={(e) => setPass2(e.target.value)}
        InputProps={{
          sx: {
            bgcolor: "#111",
            borderRadius: "12px",
            input: { color: "#fff" },
          },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPass2(!showPass2)}>
                {showPass2 ? (
                  <Visibility sx={{ color: "#fff" }} />
                ) : (
                  <VisibilityOff sx={{ color: "#fff" }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {error && (
        <Typography sx={{ color: "red", mb: 1, fontSize: 14 }}>{error}</Typography>
      )}
      {msg && (
        <Typography sx={{ color: "#4caf50", mb: 1, fontSize: 14 }}>{msg}</Typography>
      )}

      <Button
        fullWidth
        variant="contained"
        onClick={handleSend}
        disabled={loading}
        sx={{
          bgcolor: "#fff",
          color: "#000",
          borderRadius: "12px",
          "&:hover": { bgcolor: "#e5e5e5" },
        }}
      >
        {loading ? "Guardando..." : "Enviar"}
      </Button>

      <Typography
        sx={{
          mt: 3,
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={onBack}
      >
        Volver a Iniciar Sesión
      </Typography>
    </Box>
  );
}
