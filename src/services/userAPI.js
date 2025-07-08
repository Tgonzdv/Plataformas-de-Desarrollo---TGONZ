import apiService from './apiService';

export const userAPI = {
    // Obtener todos los usuarios (solo admin)
    async getAllUsers() {
        try {
            const response = await apiService.get('/users');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener usuarios');
        }
    },

    // Obtener usuario específico
    async getUserById(id) {
        try {
            const response = await apiService.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener el usuario');
        }
    },

    // Crear nuevo usuario (solo admin)
    async createUser(userData) {
        try {
            const response = await apiService.post('/users', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al crear el usuario');
        }
    },

    // Actualizar usuario
    async updateUser(id, userData) {
        try {
            const response = await apiService.put(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar el usuario');
        }
    },

    // Eliminar usuario (solo admin)
    async deleteUser(id) {
        try {
            const response = await apiService.delete(`/users/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar el usuario');
        }
    },

    // Cambiar contraseña
    async changePassword(id, currentPassword, newPassword) {
        try {
            const response = await apiService.put(`/users/${id}/password`, {
                currentPassword,
                newPassword
            });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Error al cambiar la contraseña');
        }
    }
};
