import apiService from './apiService';

export const favoritesAPI = {
    // Obtener favoritos del usuario
    async getFavorites() {
        try {
            const response = await apiService.get('/favorites');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener favoritos');
        }
    },

    // Agregar pizza a favoritos
    async addToFavorites(pizzaId) {
        try {
            const response = await apiService.post(`/favorites/${pizzaId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al agregar a favoritos');
        }
    },

    // Eliminar pizza de favoritos
    async removeFromFavorites(pizzaId) {
        try {
            const response = await apiService.delete(`/favorites/${pizzaId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar de favoritos');
        }
    },

    // Limpiar todos los favoritos
    async clearFavorites() {
        try {
            const response = await apiService.delete('/favorites');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al limpiar favoritos');
        }
    }
};
