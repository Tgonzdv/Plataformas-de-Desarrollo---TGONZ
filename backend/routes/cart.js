const express = require('express');
const DataModel = require('../models/DataModel');
const router = express.Router();

const cartsModel = new DataModel('carts.json');
const pizzasModel = new DataModel('pizzas.json');

// GET /api/cart - Obtener carrito del usuario
router.get('/', (req, res) => {
    try {
        const userId = req.user.id;
      
        let userCart = cartsModel.findByProperty('userId', userId);
      

        if (!userCart) {
           
            // Crear carrito vacío si no existe
            userCart = cartsModel.create({
                userId,
                items: [],
                total: 0,
                updatedAt: new Date().toISOString()
            });
           
        }

      

        res.json({
            message: 'Carrito obtenido exitosamente',
            data: userCart
        });
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al obtener el carrito'
        });
    }
});

// POST /api/cart/add - Agregar item al carrito
router.post('/add', (req, res) => {
    try {
        const userId = req.user.id;
        const { pizzaId, cantidad = 1 } = req.body;

       

        if (!pizzaId) {
            return res.status(400).json({
                error: 'Datos faltantes',
                message: 'ID de pizza es requerido'
            });
        }

        // Verificar que la pizza existe
        const pizza = pizzasModel.findById(pizzaId);
       
        if (!pizza) {
            return res.status(404).json({
                error: 'Pizza no encontrada',
                message: 'La pizza solicitada no existe'
            });
        }

        let userCart = cartsModel.findByProperty('userId', userId);
      
        
        if (!userCart) {
        
            userCart = cartsModel.create({
                userId,
                items: [],
                total: 0,
                updatedAt: new Date().toISOString()
            });
        }

        // Buscar si el item ya existe en el carrito
        const existingItemIndex = userCart.items.findIndex(item => item.pizzaId === parseInt(pizzaId));
     

        if (existingItemIndex >= 0) {
            // Actualizar cantidad si ya existe
          
            userCart.items[existingItemIndex].cantidad += parseInt(cantidad);
        } else {
            // Agregar nuevo item
           
            const maxId = userCart.items.length > 0 ? Math.max(...userCart.items.map(item => item.id)) : 0;
            const newItem = {
                id: maxId + 1,
                pizzaId: parseInt(pizzaId),
                nombre: pizza.nombre,
                cantidad: parseInt(cantidad),
                precio: pizza.precio
            };
        
            userCart.items.push(newItem);
        }

        // Recalcular total
        userCart.total = userCart.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        userCart.updatedAt = new Date().toISOString();

      
        // Actualizar carrito
        const updatedCart = cartsModel.update(userCart.id, userCart);
        

        res.json({
            message: 'Item agregado al carrito exitosamente',
            data: updatedCart
        });
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al agregar item al carrito'
        });
    }
});

// PUT /api/cart/item/:itemId - Actualizar cantidad de item
router.put('/item/:itemId', (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = parseInt(req.params.itemId);
        const { cantidad } = req.body;

        if (!cantidad || cantidad < 1) {
            return res.status(400).json({
                error: 'Cantidad inválida',
                message: 'La cantidad debe ser mayor a 0'
            });
        }

        const userCart = cartsModel.findByProperty('userId', userId);
        if (!userCart) {
            return res.status(404).json({
                error: 'Carrito no encontrado',
                message: 'No tienes un carrito activo'
            });
        }

        const itemIndex = userCart.items.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({
                error: 'Item no encontrado',
                message: 'El item no existe en tu carrito'
            });
        }

        userCart.items[itemIndex].cantidad = parseInt(cantidad);
        userCart.total = userCart.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        userCart.updatedAt = new Date().toISOString();

        const updatedCart = cartsModel.update(userCart.id, userCart);

        res.json({
            message: 'Cantidad actualizada exitosamente',
            data: updatedCart
        });
    } catch (error) {
        console.error('Error actualizando carrito:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al actualizar el carrito'
        });
    }
});

// DELETE /api/cart/item/:itemId - Eliminar item del carrito
router.delete('/item/:itemId', (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = parseInt(req.params.itemId);

        const userCart = cartsModel.findByProperty('userId', userId);
        if (!userCart) {
            return res.status(404).json({
                error: 'Carrito no encontrado',
                message: 'No tienes un carrito activo'
            });
        }

        const initialLength = userCart.items.length;
        userCart.items = userCart.items.filter(item => item.id !== itemId);

        if (userCart.items.length === initialLength) {
            return res.status(404).json({
                error: 'Item no encontrado',
                message: 'El item no existe en tu carrito'
            });
        }

        userCart.total = userCart.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        userCart.updatedAt = new Date().toISOString();

        const updatedCart = cartsModel.update(userCart.id, userCart);

        res.json({
            message: 'Item eliminado del carrito exitosamente',
            data: updatedCart
        });
    } catch (error) {
        console.error('Error eliminando del carrito:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al eliminar item del carrito'
        });
    }
});

// DELETE /api/cart - Limpiar carrito
router.delete('/', (req, res) => {
    try {
        const userId = req.user.id;
        const userCart = cartsModel.findByProperty('userId', userId);

        if (!userCart) {
            return res.status(404).json({
                error: 'Carrito no encontrado',
                message: 'No tienes un carrito activo'
            });
        }

        const clearedCart = cartsModel.update(userCart.id, {
            items: [],
            total: 0,
            updatedAt: new Date().toISOString()
        });

        res.json({
            message: 'Carrito limpiado exitosamente',
            data: clearedCart
        });
    } catch (error) {
        console.error('Error limpiando carrito:', error);
        res.status(500).json({
            error: 'Error del servidor',
            message: 'Error al limpiar el carrito'
        });
    }
});

module.exports = router;
