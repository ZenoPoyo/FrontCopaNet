const API_BASE = "http://localhost:8080/api/solicitudes-plantilla";

export async function getSolicitudesPlantilla() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Error al cargar solicitudes de plantilla");
  return res.json();
}

export async function aprobarSolicitud(id) {
  const res = await fetch(`${API_BASE}/${id}/aprobar`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error aprobando solicitud");
  return res.json();
}

export async function rechazarSolicitud(id) {
  const res = await fetch(`${API_BASE}/${id}/rechazar`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Error rechazando solicitud");
  return res.json();
}
