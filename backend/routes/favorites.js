const express = require('express');
const DataModel = require('../models/DataModel');
const router = express.Router();

const favoritesModel = new DataModel('favorites.json');
const pizzasModel = new DataModel('pizzas.json');

// GET /api/favorites - Obtener favoritos del usuario
router.get('/', (req, res) => {
    try {
        const userId = req.user.id;
        let userFavorites = favoritesModel.findByProperty('userId', userId);

        if (!userFavorites) {
            // Crear lista de favoritos vacía si no existe
            userFavorites = favoritesModel.create({
                userId,
                pizzaIds: [],
                createdAt: new Date().toISOString()
            });
        }

        // Obtener información completa de las pizzas favoritas
        const pizzas = pizzasModel.read();
        const favoritePizzas = pizzas.filter(pizza => 
            userFavorites.pizzaIds.includes(pizza.id)
        );

        res.json({
            message: 'Favoritos obtenidos exitosamente',
            data: {
                favorites: userFavorites,
                pizzas: favoritePizzas
            }
        });
    } catch (error) {
        console.error('Error obteniendo favoritos:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener los favoritos'
        });
    }
});

// POST /api/favorites/:pizzaId - Agregar pizza a favoritos
router.post('/:pizzaId', (req, res) => {
    try {
        const userId = req.user.id;
        const pizzaId = parseInt(req.params.pizzaId);

        // Verificar que la pizza existe
        const pizza = pizzasModel.findById(pizzaId);
        if (!pizza) {
            return res.status(404).json({
                error: 'Pizza no encontrada',
                message: 'La pizza solicitada no existe'
            });
        }

        let userFavorites = favoritesModel.findByProperty('userId', userId);
        if (!userFavorites) {
            userFavorites = favoritesModel.create({
                userId,
                pizzaIds: [],
                createdAt: new Date().toISOString()
            });
        }

        // Verificar si ya está en favoritos
        if (userFavorites.pizzaIds.includes(pizzaId)) {
            return res.status(409).json({
                error: 'Ya en favoritos',
                message: 'Esta pizza ya está en tus favoritos'
            });
        }

        // Agregar a favoritos
        userFavorites.pizzaIds.push(pizzaId);
        const updatedFavorites = favoritesModel.update(userFavorites.id, userFavorites);

        res.json({
            message: 'Pizza agregada a favoritos exitosamente',
            data: updatedFavorites
        });
    } catch (error) {
        console.error('Error agregando a favoritos:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al agregar a favoritos'
        });
    }
});

// DELETE /api/favorites/:pizzaId - Eliminar pizza de favoritos
router.delete('/:pizzaId', (req, res) => {
    try {
        const userId = req.user.id;
        const pizzaId = parseInt(req.params.pizzaId);

        const userFavorites = favoritesModel.findByProperty('userId', userId);
        if (!userFavorites) {
            return res.status(404).json({
                error: 'Favoritos no encontrados',
                message: 'No tienes una lista de favoritos'
            });
        }

        const initialLength = userFavorites.pizzaIds.length;
        userFavorites.pizzaIds = userFavorites.pizzaIds.filter(id => id !== pizzaId);

        if (userFavorites.pizzaIds.length === initialLength) {
            return res.status(404).json({
                error: 'Pizza no está en favoritos',
                message: 'Esta pizza no está en tus favoritos'
            });
        }

        const updatedFavorites = favoritesModel.update(userFavorites.id, userFavorites);

        res.json({
            message: 'Pizza eliminada de favoritos exitosamente',
            data: updatedFavorites
        });
    } catch (error) {
        console.error('Error eliminando de favoritos:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al eliminar de favoritos'
        });
    }
});

// DELETE /api/favorites - Limpiar todos los favoritos
router.delete('/', (req, res) => {
    try {
        const userId = req.user.id;
        const userFavorites = favoritesModel.findByProperty('userId', userId);

        if (!userFavorites) {
            return res.status(404).json({
                error: 'Favoritos no encontrados',
                message: 'No tienes una lista de favoritos'
            });
        }

        const clearedFavorites = favoritesModel.update(userFavorites.id, {
            pizzaIds: []
        });

        res.json({
            message: 'Favoritos limpiados exitosamente',
            data: clearedFavorites
        });
    } catch (error) {
        console.error('Error limpiando favoritos:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al limpiar favoritos'
        });
    }
});

module.exports = router;
