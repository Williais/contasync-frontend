// src/api/axios.js
import axios from 'axios';

// Pega a URL base da API a partir da variável de ambiente que configuramos na Vercel.
// Se a variável não existir (ambiente local), ele usa localhost:3000 como padrão.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Garante que os cookies de sessão sejam enviados
});

export default axiosInstance;