import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const API_BASE = "http://localhost:8080/api/auth";

export default function RecoveryEnterEmail({ onNext, onBack }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    setMsg("");

    if (!email) {
      setError("Ingresa tu correo.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/recovery/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text();

      if (!res.ok) {
        setError(text || "Error enviando el correo.");
      } else {
        setMsg("Si el correo existe, se ha enviado un código.");
        // avisamos al padre cuál correo se usó
        onNext(email);
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
        Olvidé Contraseña
      </Typography>

      <LockIcon sx={{ fontSize: 70, color: "#ff6600", mb: 3 }} />

      <Typography sx={{ color: "#fff", mb: 3 }}>
        Te enviaremos un correo para cambiar la contraseña
      </Typography>

      <TextField
        fullWidth
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputProps={{
          sx: {
            bgcolor: "#111",
            borderRadius: "12px",
            input: { color: "#fff" },
          },
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
        {loading ? "Enviando..." : "Enviar"}
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
