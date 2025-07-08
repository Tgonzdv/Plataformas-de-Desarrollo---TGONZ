import apiService from './apiService';

export const pizzaAPI = {
    // Obtener todas las pizzas
    async getAllPizzas() {
        try {
            const response = await apiService.get('/pizzas');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener pizzas');
        }
    },

    // Obtener una pizza específica
    async getPizzaById(id) {
        try {
            const response = await apiService.get(`/pizzas/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener la pizza');
        }
    },

    // Crear nueva pizza (solo admin)
    async createPizza(pizzaData) {
        try {
            const response = await apiService.post('/pizzas', pizzaData);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al crear la pizza');
        }
    },

    // Actualizar pizza (solo admin)
    async updatePizza(id, pizzaData) {
        try {
            const response = await apiService.put(`/pizzas/${id}`, pizzaData);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar la pizza');
        }
    },

    // Eliminar pizza (solo admin)
    async deletePizza(id) {
        try {
            const response = await apiService.delete(`/pizzas/${id}`);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar la pizza');
        }
    }
};
