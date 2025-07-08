// Configuración base para las llamadas a la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Obtener token del localStorage
    getToken() {
        const token = localStorage.getItem('authToken');
        return token;
    }

    // Guardar token en localStorage
    setToken(token) {
        localStorage.setItem('authToken', token);
    }

    // Eliminar token del localStorage
    removeToken() {
        localStorage.removeItem('authToken');
    }

    // Obtener headers con autenticación
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Método genérico para hacer requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Si el token expiró o es inválido, redirigir al login
                if (response.status === 401 || response.status === 403) {
                    this.removeToken();
                    localStorage.removeItem('currentUser');
                    if (!window.location.pathname.includes('/')) {
                        window.location.href = '/';
                    }
                }
                throw new Error(data.message || data.error || 'Error en la petición');
            }

            return data;
        } catch (error) {
            console.error(`Error en ${endpoint}:`, error);
            throw error;
        }
    }

    // Métodos GET
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    // Métodos POST
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Métodos PUT
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Métodos DELETE
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Verificar conectividad con el backend
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            console.error('Backend no disponible:', error);
            return false;
        }
    }
}

// Instancia singleton del servicio
const apiService = new ApiService();

export default apiService;
