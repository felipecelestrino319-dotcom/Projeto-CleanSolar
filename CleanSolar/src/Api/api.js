// Importa o cliente HTTP Axios para realização de requisições à API
import axios from 'axios';

// Define o endereço IP local e a porta onde o servidor backend Node.js está rodando
const API_URL = 'http://192.168.15.2:3000'; 

// Cria e configura uma instância reutilizável do Axios com as configurações base
const api = axios.create({
  baseURL: API_URL, // Define a URL base para todas as chamadas HTTP (ex: /usuarios/login)
  timeout: 5000,    // Define o tempo limite de espera da requisição em 5 segundos (5000ms)
});

// Exporta a instância para ser utilizada em outros arquivos da aplicação
export default api;