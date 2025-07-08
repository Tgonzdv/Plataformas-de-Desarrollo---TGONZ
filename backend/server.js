const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const pizzaRoutes = require('./routes/pizzas');
const cartRoutes = require('./routes/cart');
const favoriteRoutes = require('./routes/favorites');
const orderRoutes = require('./routes/orders');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // URL del frontend React
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/pizzas', authenticateToken, pizzaRoutes);
app.use('/api/cart', authenticateToken, cartRoutes);
app.use('/api/favorites', authenticateToken, favoriteRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);

// Ruta de salud para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'PizzaYa API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta de diagnóstico para verificar autenticación
app.get('/api/debug', authenticateToken, (req, res) => {
    res.json({
        message: 'Autenticación exitosa',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// Ruta de diagnóstico para verificar contenido del archivo carts.json
app.get('/api/debug/carts', authenticateToken, (req, res) => {
    try {
        const DataModel = require('./models/DataModel');
        const cartsModel = new DataModel('carts.json');
        const allCarts = cartsModel.getAll();
        
        res.json({
            message: 'Contenido completo del archivo carts.json',
            user: req.user,
            carts: allCarts,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al leer archivo carts.json',
            message: error.message
        });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
    console.log(`🍕 Servidor PizzaYa corriendo en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
