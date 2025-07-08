const express = require('express');
const DataModel = require('../models/DataModel');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

const pizzasModel = new DataModel('pizzas.json');

// GET /api/pizzas - Obtener todas las pizzas
router.get('/', (req, res) => {
    try {
        const pizzas = pizzasModel.read();
        res.json({
            message: 'Pizzas obtenidas exitosamente',
            data: pizzas.filter(pizza => pizza.disponible !== false)
        });
    } catch (error) {
        console.error('Error obteniendo pizzas:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener las pizzas'
        });
    }
});

// GET /api/pizzas/:id - Obtener una pizza específica
router.get('/:id', (req, res) => {
    try {
        const pizza = pizzasModel.findById(req.params.id);
        if (!pizza) {
            return res.status(404).json({
                error: 'Pizza no encontrada',
                message: 'La pizza solicitada no existe'
            });
        }

        res.json({
            message: 'Pizza obtenida exitosamente',
            data: pizza
        });
    } catch (error) {
        console.error('Error obteniendo pizza:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener la pizza'
        });
    }
});

// POST /api/pizzas - Crear nueva pizza (solo admin)
router.post('/', requireAdmin, (req, res) => {
    try {
        const { nombre, precio, descripcion, categoria } = req.body;

        if (!nombre || !precio || !descripcion) {
            return res.status(400).json({
                error: 'Datos faltantes',
                message: 'Nombre, precio y descripción son requeridos'
            });
        }

        const newPizza = pizzasModel.create({
            nombre,
            precio: parseInt(precio),
            descripcion,
            categoria: categoria || 'general',
            disponible: true,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            message: 'Pizza creada exitosamente',
            data: newPizza
        });
    } catch (error) {
        console.error('Error creando pizza:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al crear la pizza'
        });
    }
});

// PUT /api/pizzas/:id - Actualizar pizza (solo admin)
router.put('/:id', requireAdmin, (req, res) => {
    try {
        const { nombre, precio, descripcion, categoria, disponible } = req.body;
        const updates = {};

        if (nombre) updates.nombre = nombre;
        if (precio) updates.precio = parseInt(precio);
        if (descripcion) updates.descripcion = descripcion;
        if (categoria) updates.categoria = categoria;
        if (disponible !== undefined) updates.disponible = disponible;

        const updatedPizza = pizzasModel.update(req.params.id, updates);
        if (!updatedPizza) {
            return res.status(404).json({
                error: 'Pizza no encontrada',
                message: 'La pizza que intentas actualizar no existe'
            });
        }

        res.json({
            message: 'Pizza actualizada exitosamente',
            data: updatedPizza
        });
    } catch (error) {
        console.error('Error actualizando pizza:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al actualizar la pizza'
        });
    }
});

// DELETE /api/pizzas/:id - Eliminar pizza (solo admin)
router.delete('/:id', requireAdmin, (req, res) => {
    try {
        const deleted = pizzasModel.delete(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                error: 'Pizza no encontrada',
                message: 'La pizza que intentas eliminar no existe'
            });
        }

        res.json({
            message: 'Pizza eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando pizza:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al eliminar la pizza'
        });
    }
});

module.exports = router;
