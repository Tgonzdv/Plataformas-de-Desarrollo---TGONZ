import apiService from './apiService';

export const orderAPI = {
    // Obtener pedidos del usuario (o todos si es admin)
    async getOrders() {
        try {
            const response = await apiService.get('/orders');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener pedidos');
        }
    },

    // Obtener pedido específico
    async getOrderById(id) {
        try {
            const response = await apiService.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener el pedido');
        }
    },

    // Crear nuevo pedido desde el carrito
    async createOrder() {
        try {
            const response = await apiService.post('/orders');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al crear el pedido');
        }
    },

    // Actualizar estado del pedido (solo admin)
    async updateOrderStatus(id, status) {
        try {
            const response = await apiService.put(`/orders/${id}/status`, {
                status
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar el estado del pedido');
        }
    },

    // Cancelar pedido
    async cancelOrder(id) {
        try {
            const response = await apiService.delete(`/orders/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al cancelar el pedido');
        }
    },

    // Obtener estadísticas (solo admin)
    async getStats() {
        try {
            const response = await apiService.get('/orders/stats/dashboard');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener estadísticas');
        }
    }
};
