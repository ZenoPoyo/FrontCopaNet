import axios from "axios";

const API_URL = "http://localhost:8080/api/bitacora/listar";

export const getBitacora = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
