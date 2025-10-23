// URL base da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuração de timeout padrão (em ms)
const API_TIMEOUT = 30000;

// Endpoints da API
const API_ENDPOINTS = {

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
  },

  // Convites
  INVITES: {
    LIST: '/invites',
    CREATE: '/invites',
    GET_BY_ID: '/invites/:id',
    UPDATE: '/invites/:id',
    DELETE: '/invites/:id',
    DOWNLOAD: '/invites/:id/download',
    EXPORT: '/invites/export',
    IMPORT: '/invites/import',
  },

  // Usuários
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // QR Code
  QRCODE: {
    GENERATE: '/qrcode/generate',
    VALIDATE: '/qrcode/validate/:id',
  },
};

/**
 * Função para construir a URL completa do endpoint
 * @param {string} endpoint - O endpoint da API
 * @param {object} params - Parâmetros para substituir na URL (ex: { id: 123 })
 * @returns {string} - URL completa
 */
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${API_BASE_URL}${endpoint}`;

  // Substituir parâmetros dinâmicos na URL
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

/**
 * Configuração de headers padrão para requisições
 */
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('auth_token');
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Função para fazer requisições à API
 * @param {string} endpoint - O endpoint da API
 * @param {object} options - Opções da requisição (método, dados, etc)
 * @returns {Promise} - Resposta da API
 */
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    data = null,
    headers = {},
    timeout = API_TIMEOUT,
    params = {},
  } = options;

  const url = buildApiUrl(endpoint, params);
  const fetchOptions = {
    method,
    headers: {
      ...getDefaultHeaders(),
      ...headers,
    },
  };

  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export {
  API_BASE_URL,
  API_TIMEOUT,
  API_ENDPOINTS,
};