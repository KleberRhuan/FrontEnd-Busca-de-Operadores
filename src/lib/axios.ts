import axios from 'axios';
import { API_CONFIG } from '@/app/config/api';

// Criando uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de requisições
api.interceptors.request.use(
  (config) => {
    config.headers['Origin'] = 'localhost:5173';
    config.headers['Access-Control-Allow-Methods'] = 'GET';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento centralizado de erros
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status fora do intervalo 2xx
      console.error('Erro de resposta:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('Erro de requisição:', error.request);
    } else {
      // Algo aconteceu na configuração da requisição que desencadeou um erro
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 