import axios from "axios";

const API_URL = "http://localhost:8080/api/equipos";

// 🔹 Obtener todos los equipos
export const getEquipos = async () => {
  const res = await axios.get(`${API_URL}/listar`);
  return res.data;
};

// 🔹 Obtener plantilla activa por equipo
export const getPlantillaActiva = async (equipoId) => {
  const res = await axios.get(`${API_URL}/${equipoId}/plantilla-activa`);
  return res.data;
};
