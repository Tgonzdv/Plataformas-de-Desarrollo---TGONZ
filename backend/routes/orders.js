const express = require('express');
const DataModel = require('../models/DataModel');
const { requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');
const router = express.Router();

const ordersModel = new DataModel('orders.json');
const cartsModel = new DataModel('carts.json');

// GET /api/orders - Obtener pedidos (todos para admin, propios para usuario)
router.get('/', (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        let orders = ordersModel.read();

        // Si no es admin, filtrar solo sus pedidos
        if (!isAdmin) {
            orders = orders.filter(order => order.userId === userId);
        }

        res.json({
            message: 'Pedidos obtenidos exitosamente',
            data: orders
        });
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener los pedidos'
        });
    }
});

// GET /api/orders/:id - Obtener pedido específico
router.get('/:id', (req, res) => {
    try {
        const order = ordersModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                error: 'Pedido no encontrado',
                message: 'El pedido solicitado no existe'
            });
        }

        // Verificar permisos (propietario o admin)
        if (req.user.role !== 'admin' && order.userId !== req.user.id) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes ver tus propios pedidos'
            });
        }

        res.json({
            message: 'Pedido obtenido exitosamente',
            data: order
        });
    } catch (error) {
        console.error('Error obteniendo pedido:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener el pedido'
        });
    }
});

// POST /api/orders - Crear nuevo pedido desde el carrito
router.post('/', (req, res) => {
    try {
        const userId = req.user.id;

        // Obtener carrito del usuario
        const userCart = cartsModel.findByProperty('userId', userId);
        if (!userCart || !userCart.items || userCart.items.length === 0) {
            return res.status(400).json({
                error: 'Carrito vacío',
                message: 'No puedes crear un pedido sin items en el carrito'
            });
        }

        // Crear el pedido
        const newOrder = ordersModel.create({
            userId,
            items: userCart.items.map(item => ({
                pizzaId: item.pizzaId,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio
            })),
            total: userCart.total,
            status: 'pendiente',
            fecha: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });

        // Limpiar carrito después de crear el pedido
        cartsModel.update(userCart.id, {
            items: [],
            total: 0,
            updatedAt: new Date().toISOString()
        });

        res.status(201).json({
            message: 'Pedido creado exitosamente',
            data: newOrder
        });
    } catch (error) {
        console.error('Error creando pedido:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al crear el pedido'
        });
    }
});

// PUT /api/orders/:id/status - Actualizar estado del pedido (solo admin)
router.put('/:id/status', requireAdmin, (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pendiente', 'aceptado', 'cancelado', 'en_preparacion', 'entregado'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Estado inválido',
                message: `Estado debe ser uno de: ${validStatuses.join(', ')}`
            });
        }

        const updatedOrder = ordersModel.update(req.params.id, { 
            status,
            updatedAt: new Date().toISOString()
        });

        if (!updatedOrder) {
            return res.status(404).json({
                error: 'Pedido no encontrado',
                message: 'El pedido que intentas actualizar no existe'
            });
        }

        res.json({
            message: 'Estado del pedido actualizado exitosamente',
            data: updatedOrder
        });
    } catch (error) {
        console.error('Error actualizando estado del pedido:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al actualizar el estado del pedido'
        });
    }
});

// DELETE /api/orders/:id - Cancelar pedido (propietario o admin)
router.delete('/:id', (req, res) => {
    try {
        const order = ordersModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                error: 'Pedido no encontrado',
                message: 'El pedido que intentas cancelar no existe'
            });
        }

        // Verificar permisos
        if (req.user.role !== 'admin' && order.userId !== req.user.id) {
            return res.status(403).json({
                error: 'Acceso denegado',
                message: 'Solo puedes cancelar tus propios pedidos'
            });
        }

        // Solo se puede cancelar si está pendiente
        if (order.status !== 'pendiente') {
            return res.status(400).json({
                error: 'No se puede cancelar',
                message: 'Solo se pueden cancelar pedidos pendientes'
            });
        }

        const cancelledOrder = ordersModel.update(req.params.id, { 
            status: 'cancelado',
            updatedAt: new Date().toISOString()
        });

        res.json({
            message: 'Pedido cancelado exitosamente',
            data: cancelledOrder
        });
    } catch (error) {
        console.error('Error cancelando pedido:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al cancelar el pedido'
        });
    }
});

// GET /api/orders/stats/dashboard - Estadísticas para admin
router.get('/stats/dashboard', requireAdmin, (req, res) => {
    try {
        const orders = ordersModel.read();
        
        const stats = {
            total: orders.length,
            pendientes: orders.filter(o => o.status === 'pendiente').length,
            aceptados: orders.filter(o => o.status === 'aceptado').length,
            cancelados: orders.filter(o => o.status === 'cancelado').length,
            ingresoTotal: orders
                .filter(o => o.status === 'aceptado' || o.status === 'entregado')
                .reduce((sum, o) => sum + o.total, 0)
        };

        res.json({
            message: 'Estadísticas obtenidas exitosamente',
            data: stats
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener las estadísticas'
        });
    }
});

module.exports = router;
