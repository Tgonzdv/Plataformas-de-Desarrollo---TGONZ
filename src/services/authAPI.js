import apiService from './apiService';

export const authAPI = {
    // Iniciar sesión
    async login(username, password) {
        try {
            const response = await apiService.post('/auth/login', {
                username,
                password
            });

            // Guardar token y usuario en localStorage
            if (response.token) {
                apiService.setToken(response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    },

    // Registrar nuevo usuario
    async register(userData) {
        try {
            const response = await apiService.post('/auth/register', userData);

            // Guardar token y usuario en localStorage
            if (response.token) {
                apiService.setToken(response.token);
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw new Error(error.message || 'Error al registrar usuario');
        }
    },

    // Verificar token
    async verifyToken() {
        try {
            const response = await apiService.post('/auth/verify');
            return response;
        } catch (error) {
            // Si el token no es válido, limpiar localStorage
            this.logout();
            throw new Error('Sesión expirada');
        }
    },

    // Cerrar sesión
    logout() {
        apiService.removeToken();
        localStorage.removeItem('currentUser');
    },

    // Obtener usuario actual del localStorage
    getCurrentUser() {
        try {
            const user = localStorage.getItem('currentUser');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error al obtener usuario del localStorage:', error);
            return null;
        }
    },

    // Verificar si está autenticado
    isAuthenticated() {
        const token = apiService.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    },

    // Verificar si es admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
};
