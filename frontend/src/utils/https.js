// MUDA PRO DA SUA MAQUINA VIRTUAL
const BACKEND_HOST = "192.168.198.128";
const BACKEND_PORT = "5000";

// Primeiro defina as constantes individuais
export { BACKEND_HOST, BACKEND_PORT };

// Depois calcule a API_URL
const API_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`;

// Exporte a API_URL
export { API_URL };