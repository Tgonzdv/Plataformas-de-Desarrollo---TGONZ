import apiService from './apiService';

export const cartAPI = {
    // Obtener carrito del usuario
    async getCart() {
        try {
            const response = await apiService.get('/cart');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al obtener el carrito');
        }
    },

    // Agregar item al carrito
    async addToCart(pizzaId, cantidad = 1) {
        try {
            const response = await apiService.post('/cart/add', {
                pizzaId,
                cantidad
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al agregar al carrito');
        }
    },

    // Actualizar cantidad de item en el carrito
    async updateCartItem(itemId, cantidad) {
        try {
            const response = await apiService.put(`/cart/item/${itemId}`, {
                cantidad
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al actualizar el carrito');
        }
    },

    // Eliminar item del carrito
    async removeFromCart(itemId) {
        try {
            const response = await apiService.delete(`/cart/item/${itemId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al eliminar del carrito');
        }
    },

    // Limpiar carrito
    async clearCart() {
        try {
            const response = await apiService.delete('/cart');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Error al limpiar el carrito');
        }
    }
};
